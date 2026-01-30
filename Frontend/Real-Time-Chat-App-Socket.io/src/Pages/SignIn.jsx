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
        console.log(signinEmail);
        console.log(signinEmail.type);

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
        <div className="flex items-center justify-center h-screen">
            <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                Enter your details to start chatting in real time
                </CardDescription>
            </CardHeader>
            <form   >
                <CardContent>
                    <div className="grid gap-2 mb-2">
                        <Label>Email</Label>
                        <Input 
                            id="email"
                            type="email"
                            value={signinEmail}
                            onChange={(e)=>{setSigninEmail(e.target.value)}}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="grid gap-2 mb-2">
                        <Label>Password</Label>
                        <Input 
                            id="password"
                            type="password"
                            value={signinPassword}
                            onChange={(e)=>{setSigninPassword(e.target.value)}}
                            placeholder="Enter your password"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button onClick={handleSignin} variant="outline" type="submit" className="w-full mx-2" disabled={buttonLoading}>
                        {buttonLoading? "Wait" : "Sign In"}
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link to="/signin">Don't have an account? Signup</Link>
                    </Button>
                </CardFooter>
            </form>
            </Card>
        </div>
        </>
    )
}