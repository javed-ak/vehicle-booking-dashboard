import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/hooks';
import { Ban, CalendarCheck, CheckCircle, XCircle } from 'lucide-react'

export default function SummaryCards() {
    const { dashboardData } = useDashboard();

    // Calculate summary statistics
    const totalBookings = dashboardData.length;
    const approvedBookings = dashboardData.filter(req => req.status === 'Accepted').length;
    const rejectedBookings = dashboardData.filter(req => req.status === 'Rejected').length;
    const canceledBookings = dashboardData.filter(req => req.status === 'Canceled').length;
    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
                    <CalendarCheck className="h-4 w-4 text-orangeColor" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orangeColor">{totalBookings}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Accepted Requests</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{approvedBookings}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Canceled Requests</CardTitle>
                    <XCircle className="h-4 w-4 text-black" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-black">{canceledBookings}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Rejected Requests</CardTitle>
                    <Ban className="h-4 w-4 text-black" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-black">{rejectedBookings}</div>
                </CardContent>
            </Card>
        </div>
    )
}
