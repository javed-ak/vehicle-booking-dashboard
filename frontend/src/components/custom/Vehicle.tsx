import { useRequestData } from "@/context/BookingRequestContext";
import { useVehicle } from "@/hooks";
import Loader from "./Loader";

export default function Vehicle() {
  const { requestData, setRequestData } = useRequestData();

  const handleVehicleSelection = (vehicle: string) => {
    setRequestData({
      ...requestData,
      vehicle,
    });
  };
  const { loading, vehicles } = useVehicle();

  return (
    <div>
      {loading ? <Loader />
        :
        <>

          <div className="font-bold text-xl">Select Vehicle</div>
          <div className="py-5 grid grid-cols-2 gap-5">
            {
              vehicles.map((vehicle: any) => (
                <div
                  key={vehicle.name}
                  className={`border p-5 rounded-lg flex gap-3 items-center cursor-pointer transition-all ${requestData.vehicle === vehicle.name
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "hover:border-orange-500 hover:shadow-lg"
                    }`}
                  onClick={() => handleVehicleSelection(vehicle.name)}
                >
                  <div className="border rounded-full overflow-hidden">
                    <img src="./vehicle.png" alt="" height={60} width={60} />
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
