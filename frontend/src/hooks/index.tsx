import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const useBooking = ({ id }: { id: string }) => {
  const [bookingData, setBookingData] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  try {
    useEffect(() => {
      axios.get(`${BACKEND_URL}/api/v1/booking/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
        .then(response => {
          setBookingData(response.data.booking);
          setLoading(false);
        })
    }, [id]);
  
    return {
      loading,
      bookingData
    }
  } catch (e ) {
    navigate('/signin')
  }
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  try {
    useEffect(() => {
      axios.get(`${BACKEND_URL}/api/v1/booking/bulk`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
        .then(response => {
          setDashboardData(response.data.bookings);
          setLoading(false);
        })
    }, []);
  
    return {
      loading,
      dashboardData
    }
  } catch (e) {
    navigate('/signin')
  }
}

