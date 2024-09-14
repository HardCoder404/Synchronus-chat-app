import React, { memo, useEffect, useState } from "react";
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
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { BASE_URL, CREATE_CHANNEL_ROUTE, GET_ALL_CONTACTS_ROUTE, SEARCH_CONTACTS_ROUTE } from "@/utils/constants";
import { userAppStore } from "@/store";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";


export default function CreateChannel() {

    const {setSelectedChatType,setSelectedChatData,addChannel} = userAppStore();
    const [newChannelModal, setNewChannelModal] = useState(false);
    const [allContacts, setallContacts] = useState([]);
    const [selectedContacts, setselectedContacts] = useState([]);
    const [channelName, setchannelName] = useState("");


    useEffect(() => {
      const getdata = async () =>{
        const response = await apiClient.get(GET_ALL_CONTACTS_ROUTE, {withCredentials:true});
        setallContacts(response.data.contacts);
      };
      getdata();
    }, [])
    
    const createChannel = async()=>{
       try {
        if(channelName.length>0 && selectedContacts.length>0){
            const response = await apiClient.post(CREATE_CHANNEL_ROUTE,
                {
                    name: channelName,
                    members: selectedContacts.map((contact)=> contact.value),
                },
                {withCredentials:true}
            );

            if(response.status === 200){
                setchannelName("");
                setselectedContacts([]);
                setNewChannelModal(false);
                addChannel(response.data.channel);
            }
        }
       } catch (error) {
        console.log(error);
       }
    }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Plus size={20} className="cursor-pointer" onClick={()=>setNewChannelModal(true)} />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white ">
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
  <DialogContent className="bg-[#181920] border-none text-white md:w-[400px] w-[350px] rounded-lg h-[400px] flex flex-col  ">
    <DialogHeader>
      <DialogTitle>Please fill up the details for new channel</DialogTitle>
      <DialogDescription></DialogDescription>
    </DialogHeader>
    <div>
        <Input 
        placeholder="Channel Name"
        className="rounded-lg p-6 bg-[#2c2e3b] border-none "
        onChange = {(e) => setchannelName(e.target.value)}
        value ={channelName}
        />
    </div>
    <div>
        <MultipleSelector 
        className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
        defaultOptions = {allContacts}
        placeholder = "Search Contacts"
        value ={selectedContacts}
        onChange ={setselectedContacts}
        emptyIndicator = {
            <p className="text-center text-lg leading-10 text-gray-600">No results found</p>
        }
        />
    </div>
    <div>
        <Button className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 "
        onClick={createChannel}
        >
        Create Channel
       </Button>
    </div>
  </DialogContent>
</Dialog>


    </>
  );
}
