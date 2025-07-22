import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    label: ReactNode;
    updateFunct: Dispatch<SetStateAction<any>>;
    fieldId: string;
    dataObject: any;
    date?: boolean;
    timeline: number|string
}
export const InputField = ({label, dataObject, fieldId, updateFunct, date, timeline}: Props) => {
    const[value, setValue] = useState(dataObject[fieldId] ?? '')
    const disableDateInput = timeline !== 'today'

    function persistData(inputValue: string|boolean){
        setValue(inputValue)
        // Persist input data into data object
        if(dataObject[fieldId]===undefined){
            console.error(`'${fieldId}' field doesn't exist in data object!!!`)
            return
        }
        dataObject = {...dataObject, [fieldId]: inputValue}
        updateFunct(dataObject)
    }

    return ( 
        <div className="w-fit flex flex-col">
            {label}
            {date? (
                <input type={disableDateInput? 'text': 'date'}
                value={disableDateInput? '': value}
                placeholder="-------------"
                onClick={()=> {disableDateInput? alert("Can't set dates if you're not using the 'Calculate from today' option"): null}}
                onChange={(e)=>{persistData(disableDateInput? '' : e.target.value)}}
                className={`w-fit max-w-[150px] ${disableDateInput? '!cursor-not-allowed':''} brightness-100 rounded-md border border-[#C2CDD8] pl-3.5 py-2 text-sm focus:outline-0 focus:border-black`}/>
            ):(
                <input type="number" 
                value={value}
                placeholder="0"
                onChange={(e)=>{persistData(e.target.value)}}
                className="w-[130px] rounded-md border border-[#C2CDD8] pl-3.5 py-2 text-sm focus:outline-0 focus:border-black"/>
            )}
            
        </div>
    );
}