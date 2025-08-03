"use client"
import { createContext, useContext, useState, ReactNode, SetStateAction,Dispatch } from 'react';

type DnDContextType = {
    type: string,
    setType: Dispatch<SetStateAction<string>>
}
const DnDContext = createContext<DnDContextType>({} as DnDContextType);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
    const [type, setType] = useState<string>("");
    return (
        <DnDContext.Provider value={{type,setType}}>
            {children}
        </DnDContext.Provider>
    );
}

export default DnDContext;

export const useDnD = () => {
    if(!useContext(DnDContext)){
        throw Error("DndContext can only be used inside ReactFlowContext")
    }
    return useContext(DnDContext);
}