import { SetStateAction } from "react";

type Props = {
    changeStep: React.Dispatch<SetStateAction<number>>
}
export const StepOne = ({changeStep}: Props) => {
    // const target = document.getElementById('')
    return ( 
        <div className="bg-white border border-[#C2CDD8] text-sm shadow-lg rounded-xl px-10 py-9 w-xl font-normal fixed z-99 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <h2 className="text-[#58A1E9] font-bold! text-xl mb-3 border-l-4 border-[#58A1E9] px-2">INFO</h2>
            This is a simple predictive modelling application developed during my Master's program.
            It attempts to predict the amount of registrations an event organiser will have by the end of the event's registration period.
            <br /><br />
            The model was trained using 9 datasets from real events within the UK from the past few years. The backend (containing the model) was dockerised and pushed to AWS Lambda which handles the requests from this client (the frontend).

            <div className="flex gap-x-5 mt-5">
                <button className="flex justify-center items-center rounded-md bg-gray-500 w-[100px] h-[32px] text-sm text-white hover:cursor-pointer hover:scale-[1.03] active:scale-[1.07] origin-left" onClick={()=>{changeStep(-1)}}>
                    Cancel
                </button>
                <button onClick={()=>{changeStep(1)}} className="flex justify-center items-center rounded-md bg-[#58A1E9] w-[100px] h-[32px] text-sm text-white hover:cursor-pointer hover:scale-[1.03] active:scale-[1.07] origin-left">
                    Next
                </button>
            </div>
        </div>
    );
}