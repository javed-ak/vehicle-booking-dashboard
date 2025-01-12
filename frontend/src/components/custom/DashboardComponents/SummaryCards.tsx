import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/hooks';
import { CalendarCheck, CheckCircle, XCircle } from 'lucide-react'

export default function SummaryCards() {
    const { loading, dashboardData } = useDashboard();

    // Calculate summary statistics
    const totalBookings = dashboardData.length;
    const approvedBookings = dashboardData.filter(req => req.status === 'Accepted').length;
    const rejectedBookings = dashboardData.filter(req => req.status === 'Rejected').length;
    return (
        <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    <CalendarCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-500">{totalBookings}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accepted Requests</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{approvedBookings}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">{rejectedBookings}</div>
                </CardContent>
            </Card>
        </div>
    )
}
