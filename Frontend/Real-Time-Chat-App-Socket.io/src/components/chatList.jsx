import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../socket';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export default function ChatList(props){

    const [chatList, setChatList] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    

    const handleChat = async(roomId)=>{

        if (currentRoom) {
            socket.emit("leave", { room: currentRoom });
        }
        console.log(roomId)

        socket.emit('join', {room:roomId});
        setCurrentRoom(roomId);


        const response = await axios.get(`${backendUrl}/chat-messages`,{
            params:{roomId},
            headers:{
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authorization')
            }
        });

        const messages = response.data.messages;
        // console.log(messages);
        // setChatMessages(messages);
        // sendData();

        props.sendDataToParent(response.data.messages);
    }

    // useEffect(()=>{
    //     const sendData = () => {
    //         // Call the parent's function via props, passing the variable
    //         console.log(chatMessages);
    //         props.sendDataToParent(chatMessages);
    //     }
    //     sendData();
    // },[chatMessages])

    useEffect(()=>{
        async function fetchChatList(){
            const response = await axios.get(`${backendUrl}/chat-list`,{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });
            // console.log(response.data.chatList);
            setChatList(response.data.chatList);
        }
        fetchChatList();
        
    },[])

    return(
        <>
            <div>
                {chatList.map(chat=>(
                    <div onClick={()=>handleChat(chat.roomId)} key={chat.roomId}>{chat.chatUsername}</div>
                ))}
            </div>
        </>
    )
}