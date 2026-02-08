import './App.css'

import { Route, Routes } from "react-router-dom";
import SignIn from "./Pages/Signin";
import SignUp from "./Pages/SignUp";
import Home from './Pages/Home';
import Landing from './Pages/Landing';

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/" element={<Landing/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
