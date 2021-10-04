import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';

import NEWS from './News';
import THINGS from './things/Things';
import THOUGHTS from './thoughts/Thoughts';

import './App.css';

const ROUTES = [ NEWS, THINGS, THOUGHTS ]

export default function App() {
  const header = "caydi jay doesn't understand";

  return (
    <BrowserRouter>
      <h1>{header}</h1>
      <Navigation routes={ROUTES} />
    </BrowserRouter>
  )
}