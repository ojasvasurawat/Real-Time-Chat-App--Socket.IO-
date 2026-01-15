import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function SignUp(){
    const [formData, setFormData] = useState({
        displayName:"", 
        username:"", 
        email:"", 
        password:""
    });
    const [buttonLoading, setButtonLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSignup(){
        setButtonLoading(true);
        if (formData.displayName === "" || formData.username === "" || formData.email === "" || formData.password === "") {
            toast.warning("Enter the details");
            setButtonLoading(false);
            return;
        }
        if (formData.password.length < 8 ) {
            toast.warning("Password must be at least 8 characters long.");
            setButtonLoading(false)
            return;
        }

        console.log(backendUrl);

        try{
            const response = await axios.post(`${backendUrl}/signup`, {
                displayName: formData.displayName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            })

            if(response.data){
                toast.success("Account created successfully");
                navigate("/signin");
            }
            else{
                setButtonLoading(false);
                toast.error("Signup Failed");
            }
        }
        catch(error){
            console.error("Signup failed:", error);
            if (error.response?.data?.message) {
                setButtonLoading(false)
                toast.error(`Signup failed: ${error.response.data.message}`);
            } else {
                setButtonLoading(false)
                toast.error("Signup failed: Unknown error occurred");
            }
        }
    }

    return(
        <>
            <form>
                <input 
                    id="displayName" 
                    type="displayName" 
                    value={formData.displayName} 
                    onChange={(e)=>{
                        setFormData({
                            ...formData,
                            displayName: e.target.value
                        })
                    }}
                    placeholder="enter your display name"
                />
                <input id="username" 
                    type="username" 
                    value={formData.username} 
                    onChange={(e)=>{
                        setFormData({
                            ...formData,
                            username: e.target.value
                        })
                    }}
                    placeholder="enter your username"
                />
                <input id="email" 
                    type="email" 
                    value={formData.email} 
                    onChange={(e)=>{
                        setFormData({
                            ...formData,
                            email: e.target.value
                        })
                    }}
                    placeholder="enter your email"
                />
                <input id="password" 
                    type="password" 
                    value={formData.password} 
                    onChange={(e)=>{
                        setFormData({
                            ...formData,
                            password: e.target.value
                        })
                    }}
                    placeholder="enter your password"
                />
            </form>
            <button onClick={handleSignup} disabled={buttonLoading}>
                {buttonLoading? "Wait" : "Sign Up"}
            </button>
        </>
    )
}