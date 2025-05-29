"use client"
import { useRouter } from 'next/navigation'

const websiteList = ["TravelHangouts", "CabTaxi", "HimachalTaxi"]

export default function WebsiteList() {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
    <div className="mb-5">Choose website:</div>
      <div className="flex flex-wrap gap-4">
        {websiteList.map((website, index) => (
          <div
          onClick={()=>{
            router.push(`/Employee/?website=${website}`)
          }}
            key={index}
            className="bg-gray-100 hover:bg-gray-200 hover:cursor-pointer border-2 border-black rounded-lg px-6 py-4 text-lg shadow-2xl font-semibold"
          >
            {website}
          </div>
        ))}
      </div>
    </div>
  )
}
