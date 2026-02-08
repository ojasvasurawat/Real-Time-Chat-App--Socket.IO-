import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
const backendUrl = import.meta.env.VITE_BACKEND_URL;

import { Button } from "@/components/ui/button"
import {
  Card,
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
            toast.warning("Please fill in all required fields.");
            setButtonLoading(false);
            return;
        }
        
        
        if (formData.displayName.length < 3) {
            toast.warning("Display name is too short.");
            setButtonLoading(false);
            return;
        }

        if (formData.displayName.length > 50) {
            toast.warning("Display name is too long.");
            setButtonLoading(false);
            return;
        }


        if (formData.username.length < 3) {
            toast.warning("Username must be at least 3 characters.");
            setButtonLoading(false);
            return;
        }

        if (formData.username.length > 20) {
            toast.warning("Username cannot be longer than 20 characters.");
            setButtonLoading(false);
            return;
        }
        if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            toast.warning("Username can only contain letters, numbers, and underscores.");
            setButtonLoading(false);
            return;
        }


        if (formData.email.length < 3) {
            toast.warning("Email is too short.");
            setButtonLoading(false);
            return;
        }

        if (formData.email.length > 320) {
            toast.warning("Email is too long.");
            setButtonLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.warning("Please enter a valid email address.");
            setButtonLoading(false);
            return;
        }


        if (formData.password.length < 8) {
            toast.warning("Password must be at least 8 characters long.");
            setButtonLoading(false);
            return;
        }

        if (formData.password.length > 20) {
            toast.warning("Password cannot be longer than 20 characters.");
            setButtonLoading(false);
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
                setTimeout(()=>{
                  navigate("/signin");
                },5000);
            }
            else{
                setButtonLoading(false);
                toast.error("Signup Failed");
            }
        }
        catch(error){
            console.error("Signup failed:", error);
            if(error.response?.data?.errorMessage){
              setButtonLoading(false)
              const parsed = JSON.parse(error.response.data.errorMessage);
              // console.log(parsed);
              for(const data of parsed){
                console.log(data.message);
                toast.error(`Signup failed: ${data.message}`);
              }
            }
            else if (error.response?.data?.message) {
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
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
          <ToastContainer/>
      <Card className="w-full max-w-md rounded-xl bg-surface">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-text">
            Create an Account
          </CardTitle>
          <CardDescription className=" mt-2 text-muted">
            Start chatting in real-time with friends and teams
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup} className="space-y-5 mt-4">
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-text">Display Name</Label>
              <Input
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="John Doe"
                className={"mb-2 focus:border-primary/60 focus:ring-0 focus-visible:ring-1"}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-text">Username</Label>
              <Input
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="John_Doe_01"
                className={"mb-2 focus:border-primary/60 focus:ring-0 focus-visible:ring-1"}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-text">Email</Label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="johndoe@gmail.com"
                className={"mb-2 focus:border-primary/60 focus:ring-0 focus-visible:ring-1"}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-text">Password</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className={"mb-2 focus:border-primary/60 focus:ring-0 focus-visible:ring-1"}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button
            variant="outline"
              type="submit"
              className="w-full font-semibold bg-primary/70 border border-primary  hover:bg-primary/90 hover:shadow-md"
              disabled={buttonLoading}
            >
              {buttonLoading ? "Creating account..." : "Sign Up"}
            </Button>

            <p className="text-sm  text-center text-text">
              Already have an account?{" "}
              <Link to="/signin" className=" underline text-primary">
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