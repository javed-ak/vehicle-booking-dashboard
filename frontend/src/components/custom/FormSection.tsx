import { Car, CalendarDays, FileText, FileCheck, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import Vehicle from './Vehicle';
import { useEffect, useState } from 'react';
import DateTime from './DateTime';
import BasicDetails from './BasicDetails';
import Summary from './Summary';
import { Button } from '../ui/button';
import { RequestDataProvider, useRequestData } from '@/context/BookingRequestContext';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import RequestSuccess from './RequestSuccess';
import { toast, ToastContainer } from 'react-toastify';
import { ShowNextProvider, useShowNext } from '@/context/showNextContext';

function FormSectionContent() {
  const { requestData } = useRequestData(); // Ensure this is within the provider
  const { show } = useShowNext().showNext;

  const [showRequestButton, setShowRequestButton] = useState(false);
  const [selectedCard, setSeletedCard] = useState(1);
  const [loading, setLoading] = useState(true);

  const sendRequest = async () => {
    setSeletedCard(5); // Show the RequestSuccess component
    try {
      await axios.post(`${BACKEND_URL}/api/v1/booking`, requestData);
      setLoading(false)
      // Send Email notification to admin and user that their request is send successfully
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error("Somthing went Wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setSeletedCard(4)
    }
  };

  useEffect(() => {
    if (requestData.vehicle && requestData.dateTime && requestData.lastName && requestData.firstName && requestData.email && requestData.phone && requestData.dropoff && requestData.pickup) {
      setShowRequestButton(true)
    }
    else
      setShowRequestButton(false)
  }
    , [requestData]);
  return (
    <div className="lg:grid grid-cols-4 gap-10">
      <div>
        <div className="border rounded-lg w-full shadow-lg">
          <div
            className={`m-2 py-2 px-4 rounded-lg flex items-center gap-4 cursor-pointer ${selectedCard === 1 ? 'bg-orangeColor text-white' : 'hover:text-orangeColor hover:scale-105 transition-all'
              }`}
            onClick={() => setSeletedCard(1)}
          >
            <Car />Vehicle
          </div>
          <div
            className={`m-2 py-2 px-4 rounded-lg flex items-center gap-4 cursor-pointer ${selectedCard === 2 ? 'bg-orangeColor text-white' : 'hover:text-orangeColor hover:scale-105 transition-all'
              }`}
            onClick={() => setSeletedCard(2)}
          >
            <CalendarDays />Date & Time
          </div>
          <div
            className={`m-2 py-2 px-4 rounded-lg flex items-center gap-4 cursor-pointer ${selectedCard === 3 ? 'bg-orangeColor text-white' : 'hover:text-orangeColor hover:scale-105 transition-all'
              }`}
            onClick={() => setSeletedCard(3)}
          >
            <FileText />Basic Details
          </div>
          <div
            className={`m-2 py-2 px-4 rounded-lg flex items-center gap-4 cursor-pointer ${selectedCard === 4 ? 'bg-orangeColor text-white' : 'hover:text-orangeColor hover:scale-105 transition-all'
              }`}
            onClick={() => setSeletedCard(4)}
          >
            <FileCheck />Summary
          </div>
        </div>
      </div>
      <div className="border w-full col-span-3 shadow-lg rounded-lg p-5">
        {selectedCard === 5 ? (
          <div className='flex h-full justify-center items-center'>
            {loading ? (
              <div className='flex gap-2'>
                <Loader className='animate-spin' /> Sending Request...
              </div>
            ) : (
              <>
                <RequestSuccess />
              </>
            )}
          </div>
        ) : (
          <>
            {selectedCard === 1 && <Vehicle />}
            {selectedCard === 2 && <DateTime />}
            {selectedCard === 3 && <BasicDetails />}
            {selectedCard === 4 && (
              <>
                <ToastContainer />
                <Summary />
              </>
            )}
            <div className="flex justify-end mt-5">
              {selectedCard === 4 ? (
                <div className="flex gap-5">
                  <Button variant="outline" onClick={() => setSeletedCard(selectedCard - 1)}>
                    <ArrowLeft />
                    Go Back
                  </Button>
                  <Button onClick={sendRequest}
                    disabled={!showRequestButton}
                  >Send Request</Button>
                </div>
              ) : (
                <div className="flex gap-5">
                  {selectedCard !== 1 && (
                    <Button variant="outline" onClick={() => setSeletedCard(selectedCard - 1)}>
                      <ArrowLeft />
                      Go Back
                    </Button>
                  )}
                  <Button
                    onClick={() => setSeletedCard(selectedCard + 1)}
                    disabled={!show}
                  >
                    Next
                    <ArrowRight />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function FormSection() {
  return (
    <RequestDataProvider>
      <ShowNextProvider>
        <FormSectionContent />
      </ShowNextProvider>
    </RequestDataProvider>
  );
}
