import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { ArrowLeft } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";


export default function Profile({onBack}) {

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

    const isMobile = useIsMobile();


    useEffect(()=>{
        axios(`${backendUrl}/info`,{
            headers:{
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('authorization')
            }
        }).then((response)=>{
            console.log(response);
            setCurrentDisplayName(response.data.user.displayName);
            setCurrentUsername(response.data.user.username);
            setCurrentEmail(response.data.user.email);
            setOldAvatarUrl(response.data.user.avatarUrl);
        }).catch((e)=>{
            if(e){
              navigate("/signin");
            }
        })
    },[])


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

        console.log('File selected:');
        console.log('Name:', file.name);
        console.log('Type:', file.type);
        console.log('Size:', file.size);
        console.log('Preview URL:', previewUrl);

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
            },{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });

            if (response.data) {
                // toast.success("Avatar uploaded successfully");
                setButtonLoadingAvatar(false);
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

        if (changedDisplayName === "" ) {
            // toast.warning("Enter the details");
            setButtonLoadingUpdate(false)
            return;
        }
        if (changedDisplayName.length < 3 ) {
            // toast.warning("Password must be at least 8 characters long.");
            setButtonLoadingUpdate(false)
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/update-displayname`, {
                displayName: changedDisplayName,
            },{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });

            if (response.data) {
                setButtonLoadingUpdate(false)
                console.log("display name updated successfully")
                // toast.success("Account updated successfully");
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

    const handlePasswordUpdate = async () => {
        setButtonLoadingUpdate(true)

        if (changedPassword === "") {
            // toast.warning("Enter the details");
            setButtonLoadingUpdate(false)
            return;
        }
        if (changedPassword.length < 8 ) {
            // toast.warning("Password must be at least 8 characters long.");
            setButtonLoadingUpdate(false)
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/update-password`, {
                // name: changedName,
                password: changedPassword
            },{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            });

            if (response.data) {
                setButtonLoadingUpdate(false)
                console.log("password updated successfully")
                // toast.success("Account updated successfully");
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

    const handleLogout = async()=>{
                setButtonLoadingLogout(true)
        try{const response = await axios.post(`${backendUrl}/logout`,{
                
            },{
                headers:{
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('authorization')
                }
            })
        if (response) {
            localStorage.setItem("authorization", "");
            setButtonLoadingLogout(false)
            // toast.success("Logout successfully");
            navigate("/");
        }
        else{
            // toast.error("Logout Failed")
            setButtonLoadingLogout(false)
        }
        }catch(e){
            console.log("the error is :",e);
            setButtonLoadingLogout(false)
        }
    }

   
    return (
        <>
            <div>

                {isMobile && (<Button variant="ghost" onClick={onBack} className="mb-2"><ArrowLeft/></Button>)}
                
                <h1 className="text-center font-bold text-4xl font-sans text-indigo-500 pt-7">Profile</h1>
                <div className="  mt-10 grid md:grid-cols-2 gap-5">
                    <div className="space-y-6 mx-5 md:mr-5 md:ml-10">
                        <h2 className="text-center text-3xl font-bold text-gray-900">Account Details</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <div className="w-full px-4 py-3 border border-white rounded-lg focus:ring-blue-500 focus:border-blue-500">{currentUsername}</div>
                            </div>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Display Name
                                </label>
                                <div className="w-full px-4 py-3 border border-white rounded-lg focus:ring-blue-500 focus:border-blue-500">{currentDisplayName}</div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="w-full px-4 py-3 border border-white rounded-lg focus:ring-blue-500 focus:border-blue-500">{currentEmail}</div>
                            </div>
                        </div>
                        
                        <button
                            onClick={handleLogout}
                            className={`w-full py-3 px-4 rounded-lg transition duration-200 text-white font-medium  ${buttonLoadingLogout ? ("bg-red-100 hover:bg-red-100") : ("bg-red-400 hover:bg-red-600 ")}`}
                        >
                            {buttonLoadingLogout ? ("Wait") : ("logout")}
                        </button>

                    </div>

                    <div className="space-y-6 mx-5 md:ml-5 md:mr-10 ">
                        <h2 className="text-center text-3xl font-bold text-gray-900">Update Your Profile</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Display Name
                                </label>
                                <input
                                    id="name"
                                    type="name"
                                    value={changedDisplayName}
                                    onChange={(e) => setChangedDisplayName(e.target.value)}
                                    className="w-full px-4 py-3 border border-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your new display name"
                                />
                            </div>

                            <button
                                onClick={handleDisplayNameUpdate}
                                className={`w-full py-3 px-4 text-white font-medium rounded-lg transition duration-200 ${buttonLoadingUpdate ? ("bg-blue-100 hover:bg-blue-100") : ("bg-blue-600 hover:bg-blue-900")}`}
                            >
                                {buttonLoadingUpdate ? ("Wait") : ("Update")}
                            </button>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={changedPassword}
                                    onChange={(e) => setChangedPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-white rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter your new password"
                                />
                            </div>

                            <button
                                onClick={handlePasswordUpdate}
                                className={`w-full py-3 px-4 text-white font-medium rounded-lg transition duration-200 ${buttonLoadingUpdate ? ("bg-blue-100 hover:bg-blue-100") : ("bg-blue-600 hover:bg-blue-900")}`}
                            >
                                {buttonLoadingUpdate ? ("Wait") : ("Update")}
                            </button>

                        </div>

                        {/* <button
                            onClick={handleUpdate}
                            className={`w-full py-3 px-4 text-white font-medium rounded-lg transition duration-200 ${buttonLoadingUpdate ? ("bg-blue-100 hover:bg-blue-100") : ("bg-blue-600 hover:bg-blue-900")}`}
                        >
                            {buttonLoadingUpdate ? ("Wait") : ("Update")}
                        </button> */}
                        

                    </div>

                
                    <div className="grid justify-items-center md:col-span-2">
                        {avatarUrl ? (
                                <div className="h-50 w-100  md:w-1/4 border rounded-xl justify-items-center">
                                    New Avatar
                                    <img className="mt-5 w-30 h-30 object-cover rounded-full" src={avatarUrl}/>
                                </div>                           
                                ) : (
                                    
                                        oldAvatarUrl ? (
                                            <div className="h-50 w-90  md:w-1/4 border rounded-xl justify-items-center">
                                                Old Avatar
                                                <img className="mt-5 w-30 h-30 object-cover rounded-full" src={oldAvatarUrl}/>
                                            </div>
                                        ) : (
                                            <div className="h-50 w-90  md:w-1/4 border rounded-xl justify-items-center">
                                                No Avatar
                                            </div>
                                        )
                                    
                                
                            )}
                            <button className={` mt-3 py-2 px-4  text-white font-medium rounded-lg transition duration-200 ${buttonLoadingAvatar ? ("bg-blue-100 hover:bg-blue-100") : ("bg-blue-600 hover:bg-blue-900")}`} onClick={handleButtonClick}>{buttonLoadingAvatar ? ("Wait") : ("Upload Avatar")}</button>
                            <input  
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                                accept="image/*"
                            />
                    </div>
                </div>
            </div>
        </>
    );
}