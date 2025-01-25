import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Pencil, CheckCircle, XCircle } from "lucide-react";

interface BookingProps {
  firstName: string;
  lastName: string;
  email: string;
  vehicle: string;
  phone: string;
  address: string;
  dateTime: string;
  status: string;
  note: string;
}

export default function BookingDetails({ data }: { data: BookingProps }) {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-1 bg-orange-500 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Booking Details</h2>
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white hover:bg-orange-50 text-orange-500"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="mt-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{data.firstName} {data.lastName}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{data.email}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{data.phone}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="font-medium">{data.vehicle}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium">{data.dateTime}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                {data.status}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-4 pt-6 border-t">
        <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
          <XCircle className="w-4 h-4 mr-2" />
          Reject
        </Button>
        <Button className="bg-orange-500 text-white hover:bg-orange-600">
          <CheckCircle className="w-4 h-4 mr-2" />
          Accept
        </Button>
      </CardFooter>
    </Card>
    </div>
  );
}