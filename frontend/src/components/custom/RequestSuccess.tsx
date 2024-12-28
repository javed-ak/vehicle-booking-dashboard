import { useRequestData } from "@/context/BookingRequestContext";

export default function RequestSuccess() {
    const { requestData } = useRequestData();
    return (
        <div className="p-20 flex flex-col justify-center items-center text-center gap-5">
            <div className="text-2xl">Thank You <span className="font-bold">{requestData.firstName} {requestData.lastName}</span> for choosing Black Vans Transportation!</div>
            <div>We have successfully received your booking request and one of our executives will get in touch with you shortly to confirm your booking!</div>
        </div>
    )
}
