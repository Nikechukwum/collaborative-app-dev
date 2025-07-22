import { DropdownIcon } from "@/assets/DropdownIcon";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";

type Props = {
    label: ReactNode;
    options: {label:string, value: string}[]
    dataObject: any;
    fieldId: string;
    updateFunct: Dispatch<SetStateAction<any>>;
}
export const InputDropdown = ({label, dataObject, updateFunct, fieldId, options}: Props) => {
    const [selectedOption, setSelectedOption] = useState(0)
    const [dropdown, setDropdown] = useState(false)

    function handleSelection(selectedIndex: number){
        setSelectedOption(selectedIndex)
        setDropdown(false)
        persistData(options[selectedIndex].value)
    }

    function persistData(inputValue: string){
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
            <div className="relative grow">
                <div className={` cursor-pointer w-fit min-w-[160px] max-w-[200px] rounded-md border border-[#C2CDD8] pl-3.5 pr-3 py-2 text-sm flex gap-x-2 items-center justify-between`} onClick={()=>{setDropdown(!dropdown)}}>
                    <span className="truncate">{options[selectedOption].label}</span>
                    <DropdownIcon size={20} fill="black" className={`duration-100 shrink-0 ${dropdown? 'rotate-180':''}`}/>
                </div>

                {dropdown && <div className="absolute z-30 max-h-[300px] overflow-y-scroll overscroll-none w-full min-w-fit left-0 top-[calc(100%+6px)] rounded-sm shadow-lg 
                flex flex-col gap-y-1 bg-white p-2 outline-black outline-1 text-sm">
                    {options.map((option, index)=>{
                        return(
                            <span key={index} className={`cursor-pointer whitespace-nowrap hover:bg-[#f0f0f0] px-2 py-1 rounded-sm`}
                            onClick={()=>{handleSelection(index)}}>
                                {option.label}
                            </span>
                        )
                    })}
                </div>}
            </div>
           
        </div>
    );
}