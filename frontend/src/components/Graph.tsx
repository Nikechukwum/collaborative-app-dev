import { useEffect, useRef, useState } from "react";

type Props = {
    forecast: number|null;
    current: number|null;
    timeline: number|null
}
export const Graph = ({forecast, current, timeline}: Props) => {
    const parent = useRef<HTMLDivElement>(null)
    const forecastBar = useRef<HTMLDivElement>(null)
    const currentBar = useRef<HTMLDivElement>(null)
    const [currentBarHeight, setCurrentBarHeight] = useState(0)
    const [forecastBarHeight, setForecastBarHeight] = useState<string|number>(0)

    useEffect(()=>{
        if(!forecast || current === null){
            setForecastBarHeight(0)
            setCurrentBarHeight(0)
        } else {
            setForecastBarHeight('90%')
            const heightValue = (current / forecast) * (parent.current!.clientHeight * 0.9 || 0)
            setCurrentBarHeight(heightValue)
        }
        console.log(`${current}, ${forecast}`)

    }, [forecast, current])
    

    return ( 
        <div ref={parent} className="relative w-3/4 aspect-[1/0.47] border-l-2 border-b-2 border-[#20262C] ml-10">

            <span className="text-xs w-fit h-fit absolute left-4 -translate-x-full top-1/2 -translate-y-1/2 -rotate-90 text-[#20262C]">
                Number of registrations
            </span>

            <div className="bg-[#20262C] h-3.5 w-3.5 rounded-full absolute left-0 -translate-x-[calc(50%+1px)] top-0 -translate-y-1/2"  />
            <div className="bg-[#20262C] h-3.5 w-3.5 rounded-full absolute left-0 -translate-x-1/2 bottom-0 translate-y-1/2" />
            <div className="bg-[#20262C] h-3.5 w-3.5 rounded-full absolute left-full -translate-x-1/2 bottom-0 translate-y-1/2" />

            {/* FORECAST BAR */}
            <div ref={forecastBar} style={{height: forecastBarHeight}} className="bg-[#58A1E9] duration-500 w-[75px] absolute bottom-0 left-[70%] -translate-x-1/2 rounded-t-lg" >
                <div className="bg-[#20262C] h-3.5 w-3.5 rounded-full absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2" />
                {/* Dashed Lines */}
                {forecast && <div style={{width: ((parent.current?.clientWidth || 0) * 0.7) - 37.5}} className={`h-0.5 border-t-2 border-[#C2CDD8] border-dashed absolute right-full`}>
                    <span className="absolute right-full top-0 -translate-y-1/2 text-xs px-2 text-[#20262C] italic">
                        {forecast}
                    </span>
                </div>}
                {forecast && <div className="text-xs absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] text-[#20262C] italic">Forecast</div>}
            </div>

            {/* CURRENT REG BAR */}
            <div ref={currentBar} style={{height: currentBarHeight}} className="bg-[#fd4649] duration-500 w-[75px] absolute bottom-0 left-[30%] -translate-x-1/2 rounded-t-lg">
                <div className="bg-[#20262C] h-3.5 w-3.5 rounded-full absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2" />
                {/* Dashed Lines */}
                {(current !== null && current != forecast) && <div style={{width: ((parent.current?.clientWidth || 0) * 0.3) - 37.5}} className={` h-0.5 border-t-2 border-dashed absolute right-full ${current < 2? 'border-transparent':'border-[#C2CDD8]'}`}>
                    <span className={`absolute right-full top-0 -translate-y-1/2 text-xs text-[#20262C] italic ${current < 2? 'px-3':'px-2'}`}>
                        {current}
                    </span>
                </div>}
                {current !== null && <div className="text-xs absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] flex flex-col items-center text-[#20262C] italic">
                    <span>Current</span>
                    {timeline && <span className="text-nowrap">({(timeline*100).toFixed(1)}% into reg period)</span>}
                </div>}
            </div>

            {/* PLACEHOLDER */}
            {!forecast && <div className="absolute w-fit text-nowrap text-sm left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-1 bg-[#F1F3F5] rounded-lg cursor-default">
                Run the forecast to view chart
            </div>}
        </div>
    );
}