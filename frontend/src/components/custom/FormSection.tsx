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

  const [selectedCard, setSelectedCard] = useState(1);
  const [loading, setLoading] = useState(true);

  const icons = [Car, CalendarDays, FileText, FileCheck];
  
  const sendRequest = async () => {
    setSelectedCard(5); // Show the RequestSuccess component
    try {
      await axios.post(`${BACKEND_URL}/api/v1/booking`, requestData);
      setLoading(false);
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Something went wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setSelectedCard(4);
    }
  };

  return (
    <div className="lg:grid grid-cols-4 gap-10">
      <div>
        <div className="border rounded-lg w-full shadow-lg mb-10">
          {["Vehicle", "Date & Time", "Basic Details", "Summary"].map(
            (label, index) => {
              const Icon = icons[index]; // Get the corresponding icon component
              return (
                <div
                  key={index}
                  className={`m-2 py-2 px-4 rounded-lg flex items-center gap-4 cursor-pointer ${selectedCard === index + 1
                      ? "bg-orangeColor text-white"
                      : show && selectedCard >= index
                        ? "hover:text-orangeColor hover:scale-105 transition-all"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                  onClick={() => show && selectedCard >= index && setSelectedCard(index + 1)}
                >
                  <Icon className="w-5 h-5" /> {/* Render the icon */}
                  {label}
                </div>
              );
            }
          )}
        </div>
      </div>
      <div className="border w-full col-span-3 shadow-lg rounded-lg p-5">
        {selectedCard === 5 ? (
          <div className="flex h-full justify-center items-center">
            {loading ? (
              <div className="flex gap-2">
                <Loader className="animate-spin" /> Sending Request...
              </div>
            ) : (
              <RequestSuccess />
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
                  <Button
                    variant="outline"
                    onClick={() => setSelectedCard(selectedCard - 1)}
                  >
                    <ArrowLeft />
                    Go Back
                  </Button>
                  <Button onClick={sendRequest} disabled={!show}>
                    Send Request
                  </Button>
                </div>
              ) : (
                <div className="flex gap-5">
                  {selectedCard !== 1 && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCard(selectedCard - 1)}
                    >
                      <ArrowLeft />
                      Go Back
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedCard(selectedCard + 1)}
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
