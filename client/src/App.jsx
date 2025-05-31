import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes/Routes'
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
function App() {

  return (
    <>
     <Router>
      <Routes/>
     </Router>
    </>
  )
}

export default App
