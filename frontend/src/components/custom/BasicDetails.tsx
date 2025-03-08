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

  // State for location suggestions
  const [pickupSuggestions, setPickupSuggestions] = useState<string[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<string[]>([]);

  // State to track input focus
  const [isPickupFocused, setIsPickupFocused] = useState(false);
  const [isDropoffFocused, setIsDropoffFocused] = useState(false);

  // Validation logic
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]+$/; // Only digits allowed
    return phoneRegex.test(phone);
  };

  // Fetch location suggestions from Nominatim
  const fetchSuggestions = async (query: string, setSuggestions: (suggestions: string[]) => void) => {
    if (query.length < 3) {
      setSuggestions([]); // Clear suggestions if query is too short
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      const suggestions = data.map((item: any) => item.display_name);
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
    }
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

    // Fetch suggestions for pickup and dropoff locations
    if (name === "pickup") {
      fetchSuggestions(value, setPickupSuggestions);
    }

    if (name === "dropoff") {
      fetchSuggestions(value, setDropoffSuggestions);
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

  // Handle selection of a suggestion
  const handleSuggestionClick = (name: string, suggestion: string) => {
    setRequestData({
      ...requestData,
      [name]: suggestion,
    });

    // Clear suggestions after selection
    if (name === "pickup") {
      setPickupSuggestions([]);
    } else if (name === "dropoff") {
      setDropoffSuggestions([]);
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

  return (
    <div>
      <div className="font-bold text-xl">Basic Details</div>
      <div className="mt-5">
        <form>
          <div className="lg:grid grid-cols-2 gap-5 flex flex-col">
            {/* Existing fields for firstName, lastName, phone, email */}
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

            {/* Pick-up Location with Suggestions */}
            <div className="flex flex-col gap-2">
              <label className="text-sm">Pick-up Location</label>
              <Input
                name="pickup"
                value={requestData.pickup}
                onChange={handleChange}
                onFocus={() => setIsPickupFocused(true)}
                onBlur={() => setTimeout(() => setIsPickupFocused(false), 200)} // Delay to allow click on suggestion
              />
              {isPickupFocused && pickupSuggestions.length > 0 && (
                <div className="mt-1 border rounded shadow-sm bg-white">
                  {pickupSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 text-xs hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick("pickup", suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drop-off Location with Suggestions */}
            <div className="flex flex-col gap-2">
              <label className="text-sm">Drop-off Location</label>
              <Input
                name="dropoff"
                value={requestData.dropoff}
                onChange={handleChange}
                onFocus={() => setIsDropoffFocused(true)}
                onBlur={() => setTimeout(() => setIsDropoffFocused(false), 200)} // Delay to allow click on suggestion
              />
              {isDropoffFocused && dropoffSuggestions.length > 0 && (
                <div className="mt-1 border rounded shadow-sm bg-white">
                  {dropoffSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 text-xs hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSuggestionClick("dropoff", suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Existing fields for dateTime */}
            <div className="flex flex-col col-span-2 gap-2">
              <div>
                <label className="text-sm">Date & Time: <b>{requestData.dateTime}</b></label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}