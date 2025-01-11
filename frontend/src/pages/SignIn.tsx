import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/config";
import { SigninInput } from "@javed-ak/booking-inputs";
import { useEffect, useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import { UserDataProvider } from "@/context/userContext";
import { useUserData } from "@/context/userContext";

function SignInComponent() {
  const [loading, setLoading] = useState(false)
  // const { userData, setUserData } = useUserData(); 
  const [signinInput, setSigninInput] = useState<SigninInput>({
    email: '',
    password: ''
  })
  const navigate = useNavigate();

  const sendRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`, signinInput)
      const jwt = response.data.token
      localStorage.setItem('token', jwt)
      localStorage.setItem('name', response.data.name);
      localStorage.setItem('email', response.data.email);
      setLoading(false);
      navigate('/dashboard')
    } catch (e) {
      toast.error("Email or password are Wrong", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      error: 'Something Wrong!!'
    }
    setLoading(false);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <ToastContainer />
      <div className="border p-5 hover:shadow-lg rounded-lg w-80 flex flex-col gap-5">
        <img src="./BVT-Logo-for-admin-dashboard.png" alt="Black Vans Transportation" />
        <div className="flex flex-col gap-2">
          <label>Email</label>
          <Input placeholder="john@gmail.com" name="email" required onChange={(e) => {
            setSigninInput(c => ({
              ...c,
              email: e.target.value
            }))
          }} />
        </div>
        <div className="flex flex-col gap-2">
          <label>Password</label>
          <Input type={"password"} required onChange={(e) => {
            setSigninInput(c => ({
              ...c,
              password: e.target.value
            }))
          }} />
        </div>
        <Button onClick={sendRequest}>{loading ? <Loader className="animate-spin" /> : 'Login'}</Button>
      </div>
    </div>
  )
}


export default function SignIn() {
  return (
    <UserDataProvider>
      <SignInComponent />
    </UserDataProvider>
  )
};