import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar"

export default function Messages({sendBy, data, time, avatarUrl}){

    return(
    <>

        <Card className={"p-2 py-0 gap-0 my-[0.7vh] w-auto max-w-[30vw]"}>
        <CardHeader className={"px-0 flex mt-1"}>
            <Avatar className={"h-[20px] w-[20px] flex-none"}>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className={"rounded-full bg-gray-200 flex items-center justify-center font-semibold text-xs"}>{avatarUrl}</AvatarFallback>
            </Avatar>
            <CardTitle>{sendBy}</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 ml-2"}>
            <p className={"whitespace-pre-wrap break-words"}>{data}</p>
        </CardContent>
        <CardFooter className={"px-0 flex justify-end"}>
            <CardDescription>{time}</CardDescription>
        </CardFooter>
        </Card>
    </>
    )
}