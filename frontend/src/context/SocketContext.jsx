import { userAppStore } from "@/store";
import { BASE_URL } from "@/utils/constants";
import {createContext,useEffect,useRef,useContext} from "react"
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () =>{
    return useContext(SocketContext);
}

export const SocketProvider = ({children}) => {
    const socket = useRef();
    const {userInfo} = userAppStore();

    useEffect(() => {
      if(userInfo){
        socket.current = io(BASE_URL, {
            withCredentials:true,
            query: { userId: userInfo.id},
        });

        socket.current.on("connect", ()=>{
            console.log("Connected to Socket Server");
        });


        const handleReceiveMessage= (message) =>{
            const {selectedChatData,selectedChatType,addMessage} = userAppStore.getState();

            if(
                selectedChatType !== undefined && 
                (selectedChatData._id === message.sender._id ||
                 selectedChatData._id === message.recipient._id
                )
            ){  
                addMessage(message);
            }
        }  

        const handleReceiveChannelMessage = (message) =>{
            const {selectedChatData,selectedChatType,addMessage} = userAppStore.getState();
            if(
                selectedChatType !== undefined && 
                selectedChatData._id === message.channelId
            ){
                addMessage(message);
            };
        }

        socket.current.on("receiveMessage",handleReceiveMessage);
        socket.current.on("receive-channel-message",handleReceiveChannelMessage);

        return ()=>{
            socket.current.disconnect();
        }
      }
    }, [userInfo]);
    
    return (
    <SocketContext.Provider value={socket.current}>
        {children}
    </SocketContext.Provider>
    )
}