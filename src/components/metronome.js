import React, { useState, useEffect, useRef } from 'react';

class MetronomeJs
{
    constructor(tempo = 120)
    {
        this.audioContext = null;
        this.notesInQueue = [];         // notes that have been put into the web audio and may or may not have been played yet {note, time}
        this.currentBeatInBar = 0;
        this.beatsPerBar = 4;
        this.tempo = tempo;
        this.lookahead = 25;          // How frequently to call scheduling function (in milliseconds)
        this.scheduleAheadTime = 0.1;   // How far ahead to schedule audio (sec)
        this.nextNoteTime = 0.0;     // when the next note is due
        this.isRunning = false;
        this.intervalID = null;
        this.frequency = 800;
        this.onBeat = () => {};
    }

    nextNote()
    {
        // Advance current note and time by a quarter note (crotchet if you're posh)
        var secondsPerBeat = 60.0 / this.tempo; // Notice this picks up the CURRENT tempo value to calculate beat length.
        this.nextNoteTime += secondsPerBeat; // Add beat length to last beat time
    
        this.currentBeatInBar++;    // Advance the beat number, wrap to zero
        if (this.currentBeatInBar == this.beatsPerBar || this.currentBeatInBar > this.beatsPerBar) {
            this.currentBeatInBar = 0;
        }
    }

    scheduleNote(beatNumber, time)
    {
        // push the note on the queue, even if we're not playing.
        this.notesInQueue.push({ note: beatNumber, time: time });
    
        // create an oscillator
        const osc = this.audioContext.createOscillator();
        const envelope = this.audioContext.createGain();
        
        osc.frequency.value = (beatNumber % this.beatsPerBar == 0) ? this.frequency + 200 : this.frequency;
        envelope.gain.value = 1;
        envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

        osc.connect(envelope);
        envelope.connect(this.audioContext.destination);
    
        osc.start(time);
        osc.stop(time + 0.03);
        
        // call onBeat event (not as accurate as sound)
        this.onBeat(beatNumber);
    }

    scheduler()
    {
        // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
            this.scheduleNote(this.currentBeatInBar, this.nextNoteTime);
            this.nextNote();
        }
    }

    start()
    {
        if (this.isRunning) return;

        if (this.audioContext == null)
        {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        this.isRunning = true;

        this.currentBeatInBar = 0;
        this.nextNoteTime = this.audioContext.currentTime + 0.05;

        this.intervalID = setInterval(() => this.scheduler(), this.lookahead);
    }

    stop()
    {
        this.isRunning = false;

        clearInterval(this.intervalID);
    }

    startStop()
    {
        if (this.isRunning) {
            this.stop();
        }
        else {
            this.start();
        }
    }
}
var metronome = new MetronomeJs();

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [beatsPerBar, setBeatsPerBar] = useState(4);
  const [beatArray, setBeatArray] = useState([0,1,2,3]);
  const [frequency, setFrequency] = useState(800);
  const [currentBeat, setCurrentBeat] = useState(0);

  const handlePlayPause = () => {
    metronome.startStop();
    setIsPlaying(!isPlaying);
  };

  const handleBpmChange = (event) => {
    metronome.tempo = event.target.value;
    setBpm(event.target.value);
  };

  const handleBeatsPerBarChange = (event) => {
    metronome.beatsPerBar = event.target.value;
    setBeatsPerBar(event.target.value);
    setBeatArray(Array.from({ length: event.target.value }, (_, index) => index));
  };

  const handleFrequencyChange = (event) => {
    metronome.frequency = parseInt(event.target.value);
    setFrequency(event.target.value);
  };

  useEffect(() => {
    const handleBeat = (beat) => {
      setCurrentBeat(beat);
    };

    metronome.onBeat = handleBeat;

    return () => {
      metronome.onBeat = null; // Clean up the event listener
    };
  }, []);

  return (
    <div>
      <h1>Metronome</h1>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <p>BPM: {bpm}</p>
      <input type="range" min="40" max="240" value={bpm} onChange={handleBpmChange} />
      <p>Beats Per Bar: {beatsPerBar}</p>
      <input type="range" min="1" max="16" value={beatsPerBar} onChange={handleBeatsPerBarChange} />
      <p>Frequency: {frequency}</p>
      <input type="range" min="0" max="2000" value={frequency} onChange={handleFrequencyChange} /><br />
      {beatArray.map((index) => (
        <input type="radio" key={index} checked={currentBeat == index} readOnly />
      ))}
      <h2>{currentBeat + 1}</h2>
    </div>
  );
};

export default Metronome;
