import React, { useEffect } from "react";
import luminachat1 from "@/assets/luminachat1.png";
import ProfileInfo from "./components/profile-info";
import NewDM from "./components/new-dm";
import apiClient from "@/lib/api-client";
import { GET_DM_CONTACT_ROUTES, GET_USER_CHANNELS_ROUTE } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/contact-list";
import CreateChannel from "./components/create-channel";

function ContactsContainer() {
 const {setDirectMessagesContacts,directMessagesContacts,channels,setChannels} = useAppStore();
  useEffect(()=>{
    const getContacts = async()=>{
      const response  = await apiClient.get(GET_DM_CONTACT_ROUTES,{withCredentials:true});
      if(response.data.contacts){
        setDirectMessagesContacts(response.data.contacts)
      }
    };

    const getChannels= async()=>{
      const response  = await apiClient.get(GET_USER_CHANNELS_ROUTE,{withCredentials:true});
      if(response.data.channels){
        setChannels(response.data.channels);
      }
    }
    getContacts();
    getChannels();
  },[])

  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw]  bg-black border-r-2 border-[#00DFC0] w-full">
      <div className="border-b-4 border-b-[#00DFC0]">
        <img src={luminachat1} height={50} alt="lumina chat "/>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
              <Title text="Chats" />
              <NewDM/>
        </div>  
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts = {directMessagesContacts}/>
        </div>
      </div>
      <div className="my-5">
        <div className="flex items-center justify-between pr-10">
              <Title text="Groups"/>
              <CreateChannel/>
        </div>
        <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
          <ContactList contacts = {channels} isChannel={true}/>
        </div>
       
      </div>
      <ProfileInfo/>  
    </div>
  );
}

export default ContactsContainer;



const Title = ({text})=>{
  return (
    <h6 className="uppercase tracking-widest text-[#00DFC0] pl-10 font-semibold text-opacity-90 text-sm">{text}</h6>
  )
}