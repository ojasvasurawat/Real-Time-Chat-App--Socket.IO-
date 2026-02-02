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
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-2xl border border-border bg-surface/95 backdrop-blur-md rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">
            Create an Account
          </CardTitle>
          <CardDescription className="text-gray-300 mt-2">
            Start chatting in real-time with friends and teams
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup} className="space-y-5 mt-4">
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-gray-200">Display Name</Label>
              <Input
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Enter your display name"
                className="bg-background/80 text-white border-border focus:border-accent focus:ring-accent"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-gray-200">Username</Label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter your username"
                className="bg-background/80 text-white border-border focus:border-accent focus:ring-accent"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-gray-200">Email</Label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="bg-background/80 text-white border-border focus:border-accent focus:ring-accent"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-gray-200">Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="bg-background/80 text-white border-border focus:border-accent focus:ring-accent"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
              disabled={buttonLoading}
            >
              {buttonLoading ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-sm text-gray-400 text-center">
              Already have an account?{" "}
              <Link to="/signin" className="text-accent underline hover:text-accent/80">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
        </>
    )
}