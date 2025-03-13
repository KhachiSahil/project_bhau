import EmployeeTable from "@/components/Admin/Employee/EmployeeList";
import TopSegment from "@/components/Admin/Employee/TopSegment";

export default function employee(){
    return(
        <div>
            <TopSegment/>
            <EmployeeTable/>
        </div>
    )
}