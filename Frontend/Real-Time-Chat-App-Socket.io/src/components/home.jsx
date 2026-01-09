import { useRef } from "react"
import Chat from "./chat";
import {useNavigate} from "react-router-dom";

export default function Home(){
    const name = useRef(null);
    const navigate = useNavigate();

    function handleKeyDown(event){
        if(event.key === "Enter"){
            enterChat();
        }
    }

    function enterChat(){
        console.log(name.current.value);
        // <Chat name={name.current.value}/>
        if(name.current.value){
            navigate("/chat", {state:{name:name.current.value}});
        }
    }
    return(
        <>
            <input placeholder="enter your name" ref={name} onKeyDown={handleKeyDown}/>
            <button onClick={enterChat}>enter chat</button>
        </>
    )
}