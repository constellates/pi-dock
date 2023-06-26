import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import SwipeableViews from 'react-swipeable-views';
import { Metronome } from './components';

const styles = {
  slide: {
    height: 480,
    width: 800,
    padding: 15,
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
      <Metronome></Metronome>
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide3)}>
      slide n°3
    </div>
  </BindKeyboardSwipeableViews>
);


function MainComponent() {
  return (
    <div>
      <MyComponent></MyComponent>
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
