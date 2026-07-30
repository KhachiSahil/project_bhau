import CabManagement from "@/components/Admin/Cab/CabManagement";
import CarTypePricing from "@/components/Admin/Cab/CarTypePricing";

export default function CabsPage() {
  return (
    <div className="space-y-6">
      <CarTypePricing />
      <CabManagement />
    </div>
  );
}