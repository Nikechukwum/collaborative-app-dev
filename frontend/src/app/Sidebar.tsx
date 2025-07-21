'use client'
import { DocumentIcon } from "@/assets/DocumentIcon";
import { HomeIcon } from "@/assets/HomeIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname()
    return ( 
        <div className="w-[230px] h-full rounded-2xl border-2 border-[#E6E8EB] bg-slate-50 px-3 py-5 flex flex-col gap-y-1">
            <Link href={'/'} className={`flex p-2 rounded-lg ${pathname==='/'? 'bg-[#58A1E9] text-white':'text-black'}`}>
                <HomeIcon fill={`${pathname==='/'? 'white':'black'}`}/> <span className="text-center grow">Dashboard</span>
            </Link>
            {/* <Link href={'/documentation'} className={`flex p-2 rounded-lg ${pathname==='/documentation'? 'bg-[#58A1E9] text-white':'text-black'}`}>
                <DocumentIcon fill={`${pathname==='/documentation'? 'white':'black'}`}/> <span className="text-center grow">Documentation</span>
            </Link> */}
        </div>
     );
}
 
export default Sidebar;