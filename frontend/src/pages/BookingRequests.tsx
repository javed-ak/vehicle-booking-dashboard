import BookingDetails from "@/components/custom/DashboardComponents/BookingDetails";
import { useBooking } from "@/hooks"
import { useParams } from "react-router-dom";

export default function BookingRequests() {
    const { id } = useParams();
    const { loading, bookingData } = useBooking({
        id: id
    });

    if (loading) {
        return <div> 
            Loading...
        </div>
    }
    return (
        <div>
            <BookingDetails data={bookingData}/>
        </div>
    )
}
