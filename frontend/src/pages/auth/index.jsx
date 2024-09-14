import React, { useState } from 'react'
import Background from "@/assets/login2.png"
import Victory from "@/assets/victory.svg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import {apiClient} from "@/lib/api-client"
import { SIGNUP_ROUTES,LOGIN_ROUTES } from '@/utils/constants'
import { useNavigate } from 'react-router-dom'
import { userAppStore } from '@/store'
import { Eye, EyeOff } from 'lucide-react'

export default function Auth() {

  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const {setUserInfo} = userAppStore();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateLogin = () => {
    // Email validation: Regular expression for email format starting with a letter and followed by optional numbers, valid domain like gmail.com
    const emailPattern = /^[a-zA-Z][a-zA-Z0-9]*@gmail\.com$/;
  
    // Password validation: Regular expression for at least one uppercase, one lowercase, one number, and one special character
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  
    // Email validations
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!emailPattern.test(email)) {
      toast.error("Enter a valid email");
      return false;
    }
  
    // Password validations
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (!passwordPattern.test(password)) {
      toast.error("Password must be at least 6 characters long, contain uppercase, lowercase, number, and special character");
      return false;
    }
  
    return true;
  };
  

  
  const validateSingup = () => {
    // Email validation: Regular expression for email format starting with a letter and followed by optional numbers, valid domain like gmail.com
  const emailPattern = /^[a-zA-Z][a-zA-Z0-9]*@gmail\.com$/;

  // Password validation: Regular expression for at least one uppercase, one lowercase, one number, and one special character
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  // Email validations
  if (!email.length) {
    toast.error("Email is required");
    return false;
  }
  if (!emailPattern.test(email)) {
    toast.error("Enter a valid email");
    return false;
  }

  // Password validations
  if (!password.length) {
    toast.error("Password is required");
    return false;
  }
  if (!passwordPattern.test(password)) {
    toast.error("Password must be at least 6 characters long, contain uppercase, lowercase, number, and special character");
    return false;
  }

  // Confirm Password validations
  if (password !== confirmPassword) {
    toast.error("Password and Confirm Password should be the same");
    return false;
  }

  return true;
  };

  
  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTES, { email, password }, { withCredentials: true });
        console.log("Response: ", response);
  
        if (response.data.user.id) {
          setUserInfo(response.data.user);
  
          if (response.data.user.profileSetup) {
            toast.success("Login Successfull")
            navigate("/chat");
          } else {
            navigate("/profile");
          }
        }
      } catch (error) {
        if (error.response) {
          const errorMessage = error.response.data.error;
  
          if (errorMessage === "UserNotFound") {
            toast.error("Email is not found!");
          } else if (errorMessage === "IncorrectPassword") {
            toast.error("Incorrect password!");
          } else {
            toast.error("Login failed! Please try again.");
          }
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };
  const handleSignup = async () => {
    if (validateSingup()) {
      try {
        const response = await apiClient.post(SIGNUP_ROUTES, { email, password }, { withCredentials: true });
  
        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      } catch (error) {
        if (error.response) {
          const errorMessage = error.response.data.error;
  
          if (errorMessage === "EmailAlreadyExists") {
            toast.error("This email is already registered!");
          } else if (errorMessage === "Email and Password are required") {
            toast.error("Email and password are required!");
          } else {
            toast.error("Signup failed! Please try again.");
          }
        } else {
          toast.error("An unexpected error occurred.");
        }
      }
    }
  };

  return (
    <div className='relative h-[100vh] w-[100vw] overflow-hidden flex items-center justify-center'>
    <div className='absolute inset-0 z-0 bg-cover bg-center' 
         style={{ backgroundImage: 'url(https://img.freepik.com/premium-photo/colorful-business-frame-with-speech-bubbles-icons-white-background-creative-modern-presentations_43969-57581.jpg)', filter: 'blur(3px)' }}>
    </div>
    <div className='relative z-10 h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[90vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
    <div className='flex flex-col gap-10 items-center justify-center '>
             <div className='flex items-center justify-center flex-col'>
                <div className='flex items-center justify-center'>
                    <h1 className='text-4xl font-bold md:text-6xl '>Welcome</h1>
                    <img src={Victory} alt="victory emoji" className='md:h-[100px] h-[50px]' />
                </div>
                <p className='font-medium text-center'>Fill in the details to get started with the best chat App!</p>
             </div>
             <div className='flex justify-center items-center w-full'>
             <Tabs className='w-3/4 h-[350px]' defaultValue='login'>
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger value="login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-500   ">Login</TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300  ">Signup</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                  <Input 
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="rounded-full p-6 "
                  />
                  <div className='relative'>
                  <Input 
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="rounded-full p-6 "
                  />
                   <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={handleTogglePassword}>
                      {showPassword ? (
                        <Eye size={20} color='gray' />
                      ) : (
                        <EyeOff size={20} color='gray' />
                      )}
                    </div>
                  </div>
                  <Button className="rounded-full p-6" onClick={handleLogin}>Login</Button>
                </TabsContent>
                <TabsContent value="signup" className="flex flex-col gap-5 mt-0">
                <Input 
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className="rounded-full p-6 "
                  />
                  <div className='relative'>
                  <Input 
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  className="rounded-full p-6 "
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={handleTogglePassword}>
                      {showPassword ? (
                        <Eye size={20} color='gray' />
                      ) : (
                        <EyeOff size={20} color='gray' />
                      )}
                    </div>
                  </div>
                  <div className='relative'>
                  <Input 
                  placeholder="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e)=>setConfirmPassword(e.target.value)}
                  className="rounded-full p-6 "
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer" onClick={handleTogglePassword}>
                      {showPassword ? (
                        <Eye size={20} color='gray' />
                      ) : (
                        <EyeOff size={20} color='gray' />
                      )}
                    </div>
                  </div>
                 <Button className="rounded-full p-6" onClick={handleSignup}>Signup</Button>
                </TabsContent>
              </Tabs>
             </div>
          </div>
          <div className="hidden xl:flex justify-center items-center">
            <img src={Background} alt="bgImage" className='h-[550px]' />
          </div>
      </div>
    </div>
  )
}
