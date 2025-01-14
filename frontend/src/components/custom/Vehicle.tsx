import { useRequestData } from "@/context/BookingRequestContext";
import { useVehicle } from "@/hooks";
import Loader from "./Loader";
import { useShowNext } from "@/context/showNextContext";
import { useEffect } from "react";
export default function Vehicle() {
  const { requestData, setRequestData } = useRequestData();
  const { setShowNext } = useShowNext();
  const handleVehicleSelection = (vehicle: string) => {
    setShowNext({ show: true });
    setRequestData({
      ...requestData,
      vehicle,
    });
  };
  const { loading, vehicles } = useVehicle();

  useEffect(() => {
    if (!requestData.vehicle)
      setShowNext({ show: false });
    else
      setShowNext({ show: true });
  }
    , []);

  return (
    <div>
      {loading ? <Loader />
        :
        <>

          <div className="font-bold text-xl">Select Vehicle</div>
          <div className="py-5 lg:grid grid-cols-2 gap-5">
            {
              vehicles.map((vehicle: any, index) => (
                <div
                  key={index}
                  className={`border p-5 rounded-lg flex gap-3 items-center cursor-pointer transition-all ${requestData.vehicle === vehicle.name
                    ? "border-orangeColor bg-orangeColor text-white"
                    : "hover:border-orangeColor hover:shadow-lg"
                    }`}
                  onClick={() => handleVehicleSelection(vehicle.name)}
                >
                  <div className={`text-2xl font-bold rounded-full h-14 w-14 flex justify-center items-center ${requestData.vehicle === vehicle.name ? "text-orange-500 bg-white" : "bg-orangeColor text-white"}`}>
                    {index + 1}
                  </div>
                  <div className="font-bold text-lg">{vehicle.name}</div>
                </div>
              ))
            }
          </div>
        </>
      }
    </div>
  );
}
