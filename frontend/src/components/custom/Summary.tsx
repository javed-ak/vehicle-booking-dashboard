import { useRequestData } from "@/context/BookingRequestContext"

export default function Summary() {
  const { requestData } = useRequestData();
  
  return (
    <div className="lg:m-20">
        <div className="flex flex-col justify-center items-center">
          <div className="font-bold text-xl">Summary</div>
          <div className="font-medium text-md">Your appointment booking summary</div>
          <div className="font-medium text-xs my-5 ">Customer</div>
        </div>
      <div className="flex flex-col text-center">
        <div className="text-xl font-bold">{`${requestData.firstName} ${requestData.lastName}`}</div>
        <div className="font-bold">{requestData.vehicle}</div>
        <div>{requestData.dateTime}</div>
        <div className="flex flex-col lg:flex-row justify-between mt-5">
          <div><span className="font-bold">Pick-up Location: </span>{requestData.pickup}</div>
          <div><span className="font-bold">Drop-off Location: </span>{requestData.dropoff}</div>
        </div>
      </div>
    </div>
  )
}
