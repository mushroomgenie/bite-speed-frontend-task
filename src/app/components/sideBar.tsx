import React, { Dispatch, SetStateAction } from 'react';
import { useDnD } from '&/context/dndContext';
import { ArrowLeft, MessageSquareText } from 'lucide-react';

type SideBarProps = {
    nodeLabel: string,
    setNodeLabel: Dispatch<SetStateAction<string>>,
    sideBarType: string,
    setSideBarType:Dispatch<SetStateAction<string>>
}
const Sidebar = (props: SideBarProps) => {
    const {nodeLabel,setNodeLabel,sideBarType,setSideBarType} = props;

    const {setType} = useDnD();

    const onDragStart = (event:React.DragEvent<HTMLDivElement>, nodeType:string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const onInput = (event:React.ChangeEvent<HTMLTextAreaElement>) => {
        event.preventDefault();
        setNodeLabel(event.target.value)
    }

    return (
        <aside className={`border-l-black border-l-1 ${sideBarType === "nodes" ? null : null} border-t-black border-t-1`}>
            {sideBarType === "nodes" &&
                <div className="border-blue-800 border-1 m-8 rounded-lg flex justify-center align-items-center cursor-grab flex-col py-5 px-10"
                    onDragStart={(event) => onDragStart(event, 'messageNode')} draggable>
                    <div className='text-blue-700 justify-center flex'>
                        <MessageSquareText />
                    </div>
                    <p className='text-blue-700'>Message</p>
                </div>

                // Add more types of nodes here
            }
            {sideBarType === "nodeMessage" &&
                <div className='flex flex-col'>
                    <div className='flex border-b-black border-b-1 flex-row py-4'>
                        <div className='float-left self-center cursor-pointer' onClick={() => setSideBarType("nodes")}>
                            <ArrowLeft size={24} />
                        </div>
                        <div className='flex justify-center grow'>
                            <p>Message</p>
                        </div>
                    </div>
                    <div className='flex flex-col m-4'>
                        <p className='float-left'>Text</p>
                        <textarea value={`${nodeLabel}`} onChange={onInput} />
                    </div>
                </div>
            }
        </aside>
    );
};

export default Sidebar
