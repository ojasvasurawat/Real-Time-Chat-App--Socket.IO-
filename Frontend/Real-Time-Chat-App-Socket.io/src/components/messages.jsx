import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Messages({sendBy, data, time}){

    return(
    <>

        <Card className={"p-2 py-0 gap-0 my-[0.7vh] w-auto max-w-[30vw]"}>
        <CardHeader className={"px-0"}>
            <CardTitle>{sendBy}</CardTitle>
        </CardHeader>
        <CardContent className={"px-0 ml-2"}>
            <p className={"whitespace-pre-wrap break-words"}>{data}</p>
        </CardContent>
        <CardFooter className={"px-0 flex justify-end"}>
            <CardDescription>{time}</CardDescription>
        </CardFooter>
        </Card>
        {/* <div>
            <p>{sendBy}</p>
            <div className={"whitespace-pre-wrap break-words"}>{data}</div>
            <p>{time}</p>
        </div> */}
    </>
    )
}