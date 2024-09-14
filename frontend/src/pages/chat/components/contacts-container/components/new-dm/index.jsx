import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import Lottie from 'react-lottie'
import { animationDefaultOptions, getColor } from '@/lib/utils'
import { apiClient } from "@/lib/api-client";
import { BASE_URL, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { userAppStore } from "@/store";


export default function NewDm() {

    const {setSelectedChatType,setSelectedChatData} = userAppStore();
    const [OpenNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchedContacts, setsearchedContacts] = useState([]);


    const searchContacts = async (searchTerm) =>{
        try {
         if(searchTerm.length>0){
            const response = await apiClient.post(SEARCH_CONTACTS_ROUTE,{searchTerm}, {withCredentials:true});

            if(response.status===200 && response.data.contacts){
                setsearchedContacts(response.data.contacts);
            }
         } else {
            setsearchedContacts([]);
         }
        } catch (error) {
            console.log(error);
        }
    }   

    const selectNewContact = (contact) =>{
      setOpenNewContactModal(false);
      setSelectedChatType("contacts");
      setSelectedChatData(contact);
      setsearchedContacts([]);

    }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Plus size={20} className="cursor-pointer" onClick={()=>setOpenNewContactModal(true)} />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
            <p>Select New Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={OpenNewContactModal} onOpenChange={setOpenNewContactModal}>
  <DialogContent className="bg-[#181920] rounded-lg border-none text-white md:w-[400px] w-[350px]  h-[400px] flex flex-col  ">
    <DialogHeader>
      <DialogTitle>Please select a contact</DialogTitle>
      <DialogDescription></DialogDescription>
    </DialogHeader>
    <div>
        <Input 
        placeholder="Search Contacts"
        className="rounded-lg p-6 bg-[#2c2e3b] border-none "
        onChange = {(e) => searchContacts(e.target.value)}
        />
    </div>
  
  {
    searchedContacts.length>0 && (

    <ScrollArea className="h-[250px]">
        <div className="flex flex-col gap-5">
            {
                searchedContacts.map((contact) => 
            (
                <div key={contact._id} onClick={()=>selectNewContact(contact)} className="flex gap-3 items-center cursor-pointer ">
                    <div className='w-12 h-12 relative'>
            <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                {
                  contact.image ? (
                    <AvatarImage
                    src={`${BASE_URL}/${contact.image}`}
                    alt="profile"
                    className="object-cover w-full h-full bg-black rounded-full"
                    />
                  ) : (
                    <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)} `}>
                      {contact.firstName
                        ? contact.firstName.split("").shift() :
                        contact.email.split("").shift()
                      }
                    </div>
                  )
                }
              </Avatar>
            </div>

            <div className="flex flex-col">
              <span>
                {
                    contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                }
              </span>
              <span className="text-xs">{contact.email}</span>
            </div>
                </div>
            ))
            }
        </div>
    </ScrollArea>
    )
  }


    {
        searchedContacts.length<=0 && 
        <div className='flex-1   md:bg-transparent md:flex flex-col justify-center mt-5 md:mt-0 items-center duration-1000 transition-all '>
      <Lottie 
      isClickToPauseDisabled={true}
      height={100}
      width={100}
      options={animationDefaultOptions}
      />

      <div className='text-opacity-80 text-white flex flex-col items-center mt-5 gap-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
        <h3 className='poppins-medium'>
            Hi<span className='text-purple-500'>!</span> Search New 
            <span className='text-purple-500 '> Contacts </span>
        </h3>
      </div>
    </div>
    }
  </DialogContent>
</Dialog>


    </>
  );
}
