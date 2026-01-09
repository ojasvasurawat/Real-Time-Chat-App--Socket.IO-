// import './App.css'

import { Route, Routes } from "react-router-dom";
import Home from "./components/home";
import Chat from "./components/chat";

function App() {
  return (
    <>
      {/* <Home/> */}
      <Routes>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
