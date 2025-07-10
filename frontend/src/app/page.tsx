'use client'

import { Graph } from "@/components/Graph";
import { InputDropdown } from "@/components/InputDropdown";
import { InputField } from "@/components/InputText";
import { useState } from "react";
import axios from "axios";

const MainPage = () => {
  const [regStart, setRegStart] = useState<string>('')
  const [eventStart, setEventStart] = useState<string>('')
  const [currentReg, setCurrentReg] = useState<number>(0)
  const [timeline, setTimeline] = useState<string>('')
  const [targetAudience, setTargetAudience] = useState()
  const [predictionInterval, setPredictionInterval] = useState('---')
  const [timeTillEvent, setTimeTillEvent] = useState('---')
  const [sd, setSd] = useState('---')
  const [loading, setLoading] = useState(false)

  const timelineOptions = [
    {label: '0%', value: '0'},
    {label: '25%', value: '25'},
    {label: '50%', value: '50'},
    {label: '75%', value: '75'},
  ]

  const audienceOptions = [
    {label: 'IT Managers', value: '0'},
    {label: 'Property Managers', value: '1'},
    {label: 'Education Managers', value: '2'},
    {label: 'Education Property Managers', value: '3'},
  ]

  function getWeeksRemaining(regStartStr: string, eventStartStr: string, percentageElapsed: number) {
    const regStart = new Date(regStartStr);
    const eventStart = new Date(eventStartStr);

    const totalRegPeriodMs = eventStart.getTime() - regStart.getTime();
    const elapsedMs = (percentageElapsed / 100) * totalRegPeriodMs;

    const currentDate = new Date(regStart.getTime() + elapsedMs);
    const remainingMs = eventStart.getTime() - currentDate.getTime();

    const remainingWeeks = Math.floor(remainingMs / (1000 * 60 * 60 * 24 * 7));
    return remainingWeeks;
}

  async function handleExecution(){
    setLoading(true)
    const weeksToEvent  = getWeeksRemaining(regStart, eventStart, Number(timeline))
    try {
      const response = await axios.post("http://localhost:8000/api/run", {
        target_audience: targetAudience,
        current_registrations: currentReg,
        event_start: eventStart,
        reg_start: regStart,
        weeks_to_event: weeksToEvent
      });

    } catch (error) {
      window.alert(`An error occured: ${error}`);
      setLoading(false)
    }

  }

  return ( 
    <div className="grow flex flex-col gap-y-5 overflow-scroll h-full">

      <section className="w-full flex flex-col justify-center gap-y-2 px-5 flex-[23%]  rounded-2xl border-2 border-[#E6E8EB] bg-slate-50">
        <div className="flex gap-x-5 w-full h-fit">
          <InputField 
          label={<span className="text-sm w-fit max-w-[170px] h-[50px] flex items-center">Registrations start date:</span>}
          dataState={regStart}
          updateState={setRegStart}
          date
          />

          <InputField 
          label={<span className="text-sm w-fit max-w-[170px] h-[50px] flex items-center">Event start date:</span>}
          dataState={eventStart}
          updateState={setEventStart}
          date
          />

          <InputField 
          label={<span className="text-sm w-[130px] h-[50px] flex items-center">Current number of registrations:</span>}
          dataState={currentReg}
          updateState={setCurrentReg}
          />

          <InputDropdown 
          label={<span className="text-sm w-fit max-w-[150px] h-[50px] flex items-center">Time into registration period:</span>}
          dataState={timeline}
          updateState={setTimeline}
          options={timelineOptions}
          />

          <InputDropdown 
          label={<span className="text-sm w-fit max-w-[150px] h-[50px] flex items-center">Target Audience:</span>}
          dataState={targetAudience}
          updateState={setTargetAudience}
          options={audienceOptions}
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
              <span className="text-[#58A1E9] text-2xl !font-bold"><span className="text-5xl">--</span></span>
              <span className="text-[#3A4148] text-xs">Registrations by ---</span>
            </div>
          </div>

          <div className="h-20 w-full px-3">
            <div className="rounded-lg border border-[#C2CDD8] grid grid-cols-[1fr_0.8fr] auto-rows-max place-content-center gap-y-2 h-full w-full text-xs px-3">
              <span className="h-fit">Time till event: {timeTillEvent}</span>
              <span className="text-right h-fit">Confidence Level: 95%</span>
              <span className="h-fit">Prediction Interval: {predictionInterval} </span>
              <span className="text-right h-fit">Standard deviation: {sd}</span>
            </div>
          </div>
        </section>

        <section className="w-[500px] rounded-2xl border-2 border-[#E6E8EB] bg-slate-50 py-5 flex flex-col">
            <h2 className="text-sm px-5">Chart</h2>
            <div className="grow flex items-center py-3 justify-center">
                <Graph forecast={0} current={0}/>
            </div>
        </section>
      </div>
    </div>
   );
}
 
export default MainPage;