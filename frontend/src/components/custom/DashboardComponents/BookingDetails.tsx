interface bookingProps {
    firstName: string
    lastName: string
    email: string
    vehicle: string
    phone: string
    address: string
    dateTime: string
    status: string
    note: string
}
export default function BookingDetails({ data } : { data: bookingProps} ) {
    return (
        <div>
            <div>Booking Details</div>
            <div>Name: {data.firstName} {data.lastName}</div>
            <div>Email: {data.email}</div>
            <div>Phone: {data.phone}</div>
            <div>Vehicle: {data.vehicle}</div>
            <div>Date & Time: {data.dateTime}</div>
            <div>Status: {data.status}</div>
            <div>Note: {data.note}</div>
        </div>
    )
}
