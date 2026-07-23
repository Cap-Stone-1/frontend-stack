import { useState } from 'react';
import { Route, Routes } from 'react-router';

import Home from './pages/Home';
import RootLayout from './pages/RootLayout';
import CreatePoll from './pages/CreatePoll';

function App() {

  return (
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />}/>
        <Route path='new' element={<CreatePoll />}/>
      </Route>
    </Routes>
  )
}

export default App
