import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Landing(){

    const navigate = useNavigate();

    return(
        <>
            <div className="grid lg:grid-cols-2 bg-background">
                <div className="flex justify-center items-center h-[60vh] lg:h-screen">
                    <div className="mt-10">
                        <div className="text-text/70 text-5xl  lg:text-7xl font-bold mb-10"><span className="text-primary underline">Real Time</span> <br></br> Chat App</div>
                        <div className="text-muted text-xl lg:text-xl mb-10">
                            Instant messaging, made simple.
                            <br></br>
                            Stay connected in the moment.
                        </div>
                        <Button variant="ghost" className={"bg-primary/70 hover:bg-primary"} size="lg" onClick={()=>navigate("/signup")}>Get Started</Button>
                    </div>
                </div>
                <div className="relative flex justify-center items-center lg:h-screen max-sm:mx-7">
                    <div className=" absolute top-[45%] left-1/2 w-1/2 h-1/4 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-primary/70 bg-opacity-30 blur-[110px] z-0"></div>
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-2 z-10">
                        <div className="lg:absolute lg:w-[37.5%] lg:left-[8%] lg:top-[10%]  grid lg:grid-rows-3 gap-10">
                            <Card className="lg:row-span-1 border border-border    bg-surface">
                                <CardHeader>
                                    <CardTitle className={"text-primary"}>Typing indicator</CardTitle>
                                </CardHeader>
                                <CardDescription className={"px-7 text-text"}>
                                    <div>· See when someone is typing and respond in real time.</div>
                                    <div>· Real-time typing status for natural conversations.</div>
                                </CardDescription>
                            </Card>
                            <Card className="lg:ml-[20%] lg:row-span-2  border border-border lg:mb-[70%] bg-surface ">
                                <CardHeader>
                                    <CardTitle className={"text-primary"}>Online Users</CardTitle>
                                </CardHeader>
                                <CardDescription className={"px-7 text-text"}>
                                    <div>· Know who’s available and active at any moment.</div>
                                    <div>· Instantly see who’s online and active.</div>
                                </CardDescription>
                            </Card>
                        </div>
                        <div  className="lg:absolute lg:w-[37.5%] lg:right-[8%] lg:top-[10%] grid lg:grid-rows-3 gap-10">
                            <Card className="lg:mr-[15%] lg:row-span-2 border  border-border lg:mb-[20%] lg:mt-[20%] bg-surface">
                                <CardHeader>
                                    <CardTitle className={"text-primary"}>Private messaging</CardTitle>
                                </CardHeader>
                                <CardDescription className={"px-7 text-text"}>
                                    <div>· One-on-one chats with real-time delivery.</div>
                                    <div>· Secure, real-time conversations between two users.</div>
                                </CardDescription>
                            </Card>
                            <Card className="lg:row-span-1  border border-border lg:-mt-[20%] bg-surface">
                                <CardHeader>
                                    <CardTitle className={"text-primary"}>Group chat</CardTitle>
                                </CardHeader>
                                <CardDescription className={"px-7 text-text"}>
                                    <div>· Chat together, share ideas, and stay connected as a group.</div>
                                    <div>· Communicate with multiple users in one place.</div>
                                </CardDescription>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}