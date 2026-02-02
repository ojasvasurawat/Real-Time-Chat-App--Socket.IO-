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

export default function Messages({sendBy, data, time, avatarUrl, isSender}){


    function formatMessageTime(isoTime) {
        const date = new Date(isoTime)
        const now = new Date()

        const isToday =
            date.toDateString() === now.toDateString()

        const isYesterday =
            new Date(now.setDate(now.getDate() - 1)).toDateString() ===
            date.toDateString()

        const time = date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        })

        if (isToday) return time
        if (isYesterday) return `Yesterday · ${time}`

        return date.toLocaleDateString([], {
            month: "short",
            day: "numeric",
        }) + ` · ${time}`
    }


    return(
    <>

        <Card className={`min-w-[140px] max-w-[75%] sm:max-w-[60%] md:max-w-[45%] px-3 py-2 rounded-2xl shadow-sm gap-1 ${isSender ? "bg-primary/80 text-white self-end" : "bg-surface text-white self-start"} rounded-lg`}>
        <CardHeader className={"px-0 flex items-center gap-2"}>
            <Avatar className={"h-5 w-5 flex-none"}>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className={"bg-gray-600 text-white flex items-center justify-center font-semibold text-xs"}>{avatarUrl}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-sm font-semibold">{sendBy}</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 ml-2"}>
            <p className={"whitespace-pre-wrap break-words"}>{data}</p>
        </CardContent>
        <CardFooter className={"px-0 flex justify-end text-xs text-gray-300"}>
            <CardDescription>{formatMessageTime(time)}</CardDescription>
        </CardFooter>
        </Card>
    </>
    )
}