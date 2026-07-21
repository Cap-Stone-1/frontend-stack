import { useState } from 'react';
import { Route, Routes } from 'react-router';

import Home from './pages/Home';
import RootLayout from './pages/RootLayout';

function App() {

  return (
      <Routes>
        <Route path='/' element={<RootLayout />}>


        </Route>
      </Routes>
  )
}

export default App
