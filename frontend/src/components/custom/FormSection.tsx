import { Car, CalendarDays, FileText, FileCheck, ArrowRight, ArrowLeft, Loader } from 'lucide-react';
import Vehicle from './Vehicle';
import { useState } from 'react';
import DateTime from './DateTime';
import BasicDetails from './BasicDetails';
import Summary from './Summary';
import { Button } from '../ui/button';
import { RequestDataProvider, useRequestData } from '@/context/BookingRequestContext';
import { BACKEND_URL } from '@/config';
import axios from 'axios';
import RequestSuccess from './RequestSuccess';
import { toast, ToastContainer } from 'react-toastify';

function FormSectionContent() {
  const { requestData } = useRequestData(); // Ensure this is within the provider
  const [selectedCard, setSeletedCard] = useState(1);
  const [loading, setLoading] = useState(true);

  const sendRequest = async () => {
    setSeletedCard(5); // Show the RequestSuccess component
    try {
      await axios.post(`${BACKEND_URL}/api/v1/booking`, requestData);
      setLoading(false)
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

  return (
    <div className="mx-40 my-20 grid grid-cols-4 gap-10">
      <div>
        <div className="border rounded-lg w-full shadow-lg">
          <div
            className={`m-2 py-2 px-4 rounded-lg hover:text-orange-500 cursor-pointer flex items-center gap-4 hover:scale-105 transition-all ${selectedCard === 1 && 'bg-orange-500 text-white hover:text-white hover:scale-100'
              }`}
            onClick={() => setSeletedCard(1)}
          >
            <Car />Vehicle
          </div>
          <div
            className={`m-2 py-2 px-4 rounded-lg hover:text-orange-500 cursor-pointer flex items-center gap-4 hover:scale-105 transition-all ${selectedCard === 2 && 'bg-orange-500 text-white hover:text-white hover:scale-100'
              }`}
            onClick={() => setSeletedCard(2)}
          >
            <CalendarDays />Date & Time
          </div>
          <div
            className={`m-2 py-2 px-4 rounded-lg hover:text-orange-500 cursor-pointer flex items-center gap-4 hover:scale-105 transition-all ${selectedCard === 3 && 'bg-orange-500 text-white hover:text-white hover:scale-100'
              }`}
            onClick={() => setSeletedCard(3)}
          >
            <FileText />Basic Details
          </div>
          <div
            className={`m-2 py-2 px-4 rounded-lg hover:text-orange-500 cursor-pointer flex items-center gap-4 hover:scale-105 transition-all ${selectedCard === 4 && 'bg-orange-500 text-white hover:text-white hover:scale-100'
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
                  <Button onClick={sendRequest}>Send Request</Button>
                </div>
              ) : (
                <div className="flex gap-5">
                  {selectedCard !== 1 && (
                    <Button variant="outline" onClick={() => setSeletedCard(selectedCard - 1)}>
                      <ArrowLeft />
                      Go Back
                    </Button>
                  )}
                  <Button onClick={() => setSeletedCard(selectedCard + 1)}>
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
      <FormSectionContent />
    </RequestDataProvider>
  );
}
