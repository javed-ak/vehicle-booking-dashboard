import { useRequestData } from "@/context/BookingRequestContext";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { useShowNext } from "@/context/showNextContext";

export default function BasicDetails() {
  const { requestData, setRequestData } = useRequestData();
  const { setShowNext } = useShowNext();

  // State for validation errors
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  // Validation logic
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]+$/; // Only digits allowed
    return phoneRegex.test(phone);
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update requestData
    setRequestData({
      ...requestData,
      [name]: value,
    });

    // Perform validation
    if (name === "email") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: validateEmail(value) ? "" : "Email is not valid",
      }));
    }

    if (name === "phone") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone: validatePhone(value) ? "" : "Phone number is not valid",
      }));
    }

    // Check if all fields are valid for enabling "Next"
    if (
      requestData.firstName &&
      requestData.lastName &&
      validatePhone(requestData.phone) &&
      validateEmail(requestData.email) &&
      requestData.pickup &&
      requestData.dropoff &&
      requestData.dateTime
    ) {
      setShowNext({ show: true });
    } else {
      setShowNext({ show: false });
    }
  };

  useEffect(() => {
    // Perform validation and enable/disable "Next" button
    const isValid =
      requestData.firstName &&
      requestData.lastName &&
      validatePhone(requestData.phone) &&
      validateEmail(requestData.email) &&
      requestData.pickup &&
      requestData.dropoff &&
      requestData.dateTime;
  
    setShowNext({ show: isValid });
  }, [requestData, setShowNext]);
  

  useEffect(() => {
    if (
      !requestData.firstName ||
      !requestData.lastName ||
      !requestData.phone ||
      !requestData.email ||
      !requestData.pickup ||
      !requestData.dropoff ||
      !requestData.dateTime
    ) {
      setShowNext({ show: false });
    }
  }, [requestData, setShowNext]);

  return (
    <div>
      <div className="font-bold text-xl">Basic Details</div>
      <div className="mt-5">
        <form>
          <div className="lg:grid grid-cols-2 gap-5 flex flex-col">
            <div className="flex flex-col gap-2">
              <label className="text-sm">First Name</label>
              <Input
                name="firstName"
                value={requestData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Last Name</label>
              <Input
                name="lastName"
                value={requestData.lastName}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Phone</label>
              <Input
                name="phone"
                value={requestData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <span className="text-red-500 text-xs">{errors.phone}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Email</label>
              <Input
                name="email"
                value={requestData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">{errors.email}</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Pick-up Location</label>
              <Input
                name="pickup"
                value={requestData.pickup}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Drop-off Location</label>
              <Input
                name="dropoff"
                value={requestData.dropoff}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col col-span-2 gap-2">
              <div>
                <label className="text-sm">Date & Time</label>
                <div className="text-xs text-gray-500">
                  (Edit the time below if you want the vehicle for more than 4
                  hours of standard slot.)
                </div>
              </div>
              <Input
                name="dateTime"
                value={requestData.dateTime}
                onChange={handleChange}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
