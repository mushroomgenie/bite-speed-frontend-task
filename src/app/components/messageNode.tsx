import { Send } from "lucide-react"
import { Handle, Position } from "@xyflow/react"

type MessageNodeProps = {
    data:{
        label: string
    }
}
const MessageNode = (props:MessageNodeProps) => {
    return (
        <div className="flex flex-col bg-white border-1 border-black rounded-lg shadow-xl">
            <div className="flex justify-between bg-green-100 rounded-tl-lg rounded-tr-lg px-2">
                <p className="text-xs font-bold">Send Message</p>
                <div className="text-grey-100 items-center flex ml-10">
                    <Send size={10} />
                </div>
            </div>
            <div>
                <p className="text-xs p-2">{props.data.label}</p>
            </div>
            <Handle type="target" position={Position.Left} />
            <Handle type="source" position={Position.Right} />
        </div>
    )
}

export default MessageNode