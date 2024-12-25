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
        {/* Audi Q3 Sportback */}
        <div
          className={`border p-5 rounded-lg flex gap-3 items-center cursor-pointer transition-all ${
            requestData.vehicle === "Audi Q3 Sportback"
              ? "border-orange-500 bg-orange-500 text-white"
              : "hover:border-orange-500"
          }`}
          onClick={() => handleVehicleSelection("Audi Q3 Sportback")}
        >
          <div className="border rounded-full p-5">
            <Image />
          </div>
          <div className="font-bold text-xl">Audi Q3 Sportback</div>
        </div>

        {/* BMW Sportback */}
        <div
          className={`border p-5 rounded-lg flex gap-3 items-center cursor-pointer transition-all ${
            requestData.vehicle === "BMW Sportback"
              ? "border-orange-500 bg-orange-500 text-white"
              : "hover:border-orange-500"
          }`}
          onClick={() => handleVehicleSelection("BMW Sportback")}
        >
          <div className="border rounded-full p-5">
            <Image />
          </div>
          <div className="font-bold text-xl">BMW Sportback</div>
        </div>

        {/* Mercedes-Benz */}
        <div
          className={`border p-5 rounded-lg flex gap-3 items-center cursor-pointer transition-all ${
            requestData.vehicle === "Mercedes-Benz"
              ? "border-orange-500 bg-orange-500 text-white"
              : "hover:border-orange-500"
          }`}
          onClick={() => handleVehicleSelection("Mercedes-Benz")}
        >
          <div className="border rounded-full p-5">
            <Image />
          </div>
          <div className="font-bold text-xl">Mercedes-Benz</div>
        </div>

        {/* Auto Rikshaw */}
        <div
          className={`border p-5 rounded-lg flex gap-3 items-center cursor-pointer transition-all ${
            requestData.vehicle === "Auto Rikshaw"
              ? "border-orange-500 bg-orange-500 text-white"
              : "hover:border-orange-500"
          }`}
          onClick={() => handleVehicleSelection("Auto Rikshaw")}
        >
          <div className="border rounded-full p-5">
            <Image />
          </div>
          <div className="font-bold text-xl">Auto Rikshaw</div>
        </div>
      </div>
    </div>
  );
}
