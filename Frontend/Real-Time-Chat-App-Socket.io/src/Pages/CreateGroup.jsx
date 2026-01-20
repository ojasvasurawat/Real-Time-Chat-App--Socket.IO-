export default function CreateGroup(){

    const [groupName, setGroupName] = useState("");
    
    return(
        <>
            <input
                id="groupName"
                type="groupName"
                value={groupName}
                onChange={(e)=>{setGroupName(e.target.value)}}
                placeholder="enter group name"
            />
        </>
    )
}