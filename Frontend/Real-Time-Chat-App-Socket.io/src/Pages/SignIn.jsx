import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function SignIn(){

    const [signinEmail, setSigninEmail] = useState("");
    const [signinPassword, setSigninPassword] = useState("");
    const [buttonLoading, setButtonLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignin = async()=>{
        setButtonLoading(true);
        if (signinPassword === "" || signinEmail === "" ) {
            toast.warning("Enter the details");
            setButtonLoading(false);
            return;
        }

        console.log(backendUrl);

        const response = await axios.post(`${backendUrl}/signin`, {
            email: signinEmail,
            password: signinPassword
        })

        if(response.data.token){
            localStorage.setItem("authorization", response.data.token);
            toast.success(`Welcome, ${response.data.user.name}`);
            navigate("/");
        }
        else{
            setButtonLoading(false);
            toast.error("Login Failed");
        }
    }

    return(
        <>
            <label>Email Address</label>
            <input 
                id="email"
                type="email"
                value={signinEmail}
                onChange={(e)=>{setSigninEmail(e.target.value)}}
                placeholder="Enter your email"
            />
            <label>Password</label>
            <input 
                id="password"
                type="password"
                value={signinPassword}
                onChange={(e)=>{setSigninPassword(e.target.value)}}
                placeholder="Enter your password"
            />
            <button onClick={handleSignin} disabled={buttonLoading}>
                {buttonLoading? "Wait" : "Sign In"}
            </button>
        </>
    )
}