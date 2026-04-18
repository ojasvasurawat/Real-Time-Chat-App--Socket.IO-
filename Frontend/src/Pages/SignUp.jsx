import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify'
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

import { Eye, EyeOff } from "lucide-react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
 } from "@/components/ui/alert-dialog";

 import { REGEXP_ONLY_DIGITS } from "input-otp"
 import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { Field, FieldLabel } from "@/components/ui/field"


import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"


import { GoogleOAuthProvider } from '@react-oauth/google';

const oauthClientId = import.meta.env.VITE_OAUTH_CLIENT_ID;

import { GoogleLogin } from '@react-oauth/google';


import {jwtDecode} from "jwt-decode"


export default function SignUp(){
    const [formData, setFormData] = useState({
        displayName:"", 
        username:"", 
        email:"", 
        password:""
    });
    const [buttonLoading, setButtonLoading] = useState(false);
    const navigate = useNavigate();
    
    const [showPassword, setShowPassword] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const [code, setCode] = useState();

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

        // console.log(backendUrl);

        try{
            const response = await axios.post(`${backendUrl}/signup`, {
                displayName: formData.displayName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                sub: ""
            })

            if(response.data){
                setIsOpen(true);
                toast.success("Enter the code we send you on mail");
                // setTimeout(()=>{
                //   navigate("/signin");
                // },5000);
                // navigate("/signin");
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
                // console.log(data.message);
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


    async function verifyCode(){
      if(code === undefined){
        toast.error("complete the code");
      }
      else if(code.length < 6){
        toast.error("complete the code");
      }
      else{

        try{

          // console.log(typeof(code));
            const response = await axios.post(`${backendUrl}/verifyCode`, {
                displayName: formData.displayName,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                code: code,
                sub: ""
            })

            if(response.data){
                setIsOpen(false);
                toast.success("User created successfully");
                // setTimeout(()=>{
                //   navigate("/signin");
                // },5000);
                navigate("/signin");
            }
            else{
                setButtonLoading(false);
                setIsOpen(false);
                toast.error("Expired or Wrong code");
            }
        }
        catch(error){
            console.error("Signup failed:", error);
            if(error.response?.data?.errorMessage){
              setButtonLoading(false)
              const parsed = JSON.parse(error.response.data.errorMessage);
              // console.log(parsed);
              for(const data of parsed){
                // console.log(data.message);
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
    }



    const responseMessage = async (response) => {
        // console.log(response);
        const decoded = jwtDecode(response.credential);

        // console.log("decoded data: ",decoded);

        const nameArr = decoded.name.split(" ");
        const username = nameArr[0]+decoded.sub.substring(0,4);

        try{

          const response = await axios.post(`${backendUrl}/signup`, {
            displayName: decoded.name,
            username: username,
            email: decoded.email,
            sub: decoded.sub,
            password: ""
          })

          if(response.data){
            toast.success("user created successfully")
            navigate("/signin");
          }

        }
        catch(error){
            console.error("Signup failed:", error);
            if(error.response?.data?.errorMessage){
              setButtonLoading(false)
              const parsed = JSON.parse(error.response.data.errorMessage);
              // console.log(parsed);
              for(const data of parsed){
                // console.log(data.message);
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

    };
    const errorMessage = (error) => {
        console.log(error);
    };




    return(
        <>
        <GoogleOAuthProvider clientId={oauthClientId}>
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-background">
          {/* <ToastContainer/> */}
          <Toaster />
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
              <div className="flex">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className={"mb-2 focus:border-primary/60 focus:ring-0 focus-visible:ring-1"}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 mt-2">
            <AlertDialog open={isOpen} onOpenChange={setIsOpen} >
                <Button
                variant="outline"
                  type="submit"
                  className="w-full font-semibold bg-primary/70 border border-primary  hover:bg-primary/90 hover:shadow-md"
                  disabled={buttonLoading}
                >
                  {buttonLoading ? "Creating account..." : "Sign Up"}
                </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Enter the code we send you on mail</AlertDialogTitle>
                  <AlertDialogDescription>
                    We send you the validation code on you mail, enter it below.
                    The Code will expire in 2 minutes.
                    <Field className="w-fit">
                      <FieldLabel htmlFor="digits-only">Enter Code</FieldLabel>
                      <InputOTP id="digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={code} onChange={(value)=> setCode(value)}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </Field>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={()=>{setButtonLoading(false);}}>Cancel</AlertDialogCancel>
                  <Button onClick={verifyCode}>Validate</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />

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

    </GoogleOAuthProvider>
        </>
    )
}