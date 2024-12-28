import { useRequestData } from "@/context/BookingRequestContext";
import { Image } from "lucide-react";

export default function Vehicle() {
  const { requestData, setRequestData } = useRequestData();

  const handleVehicleSelection = (vehicle: string) => {
    setRequestData({
      ...requestData,
      vehicle,
    });
  };

  return (
    <div>
      <div className="font-bold text-xl">Select Vehicle</div>
      <div className="py-5 grid grid-cols-2 gap-5">
        <div
          className={`border p-5 rounded-lg flex gap-3 items-center cursor-pointer transition-all ${
            requestData.vehicle === "Mercedes-Benz Sprinter Van"
              ? "border-orange-500 bg-orange-500 text-white"
              : "hover:border-orange-500 hover:shadow-lg"
          }`}
          onClick={() => handleVehicleSelection("Mercedes-Benz Sprinter Van")}
        >
          <div className="border rounded-full overflow-hidden">
            <img src="./mercedes-logo.png" alt="" height={60} width={60} />
          </div>
          <div className="font-bold text-xl">Mercedes-Benz Sprinter Van</div>
        </div>
      </div>
    </div>
  );
}
