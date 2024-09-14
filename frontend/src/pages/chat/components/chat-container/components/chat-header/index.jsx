import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { userAppStore } from '@/store'
import { BASE_URL } from '@/utils/constants';
import { X } from 'lucide-react'
import React from 'react'

export default function ChatHeader() {

  const {closeChat,selectedChatData,selectedChatType} = userAppStore();

  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-10'>
       <div className='flex gap-5 items-center w-full justify-between'>
            <div className='flex gap-3 items-center justify-center'>
            <div className='w-12 h-12 relative'>
              {
                selectedChatType === "contacts" ? (
                  <Avatar className="h-12 w-12  rounded-full overflow-hidden ">
                    {
                      selectedChatData.image ? (
                        <AvatarImage
                        src={`${BASE_URL}/${selectedChatData.image}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                        />
                      ) : (
                        <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)} `}>
                          {selectedChatData.firstName
                            ? selectedChatData.firstName.split("").shift() :
                            selectedChatData.email.split("").shift()
                          }
                        </div>
                      )
                    }
                  </Avatar>
                ) : (
                  <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full '>#</div>
                )
              }
            </div>

            <div className=''>
              {selectedChatType === "channel" && selectedChatData.name}
              {
                selectedChatType === "contacts" && selectedChatData.firstName ? 
               `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email  
              }
            </div>
            </div>
            <div className='flex items-center justify-center gap-5'>
                <button onClick={closeChat}>
                    <X size={20} />
                </button>
            </div>
       </div>
    </div> 
  )
}
