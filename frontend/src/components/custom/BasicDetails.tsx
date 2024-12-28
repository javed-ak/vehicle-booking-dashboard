import { useRequestData } from "@/context/BookingRequestContext";
import { Input } from "../ui/input";


export default function BasicDetails() {
  const { requestData, setRequestData } = useRequestData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRequestData({
      ...requestData,
      [name]: value,
    });
  };

  return (
    <div>
      <div className="font-bold text-xl">Basic Details</div>
      <div className="mt-5">
        <form>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm">First Name</label>
              <Input
                name="firstName"
                value={requestData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Last Name</label>
              <Input
                name="lastName"
                value={requestData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Phone</label>
              <Input
                name="phone"
                value={requestData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Email</label>
              <Input
                name="email"
                value={requestData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Pick-up Location</label>
              <Input
                name="pickup"
                value={requestData.pickup}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Drop-off Location</label>
              <Input
                name="dropoff"
                value={requestData.dropoff}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col col-span-2 gap-2">
              <div>
                <label className="text-sm">Date & Time</label>
                <div className="text-xs text-gray-500">(Edit the time below if you want the vehicle for more than 4 hours of standard slot.)</div>
              </div>
              <Input
                name="dateTime"
                value={requestData.dateTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
