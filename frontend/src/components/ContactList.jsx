import { userAppStore } from '@/store'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { BASE_URL } from '@/utils/constants';
import { getColor } from '@/lib/utils';

export default function ContactList({contacts,isChannel = false}) {
    const {selectedChatType,selectedChatData,setSelectedChatType,setSelectedChatData,setSelectedChatMessages} = userAppStore();

    const handleClick = (contact) => {
        if(isChannel) setSelectedChatType("channel");
        else setSelectedChatType("contacts");
        setSelectedChatData(contact);

        if(selectedChatData && selectedChatData._id !== contact._id){
            setSelectedChatMessages([]);
        }
    }

  return (
    <div className='mt-5 px-2 space-y-2'>
        {contacts.map((contact)=>(
            <div key={contact._id} className={`pl-5 rounded-lg py-2 transition-all duration-300 cursor-context-menu ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"} `} 
            onClick={()=>handleClick(contact)}>
                
                <div className='flex gap-5 items-center justify-start text-neutral-300'>
                    {
                        !isChannel &&  (<Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                        {
                          contact.image ? (
                            <AvatarImage
                            src={`${BASE_URL}/${contact.image}`}
                            alt="profile"
                            className="object-cover w-full h-full  bg-black"
                            />
                          ) : (
                            <div className={`${ selectedChatData && selectedChatData._id === contact._id ? "bg-[#ffffff22] border border-white/70": getColor(contact.color)}
                             uppercase h-full w-full  text-lg border-[1px] flex items-center justify-center rounded-full`}>
                              {contact.firstName
                                ? contact.firstName.split("").shift() :
                                contact.email.split("").shift()
                              }
                            </div>
                          )
                        }
                      </Avatar>
                      )
                    }
                    {
                        isChannel && <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full '>#</div>
                    }
                    {
                        isChannel ? <span>{contact.name}</span> : <span>{`${contact.firstName} ${contact.lastName}`}</span>
                    }
                </div>
            </div>
        ))}
    </div>
  )
}
