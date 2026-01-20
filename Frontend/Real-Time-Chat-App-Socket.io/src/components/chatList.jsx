import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { socket } from '../socket';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export default function ChatList({sendDataToParent, userData}){

    const [chatList, setChatList] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    

    const handleChat = async(chatId)=>{

        console.log("handle chat",chatId);

        if (currentRoom) {
            socket.emit('leave', {currentRoom});
        }
        console.log(chatId)

        socket.emit('join', {chatId});
        setCurrentRoom(chatId);


        // const response = await axios.get(`${backendUrl}/chat-messages`,{
        //     params:{chatId},
        //     headers:{
        //         'Content-Type': 'application/json',
        //         'authorization': localStorage.getItem('authorization')
        //     }
        // });

        // const messages = response.data.messages;
        // console.log(messages);
        // setChatMessages(messages);
        // sendData();

        sendDataToParent(chatId);
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
            console.log(response.data.chats);
            setChatList(response.data.chats);
        }
        fetchChatList();
        
    },[])

    const otherUser = (name)=>{
        const names = name.split("-");
        return names[0] == userData.username ? names[1] : names[0];
    }

    return(
        <>
            <div>
                {chatList.map(chat=>(
                    <div onClick={()=>handleChat(chat._id)} key={chat._id}>{chat.isGroup ? chat.name : otherUser(chat.name) }</div>
                ))}
            </div>
        </>
    )
}