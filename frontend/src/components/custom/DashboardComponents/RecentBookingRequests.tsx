import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/hooks';
import React from 'react'

function RecentBookingRequests() {
    const { loading, dashboardData } = useDashboard();

    return (
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
                                    variant="outline"
                                    size="sm"
                                    className={`
                          ${request.status === 'Pending'
                                            ? 'text-orange-400 border-orange-400 hover:bg-orange-50'
                                            : request.status === 'Approved'
                                                ? 'text-green-500 border-green-500 hover:bg-green-50'
                                                : 'text-red-500 border-red-500 hover:bg-red-50'
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
    )
}

export default RecentBookingRequests
