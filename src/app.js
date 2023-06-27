import React from 'react';
import ReactDOM from 'react-dom/client';
import SwipeableViews from 'react-swipeable-views';
import { Metronome, Nav } from './components';
import { Link } from "react-router-dom";
import {
  HashRouter,
  Route,
  Routes
} from "react-router-dom";

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
      <Metronome></Metronome>
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide2)}>
      slide n°2
    </div>
    <div style={Object.assign({}, styles.slide, styles.slide3)}>
      slide n°3
    </div>
  </BindKeyboardSwipeableViews>
);


function MainComponent() {
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route path="/" exact     element={ <Nav /> } />
          <Route path="/one"  element={ <Metronome /> } />
          <Route path="/two" element={ <MyComponent /> } />
        </Routes>
      <Link to="/" style={{ width: '50px', height: '50px', border: '1px solid blue', position: 'fixed', right: '0', top: '0'}}></Link>
      </HashRouter>
      {/* <MyComponent></MyComponent> */}
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
