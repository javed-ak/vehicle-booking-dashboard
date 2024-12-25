import { Car, CalendarDays, FileText, FileCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import Vehicle from './Vehicle';
import { useState } from 'react';
import DateTime from './DateTime';
import BasicDetails from './BasicDetails';
import Summary from './Summary';
import { Button } from '../ui/button';
import { RequestDataProvider } from '@/context/BookingRequestContext';

export default function FormSection() {
  const [selectedCard, setSeletedCard] = useState(1);
  return (
    <div className="mx-40 my-20 grid grid-cols-4 gap-10">
      <div>
        <div className="border rounded-lg w-full shadow-lg">
          <div className={`m-2 py-2 px-4 rounded-lg hover:text-orange-500 cursor-pointer flex items-center gap-4 hover:scale-105 transition-all ${selectedCard === 1 && 'bg-orange-500 text-white hover:text-white hover:scale-100'}`} onClick={() => {setSeletedCard(1)}}><Car />Vehicle</div>
          <div className={`m-2 py-2 px-4 rounded-lg hover:text-orange-500 cursor-pointer flex items-center gap-4 hover:scale-105 transition-all ${selectedCard === 2 && 'bg-orange-500 text-white hover:text-white hover:scale-100'}`} onClick={() => {setSeletedCard(2)}}><CalendarDays />Date & Time</div>
          <div className={`m-2 py-2 px-4 rounded-lg hover:text-orange-500 cursor-pointer flex items-center gap-4 hover:scale-105 transition-all ${selectedCard === 3 && 'bg-orange-500 text-white hover:text-white hover:scale-100'}`} onClick={() => {setSeletedCard(3)}}><FileText />Basic Details</div>
          <div className={`m-2 py-2 px-4 rounded-lg hover:text-orange-500 cursor-pointer flex items-center gap-4 hover:scale-105 transition-all ${selectedCard === 4 && 'bg-orange-500 text-white hover:text-white hover:scale-100'}`} onClick={() => {setSeletedCard(4)}}><FileCheck />Summary</div>
        </div>
      </div>
      <div className="border w-full col-span-3 shadow-lg rounded-lg p-5">
      <RequestDataProvider>
          {selectedCard == 1 && <Vehicle />}
          {selectedCard == 2 && <DateTime />}
          {selectedCard == 3 && <BasicDetails />}
          {selectedCard == 4 && <Summary />}
        </RequestDataProvider>
        <div className='flex justify-end mt-5'>
          {selectedCard == 4 ? 
            <div className='flex gap-5'>
              <Button variant="outline" onClick={() => {setSeletedCard(selectedCard - 1)}}><ArrowLeft/>Go Back</Button>
              <Button>Send Request</Button>
            </div> : 
            <div className='flex gap-5'>
              {selectedCard != 1 &&<Button variant="outline" onClick={() => {setSeletedCard(selectedCard - 1)}}><ArrowLeft/>Go Back</Button>}
              <Button onClick={() => {setSeletedCard(selectedCard + 1)}}>Next<ArrowRight/></Button>
            </div>
          }
        </div>
      </div>
    </div>
  )
}
