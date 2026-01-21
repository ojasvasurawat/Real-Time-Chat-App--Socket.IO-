import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
const backendUrl = import.meta.env.VITE_BACKEND_URL;

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function SignUp(){
    const [formData, setFormData] = useState({
        displayName:"", 
        username:"", 
        email:"", 
        password:""
    });
    const [buttonLoading, setButtonLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSignup(e){
        e.preventDefault();
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
        <div className="flex items-center justify-center h-screen">
            <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                Enter your details to start chatting in real time
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
                <CardContent>
                    <div className="grid gap-2 mb-2">
                        <Label htmlFor="email">Display Name</Label>
                        <input 
                            className="py-0.5"
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
                    </div>
                    <div className="grid gap-2 mb-2">
                    <Label htmlFor="email">Username</Label>
                    <input 
                        className="py-0.5"
                        id="username" 
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
                    </div>
                    <div className="grid gap-2 mb-2">
                    <Label htmlFor="email">Email</Label>
                    <input 
                        className="py-0.5"
                        id="email" 
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
                    </div>
                    <div className="grid gap-2">
                    <Label htmlFor="email">Password</Label>
                    <input 
                        className="py-0.5"
                        id="password"
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
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button variant="outline" type="submit" className="w-full mx-2" disabled={buttonLoading}>
                        {buttonLoading ? "Creating account..." : "Sign Up"}
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link to="/signin">Already have an account? Login</Link>
                    </Button>
                </CardFooter>
            </form>
            </Card>
        </div>
        </>
    )
}