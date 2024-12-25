import { useRequestData } from "@/context/BookingRequestContext"

export default function Summary() {
  const { requestData } = useRequestData();
  return (
    <div className="">
        <div className="flex flex-col justify-center items-center">
          <div className="font-bold text-xl">Summary</div>
          <div className="font-medium text-md">Your appointment booking summary</div>
          <div className="font-medium text-xs my-5 ">Customer</div>
        </div>
      <div className="flex flex-col items-center">
        <div className="text-xl font-bold">{`${requestData.firstName} ${requestData.lastName}`}</div>
        <div className="font-bold">{`${requestData.vehicle}`}</div>
        <div>{`${requestData.dateTime}`}</div>
        <div>{`${requestData.address}`}</div>
      </div>
    </div>
  )
}
