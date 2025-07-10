import { ChartIcon } from "@/assets/ChartIcon";

const Header = () => {
    return ( 
        <div className="w-full flex gap-x-5 items-center px-10 h-[100px] bg-[#0F1B27] text-white">
            <ChartIcon fill="white" size={28} className="-translate-y-0.5"/> <span className="text-2xl">Event Registrations Forecasting</span>
        </div>
     );
}
 
export default Header;