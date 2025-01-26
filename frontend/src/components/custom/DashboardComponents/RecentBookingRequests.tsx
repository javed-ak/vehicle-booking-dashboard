import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useBookingData } from '@/context/setBooking';
import { useDashboard } from '@/hooks';
import React from 'react'

function RecentBookingRequests({ setSlide }: { setSlide: any }) {
    const { loading, dashboardData } = useDashboard();
    const { setBookingData } = useBookingData();
    return (
        <div className='mt-5'>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Booking Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {dashboardData.slice(0, 5).map((request) => (
                            <div
                                key={request.id}
                                className="flex justify-between items-center p-4 bg-gray-100 rounded"
                            >
                                <div>
                                    <div className="font-semibold">{request.firstName}</div>
                                    <div className="text-sm text-gray-500">{request.vehicle}</div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-sm font-medium">{request.dateTime}</div>
                                    <Button
                                        onClick={() => {
                                            setSlide(2)
                                            // @ts-ignore
                                            setBookingData(request)
                                        }}
                                        variant="outline"
                                        size="sm"
                                        className={`cursor-default
                          ${request.status === 'Pending'
                                                ? 'bg-orangeColor text-white hover:bg-orangeColor hover:text-white'
                                                : request.status === 'Accepted'
                                                    ? 'bg-green-600 text-white hover:bg-green-600 hover:text-white'
                                                    : 'text-white bg-red-600 hover:text-white hover:bg-red-600'
                                            }`}
                                    >
                                        {request.status}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RecentBookingRequests
