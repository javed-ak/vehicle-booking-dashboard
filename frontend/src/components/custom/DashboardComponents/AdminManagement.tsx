import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdmin } from "@/hooks";
import { Link } from "react-router-dom";

export default function AdminManagement() {
    const { loading, adminData } = useAdmin();
    return (
        <div className="p-6 overflow-y-auto flex-grow">
            {/* Booking Requests */}
            <Card>
                <CardHeader>
                    <CardTitle>Admin</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? <div>Loading...</div> : <div className="space-y-4">
                        {adminData.map((admin) => (
                            <div>{admin.name}</div>
                        ))}
                    </div>}
                </CardContent>
            </Card>
        </div>
    )
}

