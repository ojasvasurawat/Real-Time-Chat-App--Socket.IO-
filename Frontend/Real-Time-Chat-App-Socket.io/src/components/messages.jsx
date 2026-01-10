export default function Messages({sendBy, data, time}){

    return(
    <>
        <div>
            <p>{sendBy}</p>
            <div>{data}</div>
            <p>{time}</p>
        </div>
    </>
    )
}