import { userAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatContainer from './components/chat-container';
import EmptyChatContainer from './components/empty-chat-container';
import ContactsContainer from './components/contacts-container';


export default function Chat() {
  const {userInfo,selectedChatType} = userAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if(!userInfo.profileSetup){
      toast("Please setup profile to continue");
      navigate("/profile");
    }
  }, [userInfo,navigate])
  
  return (
    <div className='h-[100vh] flex text-white overflow-hidden '>
      <ContactsContainer />
      {
        selectedChatType ===undefined ? <EmptyChatContainer /> : <ChatContainer />
      }
    </div>
  )
}
