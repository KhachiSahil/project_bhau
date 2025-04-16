import CalendarComponent from "./CalanderComponent"
import Enquiries from "./Enquiries"
export default function CalanderList(){
    return (
        <div className="flex w-full justify-evenly flex-col md:flex-row">
            <div>
                <CalendarComponent />
            </div>
            <div>
                <Enquiries/>
            </div>
        </div>
    )
}