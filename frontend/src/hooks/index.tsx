import { BACKEND_URL } from "@/config";
import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

interface Booking {
  id: string;
  status: string;
  vehicle: string;
  dateTime: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pickup: string;
  dropoff: string;
  note?: string;
}

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
  } catch (e) {
    navigate('/signin')
  }
}

export const useAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState();
  const navigate = useNavigate();

  try {
    useEffect(() => {

      axios.get(`${BACKEND_URL}/api/v1/admin`, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
        .then(response => {
          setAdminData(response.data);
          setLoading(false);
        })
    }, []);

    return {
      loading,
      adminData
    }
  } catch (e) {
    navigate('/signin')
  }
}

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState<Booking[]>([]); // Use the defined type
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/booking/bulk`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDashboardData(response.data.bookings); // TypeScript now knows what type this is
        setLoading(false);
      })
      .catch(() => {
        navigate("/signin");
      });
  }, []);

  // Update booking details
  const updateBookingDetails = async (id: string, updatedData: Partial<Booking>) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/booking`,
        { id, ...updatedData },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      // Update state with the new data
      setDashboardData((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, ...updatedData } : booking
        )
      );
      return response.data;
    } catch (e) {
      console.error("Failed to update booking", e);
    }
  };

  // Handle booking status change (Accept/Reject)
  const handleBookingAction = async (id: string, status: string) => {
    try {
      const response = await axios.put(
        `${BACKEND_URL}/api/v1/booking`,
        { id, status },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      // Update state with the new status
      setDashboardData((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status } : booking
        )
      );
      return response.data;
    } catch (e) {
      console.error("Failed to update booking status", e);
    }
  };

  return {
    loading,
    dashboardData,
    updateBookingDetails,
    handleBookingAction,
  };
};

export const useVehicle = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/admin/vehicle`)
      .then((response) => {
        setVehicles(response.data);
        setLoading(false);
      })
      .catch(() => {
        navigate("/signin");
      });
  }, []);

  return {
    loading,
    vehicles,
  };
}

export const useRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/booking/requests`)
      .then((response) => {
        setRequests(response.data.requests);
        setLoading(false);
      })
      .catch(() => {
        navigate("/signin");
      });
  }, []);

  return {
    loading,
    requests,
  };
}