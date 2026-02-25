'use client'
import { StepFive } from "@/components/infoTemplates/StepFive";
import { StepFour } from "@/components/infoTemplates/StepFour";
import { StepOne } from "@/components/infoTemplates/StepOne";
import { StepThree } from "@/components/infoTemplates/StepThree";
import { StepTwo } from "@/components/infoTemplates/StepTwo";
import { SetStateAction, useState } from "react";

type Props = {
    step: number;
    setStep: React.Dispatch<SetStateAction<number>>
}

const Info = ({setStep, step}: Props) => {
    
    const controller = [
        <StepOne changeStep={setStep}/>,
        <StepTwo changeStep={setStep}/>,
        <StepThree changeStep={setStep}/>,
        <StepFour changeStep={setStep}/>,
        <StepFive changeStep={setStep}/>
    ]
    return ( 
        <>
            {step !== -1? controller[step]: null}
        </>
     );
}
 
export default Info;