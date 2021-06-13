import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';
import ROUTES from './Routes';

import './App.css';

export default function App() {
  const header = "caydi jay doesn't understand";

  return (
    <BrowserRouter>
      <h1>{header}</h1>
      <Navigation routes={ROUTES} />
    </BrowserRouter>
  )
}