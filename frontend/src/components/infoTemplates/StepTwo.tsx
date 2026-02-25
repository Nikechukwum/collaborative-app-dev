import { SetStateAction } from "react";

type Props = {
    changeStep: React.Dispatch<SetStateAction<number>>
}
export const StepTwo = ({changeStep}: Props) => {
    const target = document.getElementById('reg-period')
    const bottom = target?.getBoundingClientRect().bottom
    const left = target?.getBoundingClientRect().left

    return ( 
        <div style={{top: `${bottom}px`, left: `${left}px`}} className="bg-white text-sm border border-[#C2CDD8] shadow-lg rounded-lg px-7 py-6 w-lg font-normal fixed z-99 translate-y-11">
            <div className="w-4 h-4 absolute -z-10 top-0 left-4 -translate-y-3/4 rotate-45 bg-[#58A1E9]"/>

            This is how much time into the registration period has elapsed. <br /><br />
            You can set a percentage into the reg. period or set today's date and let the app calculate it for you.

            <div className="flex gap-x-5 mt-5">
                <button className="flex justify-center items-center rounded-md bg-gray-500 w-[100px] h-[32px] text-sm text-white hover:cursor-pointer hover:scale-[1.03] active:scale-[1.07] origin-left" onClick={()=>{changeStep(-1)}}>
                    Cancel
                </button>
                <button onClick={()=>{changeStep(2)}} className="flex justify-center items-center rounded-md bg-[#58A1E9] w-[100px] h-[32px] text-sm text-white hover:cursor-pointer hover:scale-[1.03] active:scale-[1.07] origin-left">
                    Next
                </button>
            </div>
        </div>
    );
}