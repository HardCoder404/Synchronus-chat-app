import { useSocket } from '@/context/SocketContext';
import { apiClient } from '@/lib/api-client';
import { userAppStore } from '@/store';
import { UPLOAD_FILE_ROUTE } from '@/utils/constants';
import EmojiPicker from 'emoji-picker-react';
import { Paperclip, SendHorizonal, SmilePlus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'

export default function MessageBar() {

  const {selectedChatType,selectedChatData,userInfo} = userAppStore();
  const socket = useSocket();
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setemojiPickerOpen] = useState(false);

  const handleAddEmji = (emoji) =>{
    setMessage((msg) =>msg+ emoji.emoji);  
  }

  useEffect(() => {
    function handleClickOutside(event) {
        if(emojiRef.current && !emojiRef.current.contains(event.target)){
            setemojiPickerOpen(false);
        }
    }
    document.addEventListener("mousedown",handleClickOutside);
    return () =>{
        document.removeEventListener("mousedown",handleClickOutside);
    }
  }, [emojiRef])
  

  const handleSendMessage = async () =>{
    if (!message.trim()) {
      // If the message is empty, do not send it
      console.log('Message content is required.');
      return;
    }

    if(selectedChatType === 'contacts'){
      socket.emit("sendMessage",{
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
    } else if(selectedChatType === "channel"){
      socket.emit("send-channel-message",{
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () =>{
    if(fileInputRef.current){
      fileInputRef.current.click();
    }
  };
 
  const handleAttachmentChange = async (e) =>{
    try { 
      const file  = e.target.files[0];
      if(file){
        const formData = new FormData();
        formData.append("file",file);
        
        const response = await apiClient.post(UPLOAD_FILE_ROUTE,formData,{withCredentials:true});
        if(response.status === 200 && response.data) {
          if(selectedChatType === "contacts"){
            socket.emit("sendMessage",{
            sender: userInfo.id,
            content: undefined,
            recipient: selectedChatData._id,
            messageType: "file",
            fileUrl: response.data.filePath,
          })
          } else if(selectedChatType === "channel"){
            socket.emit("send-channel-message",{
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      } 

    } catch (error) {
      console.log({error});
    }
  };

  return (
    <div className='bg-[#1c1d25] flex justify-center items-center md:px-8 px-5 mb-6 md:gap-3 gap-2 '>
       <div className="flex-1 md:w-full w-72  h-14 flex bg-[#2a2b33] rounded-full items-center gap-5 pr-5 ">
        <input 
        type='text'
        className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none'
        placeholder='Enter a Message'
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage(); // Call the function to send the message
          }
        }}
        />
        <div className='relative items-center md:mr-0 mr-3 flex'>

        <button onClick={handleAttachmentClick} className='md:relative absolute right-0 '>
            <Paperclip size={20} />
        </button>
        </div>
        <input type="file" className='hidden' ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className='relative flex justify-center '>
          <div className='relative flex items-center'>
          <button onClick={()=>setemojiPickerOpen(true)} className='md:relative absolute right-0 '>
              <SmilePlus size={20} />
          </button>
          </div>
        <div ref={emojiRef} className='absolute bottom-16 md:right-0 lg:right-0 xl:right-0 right-[-80px]'>
            <EmojiPicker 
            theme='dark'
            open={emojiPickerOpen}
            onEmojiClick={handleAddEmji}
            autoFocusSearch={false}
            lazyLoadEmojis = {false}
            className=''
            />

        </div>
        </div>
       </div>
       <button className='bg-[#8417ff] h-full rounded-full flex items-center justify-center px-5 hover:bg-[#741bda]' 
       onClick={handleSendMessage}>
          <SendHorizonal size={20} />
       </button>
    </div>
  )
}
