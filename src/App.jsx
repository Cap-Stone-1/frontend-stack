import { useState } from 'react';
import { Route, Routes } from 'react-router';

import Home from './pages/Home';
import RootLayout from './pages/RootLayout';
import CreatePoll from './pages/CreatePoll';
import PollResults from './pages/PollResults';

function App() {

  return (
    <Routes>
      <Route path='/' element={<RootLayout />}>
        <Route index element={<Home />}/>
        <Route path='new' element={<CreatePoll />}/>
        <Route path='/results/:id' element={<PollResults />}/>
      </Route>
    </Routes>
  )
}

export default App
