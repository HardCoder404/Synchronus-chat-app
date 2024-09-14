import React, { useEffect, useRef, useState } from 'react'
import { userAppStore } from '@/store';
import moment from 'moment';
import { apiClient } from '@/lib/api-client';
import { BASE_URL, GET_ALL_MESSAGES_ROUTE, GET_CHANNEL_MESSAGES_ROUTE } from '@/utils/constants';
import { ArrowDown, FolderRoot, X } from 'lucide-react';
import { Avatar, AvatarImage,AvatarFallback } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';

export default function MessageContainer() {
  const scrollRef = useRef();
  const {selectedChatType,selectedChatData,userInfo,selectedChatMessages,setSelectedChatMessages} = userAppStore();
  const [showImage, setshowImage] = useState(false);
  const [ImageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, { id: selectedChatData._id }, { withCredentials: true });
  
        if (response.data.messages) {
          // Check if the messages are different before setting them
          if (JSON.stringify(response.data.messages) !== JSON.stringify(selectedChatMessages)) {
            setSelectedChatMessages(response.data.messages);
          }
        }
      } catch (error) {
        console.log({ error });
      }
    };
    const getChannelMessages = async () =>{
      try {
        const response = await apiClient.get(`${GET_CHANNEL_MESSAGES_ROUTE}/${selectedChatData._id}`,{ withCredentials: true });
        
        if (response.data.messages) {
          // Check if the messages are different before setting them
          if (JSON.stringify(response.data.messages) !== JSON.stringify(selectedChatMessages)) {
            setSelectedChatMessages(response.data.messages);
          }
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (selectedChatData._id) {
      if(selectedChatType === "contacts"){
        getMessages();
      } else if(selectedChatType === "channel"){
        getChannelMessages();
      }
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);
  
  

  useEffect(() => {
    if(scrollRef.current){
      scrollRef.current.scrollIntoView({behavior:"smooth"})
    }
  }, [selectedChatMessages])
  
  const checkIfImage = (filePath) =>{
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }

  const download = async (url) => {
    const response = await apiClient.get(`${BASE_URL}/${url}`, {responseType:"blob"});

    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download",url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  }
  const renderMessages = () => {
    let lastDate = null;
  
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
  
      return (
        <div key={index}>
          {showDate && (
            <div className='text-center text-gray-500 my-2'>
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          

          {selectedChatType === "contacts" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };
  

  const renderDMMessages = (message) => {
    
    return (
      <div className={`${message.sender === selectedChatData._id ? "text-left": "text-right"}`}>
        {
          message.messageType === "text" && (
            <div className={`${message.sender !== selectedChatData._id ? 
              "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-t-2xl rounded-l-2xl text-left": 
              "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 rounded-t-2xl rounded-r-2xl"
            } border inline-block px-3 pt-1 my-1 break-words`}>
              <div className='md:max-w-[500px] md:min-w-32 max-w-64 min-w-20'>
              {message.content}
              </div>
              <div className='text-xs text-gray-600 pb-1 text-right'>
          {moment(message.timestamp).format("LT")}
        </div>
            </div>
          )
        }

        {
          message.messageType === "file" && (
            <div className={`${message.sender !== selectedChatData._id ? 
              "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50": 
              "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block overflow-hidden rounded-2xl my-1 max-w-[50%] break-words`}>

              {checkIfImage(message.fileUrl)? <div className='cursor-pointer' onClick={()=> {
                setshowImage(true);
                setImageUrl(message.fileUrl);
              }}>
                <img src={`${BASE_URL}/${message.fileUrl}`} height={300} width={300} alt="" />
              </div> : <div className='flex items-center p-3 justify-center gap-4'>
                <span className='text-white/8 text-3xl bg-black/20 rounded-full p-3'>
                    <FolderRoot size={20} />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className='p-3 text-2xl cursor-pointer transition-all duration-300' onClick={()=>download(message.fileUrl)}>
                  <ArrowDown size={20} />
                </span>

              </div> }

            </div>
          )
        }

      </div>
    );
  }
  
  const renderChannelMessages = (message) =>{
    return(
      <div className={`mt-5 ${message.sender._id !== userInfo.id ? 
        "text-left" : "text-right"
      }`}>
        {
          message.messageType === "text" && (
            <div className={`${message.sender._id === userInfo.id ? 
              "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50 rounded-t-2xl rounded-l-2xl text-left": 
              "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20 rounded-t-2xl rounded-r-2xl"
            } border inline-block px-3 py-3 my-1 break-words`}>
              <div className='md:max-w-[500px] md:min-w-32 max-w-64 min-w-20'>
              {message.content}
              </div>
            </div>
          )
        }

        {
          message.messageType === "file" && (
            <div className={`${message.sender._id === userInfo.id ? 
              "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50": 
              "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block overflow-hidden rounded-2xl my-1 max-w-[50%] break-words`}>

              {checkIfImage(message.fileUrl)? <div className='cursor-pointer' onClick={()=> {
                setshowImage(true);
                setImageUrl(message.fileUrl);
              }}>
                <img src={`${BASE_URL}/${message.fileUrl}`} height={300} width={300} alt="" />
              </div> : <div className='flex items-center p-3 justify-center gap-4'>
                <span className='text-white/8 text-3xl bg-black/20 rounded-full p-3'>
                    <FolderRoot size={20} />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span className='p-3 text-2xl cursor-pointer transition-all duration-300' onClick={()=>download(message.fileUrl)}>
                  <ArrowDown size={20} />
                </span>

              </div> }

            </div>
          )
        }

        {
          message.sender._id !== userInfo.id ? (
            <div className="flex justify-start items-center gap-3">
               <Avatar className="h-8 w-8 rounded-full overflow-hidden ">
                    {
                      message.sender.image && (
                        <AvatarImage
                        src={`${BASE_URL}/${message.sender.image}`}
                        alt="profile"
                        className="object-cover w-full h-full bg-black"
                        />
                      )}
                        <AvatarFallback className={`uppercase h-8 w-8  text-lg flex items-center justify-center rounded-full ${getColor( message.sender.color)} `}>
                       {message.sender.firstName ? message.sender.firstName.split("").shift(): 
                         message.sender.email.split("").shift()}
                        </AvatarFallback>

                  </Avatar>
                        <span className='text-sm text-white/60' >
                          {`${message.sender.firstName} ${message.sender.lastName}`}
                        </span>
                        <span className='text-sm text-white/60' >
                        {moment(message.timestamp).format("LT")}
                        </span>
            </div>
          ): (
            <div className='text-sm text-white/60 mt-1' >
            {moment(message.timestamp).format("LT")}
            </div>
          )
        }

      </div>
    )
  }

  return (
    <div className='flex-1 overflow-y-auto no-scrollbar p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full '>
      {renderMessages()}
      <div ref={scrollRef}/>

      {
        showImage && (
          <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col ">
              <div>
                <img src={`${BASE_URL}/${ImageUrl}`} alt="" className='h-[80vh] w-full bg-cover ' />
              </div>

              <div className='flex gap-5 fixed top-0 mt-5'>
                <button className='bg-black/20 rounded-full hover:bg-black/50 p-3 text-2xl cursor-pointer transition-all duration-300' onClick={()=>download(ImageUrl)}>
                <ArrowDown size={20} />
                </button>

                <button className='bg-black/20 rounded-full hover:bg-black/50 p-3 text-2xl cursor-pointer transition-all duration-300' onClick={()=>{
                  setshowImage(false);
                  setImageUrl(null);
                }}>
                <X size={20} />
                </button>
              </div>
          </div>
        )
      }
    </div>
  )
}
