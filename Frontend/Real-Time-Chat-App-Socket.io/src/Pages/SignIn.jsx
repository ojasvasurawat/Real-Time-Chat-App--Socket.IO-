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
            <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md rounded-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold ">
            Welcome Back
          </CardTitle>
          <CardDescription className="mt-2">
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
              <Label className="">Email</Label>
              <Input
                type="email"
                value={signinEmail}
                onChange={(e) => setSigninEmail(e.target.value)}
                placeholder="Enter your email"
                className=""
              />
            </div>

            <div className="space-y-1">
              <Label className="">Password</Label>
              <Input
                type="password"
                value={signinPassword}
                onChange={(e) => setSigninPassword(e.target.value)}
                placeholder="Enter your password"
                className=""
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              variant="outline"
              type="submit"
              className="w-full font-semibold"
              disabled={buttonLoading}
            >
              {buttonLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-sm text-center">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className=" underline "
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