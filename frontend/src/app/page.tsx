'use client'

import { Graph } from "@/components/Graph";
import { InputDropdown } from "@/components/InputDropdown";
import { InputField } from "@/components/InputText";
import { useEffect, useState } from "react";
import axios from "axios";

interface OutputTypes {
  forecast: null|number;
  currentReg: number|null;
  upper: null|number;
  lower: null|number;
  regEnd: null|string;
  sd: null|number;
  timeline: null|number
}

const MainPage = () => {
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({regStart: '', regEnd: '', currentReg: 0, timeline: 'today', targetAudience: ''})
  const [outputs, setOutputs] = useState<OutputTypes>({forecast: null, currentReg: null, upper: null, lower: null, regEnd: null, sd: null, timeline: null})

  const timelineOptions = [
    {label: 'Calculate from today', value: 'today'},
    {label: '25%', value: '0.25'},
    {label: '50%', value: '0.50'},
    {label: '75%', value: '0.75'},
  ]

  useEffect(()=>{
    if(inputs.timeline !== 'today'){
      setInputs((prev)=> ({...prev, regStart: '', regEnd: ''}))
    }
  }, [inputs.timeline])

  function timeIntoRegistration(startDate: string, endDate: string) {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const totalDuration = end.getTime() - start.getTime();
    const elapsed = today.getTime() - start.getTime();

    if (today < start) return -0.1;  // Not started yet
    if (today > end) return 1.1;     // Already ended

    const totalDays = totalDuration / (1000 * 60 * 60 * 24);
    if (totalDays < 29) return -0.2;

    const pct = elapsed / totalDuration;
    return Math.min(Math.max(pct, 0), 1); // Clamp between 0 and 1
  }

  async function handleExecution(){
    setLoading(true)
    const {regStart, regEnd, timeline, currentReg} = inputs
    try {

      if(timeline === 'today' && (!(regStart) || !(regEnd))){
        window.alert("Incomplete: Please fill in the date inputs if using the 'Calculate from today' option")
        return
      }

      const autoTimeline = timeIntoRegistration(regStart, regEnd)

      if(autoTimeline < 0){
        if(autoTimeline === -0.2){
          window.alert("Invalid timeline: Set a timeframe greater or equal to 30 days")
          return
        } else {
          window.alert("Invalid timeline: Cannot use 'Calculate from today' because registrations have not started.")
        }
        return
      } else if(autoTimeline > 1){
        window.alert("Invalid timeline: Cannot use 'Calculate from today' because registrations have already ended.")
        return
      }

      if(Number(currentReg) < 0){
        window.alert('Invalid input: Current registrations cannot be less than 0')
        return
      } 

      const response = await axios.post("https://collaborative-app-dev.onrender.com/api/forecast", {
        current_reg: Number(currentReg),
        timeline: timeline==='today'? autoTimeline : Number(timeline)
      });

      if(response.data){
        const {forecast, lower, upper, sd} = response.data
        setOutputs((prev)=> ({...prev, 
          forecast: forecast, 
          lower: lower, 
          upper: upper,
          sd: sd,
          currentReg: currentReg, 
          regEnd: regEnd || 'the end of reg. period',
          timeline: timeline==='today'? timeIntoRegistration(regStart, regEnd) : Number(timeline)
        }))
      }

    } catch (error) {
      window.alert(`An error occured: ${error}`);
    } finally {
      setLoading(false)
    }
  }

  function calcForecastRange(){
    const {forecast, upper} = outputs
    if(!forecast || !upper){
      return ''
    }
    const range = ((upper-forecast)/forecast) * 100
    return ` ±${range.toFixed(2)}%`
  }

  return ( 
    <div className="grow flex flex-col gap-y-5 overflow-scroll h-full max-h-[550px]">

      <section className="w-full flex flex-col justify-center gap-y-2 px-5 flex-[23%]  rounded-2xl border-2 border-[#E6E8EB] bg-slate-50">
        <div className="flex gap-x-7 w-full h-fit">
          <InputDropdown 
          label={<span className="text-sm w-fit h-[50px] flex items-center">Time into registration period:</span>}
          dataObject={inputs}
          updateFunct={setInputs}
          fieldId="timeline"
          options={timelineOptions}
          />

          <InputField 
          label={<span className="text-sm w-fit max-w-[170px] h-[50px] flex items-center">Registrations start date:</span>}
          dataObject={inputs}
          updateFunct={setInputs}
          fieldId="regStart"
          date
          timeline={inputs.timeline}
          />

          <InputField 
          label={<span className="text-sm w-fit max-w-[170px] h-[50px] flex items-center">Registrations end date:</span>}
          dataObject={inputs}
          updateFunct={setInputs}
          fieldId="regEnd"
          date
          timeline={inputs.timeline}
          />

          <InputField 
          label={<span className="text-sm w-fit h-[50px] flex items-center">Current number of registrations:</span>}
          dataObject={inputs}
          updateFunct={setInputs}
          fieldId="currentReg"
          timeline={inputs.timeline}
          />

        </div>

        <button onClick={()=> handleExecution()} className="flex justify-center items-center rounded-md bg-[#58A1E9] w-[100px] h-[32px] text-sm text-white hover:cursor-pointer hover:scale-[1.03] active:scale-[1.07] origin-left">
          {loading? (
            <div className="w-4 h-4 rounded-full border-dotted border-white border-4 animate-spin"/>
          ):(
            <span>Run</span>
          )}
        </button>
      </section>

      <div className="w-full flex-[52%] flex gap-x-5">
        <section className="w-[380px] rounded-2xl border-2 border-[#E6E8EB] bg-slate-50 py-5 flex flex-col justify-between">
          <h2 className="text-sm px-5">Result</h2>

          <div className="w-full flex gap-x-5 h-24 items-center">
            <div className="w-5 h-full bg-[#58A1E9]" />
            <div className="w-fit h-full py-1.5 flex flex-col justify-between">
              <span className="text-lg h-6">Forecast</span>
              <span className="text-[#58A1E9] text-2xl !font-extrabold">
                <span className="text-5xl">{outputs.forecast ?? '--'}</span>
                <span className="text-3xl">{calcForecastRange()}</span>
              </span>
              <span className="text-[#3A4148] text-xs">Registrations by {outputs.regEnd || '---'}</span>
            </div>
          </div>

          <div className="h-20 w-full px-3">
            <div className="rounded-lg border border-[#C2CDD8] grid grid-cols-2 place-content-center gap-y-2 h-full w-full text-xs px-3">
              <span className="h-fit">Lower limit: {outputs.lower?? '--'}</span>
              <span className="h-fit">Upper limit: {outputs.upper?? '--'} </span>
              <span className="h-fit">Confidence Level: 95%</span>
              <span className="h-fit">Standard deviation: {(outputs.sd)?.toFixed(2)?? '--'}</span>
            </div>
          </div>
        </section>

        <section className="w-[500px] rounded-2xl border-2 border-[#E6E8EB] bg-slate-50 py-5 flex flex-col">
            <h2 className="text-sm px-5">Chart</h2>
            <div className="grow flex items-center justify-center">
                <Graph forecast={outputs.forecast} current={outputs.currentReg} timeline={outputs.timeline}/>
            </div>
        </section>
      </div>
    </div>
   );
}
 
export default MainPage;