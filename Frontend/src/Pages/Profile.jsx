import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Check,  Pencil } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { toast } from "react-toastify";

import { Eye, EyeOff } from "lucide-react"


export default function Profile({ onBack }) {

    const [currentDisplayName, setCurrentDisplayName] = useState("");
    const [currentUsername, setCurrentUsername] = useState("");
    const [currentEmail, setCurrentEmail] = useState("");
    const [changedDisplayName, setChangedDisplayName] = useState("");
    const [changedPassword, setChangedPassword] = useState("");
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [oldAvatarUrl, setOldAvatarUrl] = useState(null);
    const [buttonLoadingLogout, setButtonLoadingLogout] = useState(false);
    const [buttonLoadingUpdate, setButtonLoadingUpdate] = useState(false);
    const [buttonLoadingAvatar, setButtonLoadingAvatar] = useState(false);

    const [displayNameInputState, setDisplayNameInputState] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isMobile = useIsMobile();


    useEffect(() => {
        axios(`${backendUrl}/info`, {
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authorization')
            }
        }).then((response) => {
            // console.log(response);
            setCurrentDisplayName(response.data.user.displayName);
            setCurrentUsername(response.data.user.username);
            setCurrentEmail(response.data.user.email);
            setOldAvatarUrl(response.data.user.avatarUrl);
        }).catch((e) => {
            if (e) {
                navigate("/signin");
            }
        })
    }, [])


    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = async (e) => {
        setButtonLoadingAvatar(true);
        const file = e.target.files?.[0];

        if (!file) return;

        // Preview the image
        const previewUrl = URL.createObjectURL(file);
        setAvatarUrl(previewUrl); // Assuming you're using useState

        // console.log('File selected:');
        // console.log('Name:', file.name);
        // console.log('Type:', file.type);
        // console.log('Size:', file.size);
        // console.log('Preview URL:', previewUrl);

        const toBase64 = async (file) => {
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        };


        const base64 = await toBase64(file);

        try {
            const response = await axios.post(`${backendUrl}/add-profile-picture`, {
                avatarUrl: base64
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });

            if (response.data) {
                toast.success("Avatar uploaded successfully");
                setButtonLoadingAvatar(false);
                // setTimeout(()=>{
                //     window.location.reload();
                // },5000)
                window.location.reload();
            }
        } catch (error) {
            console.error("Upload failed:", error);
            if (error.response?.data?.message) {
                // toast.error(`Upload failed: ${error.response.data.message}`);
                setButtonLoadingAvatar(false);
            } else {
                // toast.error("Upload failed: Unknown error occurred");
                setButtonLoadingAvatar(false);
            }
        }




    };

    const handleDisplayNameUpdate = async () => {
        setButtonLoadingUpdate(true)

        if (changedDisplayName === "") {
            toast.warning("Enter the details");
            setButtonLoadingUpdate(false)
            setDisplayNameInputState(false)
            return;
        }

        if (changedDisplayName.length < 3) {
            toast.warning("Display name is too short.");
            setButtonLoading(false);
            return;
        }

        if (changedDisplayName.length > 50) {
            toast.warning("Display name is too long.");
            setButtonLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/update-displayname`, {
                displayName: changedDisplayName,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });

            if (response.data) {
                setButtonLoadingUpdate(false);
                // console.log("display name updated successfully")
                toast.success("Display Name updated successfully");

                // setTimeout(()=>{
                //     window.location.reload();
                // },5000)
                window.location.reload();
            }
        } catch (error) {
            console.error("Update failed:", error);
            if (error.response?.data?.message) {
                // toast.error(`Signup failed: ${error.response.data.message}`);
                setButtonLoadingUpdate(false)
            } else {
                toast.error("Update failed: Unknown error occurred");
                setButtonLoadingUpdate(false)
            }
        }

        displayNameInputState(false);
    };

    const handlePasswordUpdate = async () => {
        setButtonLoadingUpdate(true)

        if (changedPassword === "") {
            // toast.warning("Enter the details");
            setButtonLoadingUpdate(false)
            return;
        }
        if (changedPassword.length < 8) {
            // toast.warning("Password must be at least 8 characters long.");
            setButtonLoadingUpdate(false)
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/update-password`, {
                // name: changedName,
                password: changedPassword
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });

            if (response.data) {
                setButtonLoadingUpdate(false)
                // console.log("password updated successfully")
                toast.success("Password updated successfully");
                // setTimeout(()=>{
                //     window.location.reload();
                // },5000)
                window.location.reload();
            }
        } catch (error) {
            console.error("Update failed:", error);
            if (error.response?.data?.message) {
                // toast.error(`Signup failed: ${error.response.data.message}`);
                setButtonLoadingUpdate(false)
            } else {
                // toast.error("Update failed: Unknown error occurred");
                setButtonLoadingUpdate(false)
            }
        }
    };

    const handleLogout = async () => {
        setButtonLoadingLogout(true)
        try {
            const response = await axios.post(`${backendUrl}/logout`, {

            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            })
            if (response) {
                localStorage.setItem("authorization", "");
                setButtonLoadingLogout(false)
                // toast.success("Logout successfully");
                navigate("/signin");
            }
            else {
                // toast.error("Logout Failed")
                setButtonLoadingLogout(false)
            }
        } catch (e) {
            // console.log("the error is :", e);
            setButtonLoadingLogout(false)
        }
    }


    const handleDisplayNameInputState = () => {
        setDisplayNameInputState(true);
    }

    const handleKeyDownEsc = (event) => {
        if (event.key === 'Escape') {
            setDisplayNameInputState(false);
        }
        else {
            return;
        }
    }


    return (
        <>
            <div>
                {isMobile && <Button variant='ghost' onClick={onBack}><ArrowLeft /></Button>}

                <div className="">
                    <Card className="w-full max-w-sm mx-auto border-none shadow-none">
                        <CardHeader>
                            <CardTitle className={"text-2xl text-text"}>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label className={"text-lg text-text"}>Username</Label>
                                    <Label className={"border border-border rounded-lg p-2 text-md"}>{currentUsername}</Label>
                                </div>
                                <div className="grid gap-2">
                                    <Label className={"text-lg text-text"}>Email</Label>
                                    <Label className={"border border-border rounded-lg p-2 text-md"}>{currentEmail}</Label>
                                </div>
                                <div className="grid gap-2">
                                    <Label className={"text-lg text-text"}>Display Name</Label>
                                    {!displayNameInputState ?
                                        <div className="flex">
                                            <Label className={"border border-border rounded-lg p-2 w-full text-md"}>{currentDisplayName}</Label>
                                            <HoverCard>
                                                <HoverCardTrigger>
                                                    <Button variant="ghost" onClick={handleDisplayNameInputState}><Pencil /></Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="bg-surface">
                                                    <div>Click to edit display name</div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </div>
                                        :
                                        <div className="flex">
                                            <Input
                                                type="name"
                                                value={changedDisplayName}
                                                onChange={(e) => setChangedDisplayName(e.target.value)}
                                                onKeyDown={handleKeyDownEsc}
                                                className={"border border-border rounded-lg p-2 w-full focus:border-primary/60 focus:ring-0 focus-visible:ring-0"} />
                                            <HoverCard>
                                                <HoverCardTrigger>
                                                    <Button variant="ghost" className={"hover:bg-primary/60"} onClick={handleDisplayNameUpdate}><Check /></Button>
                                                </HoverCardTrigger>
                                                <HoverCardContent className="bg-surface">
                                                    <div>Click to save display name, press Esc in input box to cancle</div>
                                                </HoverCardContent>
                                            </HoverCard>
                                        </div>
                                    }
                                </div>
                                <div className="grid gap-2">
                                    <Label className={"text-lg text-text"}>Enter new password</Label>
                                    <div className="flex">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={changedPassword}
                                            onChange={(e) => setChangedPassword(e.target.value)}
                                            className="w-full p-2 border border-border rounded-lg focus:border-primary/60 focus:ring-0 focus-visible:ring-0"
                                            placeholder="Enter your new password"
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
                                        <Button
                                            variant="ghost"
                                            onClick={handlePasswordUpdate}
                                            className={"max-sm:bg-primary/60 hover:bg-primary/60 mx-2 text-md"}
                                        >
                                            {buttonLoadingUpdate ? ("Wait") : ("Update")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            <Button className="w-full bg-danger/80 hover:bg-danger text-md p-2" onClick={handleLogout}>
                                {buttonLoadingLogout ? ("Wait") : ("Logout")}
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* <div className="w-full mx-auto flex justify-center my-5"> */}
                        <Card className="border-none shadow-none w-full max-w-sm mx-auto flex justify-center my-5 h-50vh">
                            <CardHeader>
                                <CardTitle>
                                    {avatarUrl ? (
                                        <div className="justify-items-center border-none font-bold text-2xl text-text text-center">
                                            New Avatar
                                            <img className="mt-5 w-30 h-30 object-cover rounded-full" src={avatarUrl} />
                                        </div>
                                    ) : (

                                        oldAvatarUrl ? (
                                            <div className="justify-items-center border-none text-2xl text-text text-center">
                                                Old Avatar
                                                <img className="mt-5 w-30 h-30 object-cover rounded-full" src={oldAvatarUrl} />
                                            </div>
                                        ) : (
                                            <div className="justify-items-center border-none text-2xl text-text text-center">
                                                No Avatar
                                            </div>
                                        )


                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className={"mx-auto"}>
                                    <button className={` mt-3 py-2 px-4 rounded-lg transition duration-200 ${buttonLoadingAvatar ? ("bg-primary/50") : ("bg-primary/70 hover:bg-primary/80")}`} onClick={handleButtonClick}>{buttonLoadingAvatar ? ("Wait") : ("Upload Avatar")}</button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={handleAvatarChange}
                                        accept="image/*"
                                    />
                            </CardContent>
                        
                        </Card>
                    {/* </div> */}

                </div>

            </div>
        </>
    );
}