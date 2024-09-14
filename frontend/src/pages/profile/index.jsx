import { userAppStore } from '@/store'
import { ArrowLeft, CirclePlus, Trash2 } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { colors, getColor } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { ADD_PROFILE_IMAGE_ROUTE, BASE_URL, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from '@/utils/constants';


export default function Profile() {
  const navigate= useNavigate();
  const {userInfo,setUserInfo} = userAppStore();
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState(null)
  const [hovered, sethovered] = useState(false);
  const [selectedColor, setselectedColor] = useState(0);
  const fileInputRef = useRef(null);


  useEffect(() => {
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setselectedColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${BASE_URL}/${userInfo.image}`);
    }
  }, [userInfo])
     
  const validateProfile = () =>{
    if(!firstName){ 
      toast.error("First Name is required");
      return false;
    }
    if(!lastName){
      toast.error("Last Name is required");
      return false;
    }
    return true;
  }

  const saveChanges = async ()=>{
    if(validateProfile()){
     try {
      const response = await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,color:selectedColor}, {withCredentials:true});

      if(response.status ===200 && response.data){
        setUserInfo({...response.data});
        toast.success("Profile udpated")
        navigate("/chat");
      }
     } catch (error) {
      console.log(error);
     }
    }
  }

  const handleNavigate = ()=>{
    if(userInfo.profileSetup){
      navigate("/chat")
    }else{
      toast.error("Please setup profile")
    }
  }

  const handleFileInputClick = ()=>{
    fileInputRef.current.click()
  }
 
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    
    if(file){
      const formData = new FormData();
      formData.append("profile-image",file);
      const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});
      if(response.status === 200 && response.data.image){
        setUserInfo({...userInfo,image:response.data.image});
        toast.success("Image updated successfully");
      }

    }
  };

  const handleDeleteImage = async () => {
    try {
      const response  = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true});
      
      if(response.status === 200){
        setUserInfo({...userInfo,image:null});
        toast.success("Image Removed Successfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

   // Regular expression to check if the input contains only letters
   const namePattern = /^[a-zA-Z]+$/;

   // Handler for first name input
   const handleFirstNameChange = (e) => {
     const value = e.target.value;
     if (namePattern.test(value) || value === '') {
       setFirstName(value);
     } else {
       toast.error("First name should only contain letters");
     }
   };
 
   // Handler for last name input
   const handleLastNameChange = (e) => {
     const value = e.target.value;
     if (namePattern.test(value) || value === '') {
       setLastName(value);
     } else {
       toast.error("Last name should only contain letters");
     }
   };



  return (
    <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10  '>
      <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
        <div onClick={handleNavigate}>
          <ArrowLeft size={30} color='white' className='cursor-pointer' />
        </div>
        <div className='grid grid-cols-2 '>
            <div className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center' 
            onMouseEnter={()=>sethovered(true)}
            onMouseLeave={()=>sethovered(false)}
            >
              <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden ">
                {
                  image ? (
                    <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)} `}>
                      {firstName
                        ? firstName.split("").shift() :
                        userInfo.email.split("").shift()
                      }
                    </div>
                  )
                }
              </Avatar>

              {hovered && (
                <div className='absolute inset-0 h-32 w-32 md:w-48 md:h-48 top-[54px] md:top-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full'
                onClick={image ? handleDeleteImage : handleFileInputClick}
                >
                  {
                    image ? <Trash2 size={40} color='white' /> : <CirclePlus size={40} color='white' />
                  }
                </div>
              )}
              <input type="file" ref={fileInputRef} className='hidden' onChange={handleImageChange} name="profile-image" accept='.png, .jpg, .jpeg, .svg, .webp'  />
            </div> 
            <div className='flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center '>
              <div className='w-full'>
                <Input placeholder="Email" type="email" disabled value={userInfo.email} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
              </div>
              <div className='w-full'>
              <Input placeholder="First Name" type="text"  value={firstName}  onChange={handleFirstNameChange} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
              </div>
              <div className='w-full'>
              <Input placeholder="Last Name" type="text"  value={lastName} onChange={handleLastNameChange} className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
              </div>
              
              <div className="w-full flex gap-5 h-8">
                {colors.map((color,index)=> (
                <div 
                className={`${color} h-6 w-6 md:h-full md:w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === index ? "outline-white/50 outline-3 outline ": ""}`} key={index} onClick={()=>setselectedColor(index)}> </div>))}
              </div>
            </div>  
        </div>

        <div className='w-full'>
            <Button className="h-14 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300" onClick={saveChanges}>
              Save Changes
            </Button>
        </div>
      </div>
    </div>
  )
}
