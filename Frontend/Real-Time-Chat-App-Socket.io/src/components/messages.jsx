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

        <Card className={`min-w-[140px] max-w-[75%] sm:max-w-[60%] md:max-w-[45%] px-1 py-1 rounded-xl shadow-sm gap-0 ${isSender ? "bg-outgoing" : "bg-surface"} `}>
        <CardHeader className={"px-0 flex items-center gap-2"}>
            <Avatar className={"h-5 w-5 flex-none object-cover"}>
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className={"bg-border flex items-center justify-center font-semibold text-xs"}>{avatarUrl}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-sm text-text">{sendBy}</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 ml-1 relative inline-block max-w-full"}>
            <p className={"whitespace-pre-wrap break-words text-text pr-22"}>{data}</p>
            <span className={`absolute -bottom-1 right-0 text-xs text-muted`}>
                <CardDescription>{formatMessageTime(time)}</CardDescription>
            </span>
        </CardContent>
        
        </Card>
    </>
    )
}