import './App.css'

import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Chat from "./components/chat";
import SignIn from "./Pages/Signin";
import SignUp from "./Pages/SignUp";
import Chats from "./Pages/Chats";

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/chats" element={<Chats/>}/>
        {/* <Route path="/" element={<Home/>}/> */}
      </Routes>
    </>
  )
}

export default App
