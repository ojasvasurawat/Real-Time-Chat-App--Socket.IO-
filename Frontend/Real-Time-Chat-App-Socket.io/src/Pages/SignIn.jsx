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
        if (signinEmail === "" || signinPassword === "") {
            toast.warning("Please fill in all required fields.");
            setButtonLoading(false);
            return;
        }

        console.log(backendUrl);
        console.log(signinEmail);

        try{
          const response = await axios.post(`${backendUrl}/signin`, {
              email: signinEmail,
              password: signinPassword
          })

          if(response.data.token){
              localStorage.setItem("authorization", response.data.token);
              console.log(response.data);
              toast.success(`Welcome, ${response.data.user.displayName}`);
              setTimeout(()=>{
                navigate("/");
              },5000);
          }
          else{
              setButtonLoading(false);
              toast.error("Login Failed");
          }
        }catch(error){
          console.error("Login failed:", error);
            if (error.response?.data) {
                setButtonLoading(false)
                toast.error(`Login failed: ${error.response.data}`);
            } else {
                setButtonLoading(false)
                toast.error("Login failed: Unknown error occurred");
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
            Welcome Back
          </CardTitle>
          <CardDescription className="mt-2 text-muted">
            Sign in to continue chatting in real time
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignin();
          }}
          className="space-y-5 mt-4"
        >
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label className="text-text">Email</Label>
              <Input
                type="email"
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                placeholder="Enter your email"
                className={"mb-2 focus:border-primary/60 focus:ring-0 focus-visible:ring-1"}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-text">Password</Label>
              <Input
                type="password"
                value={signinPassword}
                onChange={(e) => setSigninPassword(e.target.value)}
                placeholder="Enter your password"
                className={"mb-2 focus:border-primary/60 focus:ring-0 focus-visible:ring-1"}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              variant="outline"
              type="submit"
              className="w-full font-semibold bg-primary/70 border border-primary  hover:bg-primary/90 hover:shadow-md"
              disabled={buttonLoading}
            >
              {buttonLoading ? "Loging in..." : "Log In"}
            </Button>

            <p className="text-sm text-center text-text">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className=" underline text-primary"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
        </>
    )
}