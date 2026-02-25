'use client'
import { DocumentIcon } from "@/assets/DocumentIcon";
import { HomeIcon } from "@/assets/HomeIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Info from "./Info";
import { useState } from "react";

const Sidebar = () => {
    const pathname = usePathname()
    const [step, setStep] = useState(0)
    return ( 
        <>
            <div className="w-[230px] h-full rounded-2xl border-2 border-[#E6E8EB] bg-slate-50 px-3 py-5 flex flex-col gap-y-3">
                <Link href={'/'} className={`flex p-2 rounded-lg ${pathname==='/'? 'bg-[#58A1E9] text-white':'text-black'}`}>
                    <HomeIcon fill={`${pathname==='/'? 'white':'black'}`}/> <span className="text-center grow">Dashboard</span>
                </Link>
                <button onClick={()=>{setStep(0)}} className={`flex p-2 rounded-lg bg-[#58A1E9] text-white cursor-pointer`}>
                    <DocumentIcon fill='white'/> <span className="text-center grow">Information</span>
                </button>
            </div>

            <Info step={step} setStep={setStep}/>
        </>
     );
}
 
export default Sidebar;