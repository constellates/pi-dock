import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import SwipeableViews from 'react-swipeable-views';

const styles = {
  slide: {
    padding: 15,
    minHeight: 100,
    color: '#fff',
  },
  slide1: {
    background: '#FEA900',
  },
  slide2: {
    background: '#B3DC4A',
  },
  slide3: {
    background: '#6AC0FF',
  },
};

import { bindKeyboard } from 'react-swipeable-views-utils';

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews)

const MyComponent = () => (
  <BindKeyboardSwipeableViews>
    <div style={Object.assign({}, styles.slide, styles.slide1)}>
      slide n°1
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide2)}>
      slide n°2
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide3)}>
      slide n°3
    </div>
  </BindKeyboardSwipeableViews>
);

const Metronome = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [intervalId, setIntervalId] = useState(null);
  const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());

  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / bpm;
      const id = setInterval(tick, interval);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, bpm]);

  const tick = () => {
    console.log('tick');
    // Play a sound or perform any other metronome action here
    const audioContext = audioContextRef.current;
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleBpmChange = (event) => {
    setBpm(event.target.value);
  };

  return (
    <div>
      <h1>Metronome</h1>
      <p>BPM: {bpm}</p>
      <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <input type="range" min="40" max="240" value={bpm} onChange={handleBpmChange} />
    </div>
  );
};

function MainComponent() {
  return (
    <div>
      <MyComponent></MyComponent>
      <Metronome></Metronome>
    </div>
  );
}

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <MainComponent />
    </React.StrictMode>,
  );
}

render();
