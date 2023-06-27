import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

const linkStyle = {
  width: '750px',
  height: '350px',
  display: 'block',
  margin: '25px',
  border: '1px solid grey'
}

const Nav = () => {
  return (
    <div>
      <Link style={linkStyle} to="/one">Metronome</Link>
      <Link style={linkStyle} to="/two">Clock</Link>
    </div>
  );
};

export default Nav;
