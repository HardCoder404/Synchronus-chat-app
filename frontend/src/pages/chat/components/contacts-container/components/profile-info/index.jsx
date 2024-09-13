import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getColor } from '@/lib/utils';
import { userAppStore } from '@/store'
import { BASE_URL, LOGOUT_ROUTE } from '@/utils/constants';
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { Pencil, Power } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



export default function ProfileInfo() {
    const {userInfo,setUserInfo} = userAppStore();
    const navigate = useNavigate();

    const logout = async () =>{
        try {
            const response  = await apiClient.post(LOGOUT_ROUTE,{},{withCredentials:true});
            
            if(response.status === 200){
                toast.success("Logout Successfull");
                navigate("/auth");
                setUserInfo(null)
            }
        } catch (error) {
            console.log(error);      
        }
    }

  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33] '>
        <div className="flex gap-3 justify-center items-center">
            <div className='w-12 h-12 relative'>
            <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                {
                  userInfo.image ? (
                    <AvatarImage
                    src={`${BASE_URL}/${userInfo.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black"
                    />
                  ) : (
                    <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)} `}>
                      {userInfo.firstName
                        ? userInfo.firstName.split("").shift() :
                        userInfo.email.split("").shift()
                      }
                    </div>
                  )
                }
              </Avatar>
            </div>
            <div>
                {
                    userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ""
                }
            </div>
        </div>
        <div className="flex gap-5">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger>
                    <Pencil size={18} color='purple' strokeWidth={2} onClick={()=>navigate("/profile")}/>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
                <p>Edit Profile</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        
       <AlertDialog>
                    <AlertDialogTrigger>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                            <Power size={18}  color='red' strokeWidth={2}/>                            
                            </TooltipTrigger>
                            <TooltipContent className="bg-[#1c1b1e] border-none text-white ">
                            <p>logout</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you want to logout?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={logout}>Yes</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
        </AlertDialog>

        </div>
    </div>
  )
}
