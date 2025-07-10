import { Dispatch, ReactNode, SetStateAction } from "react";

type Props = {
    label: ReactNode;
    dataState: any;
    updateState: Dispatch<SetStateAction<any>>;
    date?: boolean
}
export const InputField = ({label, dataState, updateState, date}: Props) => {
    return ( 
        <div className="w-fit flex flex-col">
            {label}
            {date? (
                <input type="date" 
                value={dataState}
                onChange={(e)=>{updateState(e.target.value)}}
                className="w-fit rounded-md border border-[#C2CDD8] pl-3.5 py-2 text-sm focus:outline-0 focus:border-black"/>
            ):(
                <input type="number" 
                value={dataState}
                onChange={(e)=>{updateState(e.target.value)}}
                className="w-[130px] rounded-md border border-[#C2CDD8] pl-3.5 py-2 text-sm focus:outline-0 focus:border-black"/>
            )}
            
        </div>
    );
}