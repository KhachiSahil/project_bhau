import CalendarComponent from "@/components/Employee/FollowUps/Calendar";
import TodaySchedule from "@/components/Employee/FollowUps/TodaySchedule";
import Followups from "@/components/Employee/FollowUps/Followups";

export default function FollowUps() {
    return (
        <div className="flex flex-col md:flex-row gap-5 w-full">
            <div className="flex flex-col gap-5 ">
                <CalendarComponent />
                <TodaySchedule />
            </div>
            <div className="w-full md:h-full">
                <Followups/>
            </div>
        </div>
    )
}