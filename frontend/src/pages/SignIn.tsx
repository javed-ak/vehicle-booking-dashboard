import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_URL } from "@/config";
import { SigninInput } from "@javed-ak/booking-inputs";
import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { toast } from "sonner";



export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const [signinInput, setSigninInput] = useState<SigninInput>({
    email: '',
    password: ''
  })
  const navigate = useNavigate();

  const sendRequest = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/admin/signin`, signinInput)
      const jwt = response.data
      localStorage.setItem('token', jwt)
      setLoading(false);
      navigate('/dashboard')
    } catch (e) {
      toast('Email or Password are wrong!')
      error: 'Something Wrong!!'
    }
    setLoading(false);
  }

  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="border p-5 hover:shadow-lg rounded-lg w-80 flex flex-col gap-5">
        <img src="./BVT-Logo-for-admin-dashboard.png" alt="Black Vans Transportation" />
        <div className="flex flex-col gap-2">
            <label>Email</label>
            <Input placeholder="john@gmail.com" name="email" required onChange={(e) => {
              setSigninInput(c => ({
                ...c,
                email: e.target.value
              }))
            }}/>
        </div>
        <div className="flex flex-col gap-2">
            <label>Password</label>
            <Input type="password" required onChange={(e) => {
              setSigninInput(c => ({
                ...c,
                password: e.target.value
              }))
            }}/>
        </div>
        <Button onClick={sendRequest}>{loading ? <Loader className="animate-spin" /> : 'Login'}</Button>
      </div>
    </div>
  )
}
