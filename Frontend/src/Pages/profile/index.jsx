import { useAppStore } from "@/store";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { FaPlus, FaTrash } from "react-icons/fa";
import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";

function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setselectedColor] = useState(0);
  const fileInputRef = useRef(null);


  useEffect(()=>{
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setselectedColor(userInfo.color);
    }
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`);
    }
  },[userInfo])

  const validateProfile = ()=>{
    if(!firstName){
      toast.error("FirstName is Required");
      return false;
    }
    if(!lastName){
      toast.error("lastName is Required");
      return false;
    }
    return true;
  }

  const saveChanges = async () => {
    if(validateProfile()){
      try{
        const response = await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,color:selectedColor},{withCredentials:true});
        if(response.status === 200 && response.data){
          setUserInfo({...response.data});
          toast.success("Profile Updated Succesfully");
          navigate("/chat");
        }
      }catch(error){
        console.log(error);
      }
    }
  };

  const handleNavigate = ()=>{
    if(userInfo.profileSetup){
      navigate("/chat");
    }else{
    toast.error("please Setup the profile.")
      }  }
  const handleFileInputClick = ()=>{
    fileInputRef.current.click();
  }
  const handleImageChange = async(event)=>{
      const file = event.target.files[0];
      console.log(file);
      if(file){
        const formData = new FormData();
        formData.append("profile-image",file);
        const response = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true});
        if(response.status === 200 && response.data.image){
          setUserInfo({...userInfo,image:response.data.image});
          toast.success("Image updated Succesfully.")
        }
      //   const reader = new FileReader();
      //   reader.onload=() =>{
      //     setImage(reader.result);
      //   }
      //   reader.readAsDataURL(file);
      }

  }
  const handleDeleteImage = async()=>{
    try{
      const response = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE,{withCredentials:true});
      if(response.status === 200){
        setUserInfo({...userInfo,image:null});
        toast.success("image remove succesfully");
        setImage(null);
      }
    }catch(error){
      
    }
  }
  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw]  md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/30 cursor-pointer hover:text-white" />
        </div>
        <div className="grid grid-cols-2">
          <div
            className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="w-full h-full bg-black object-cover"
                />
              ) : (
                <div
                  className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(
                    selectedColor
                  )}`}
                >
                  {firstName
                    ? firstName.split("").shift()
                    : userInfo.email.split("").shift()}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-full ring-fuchsia-50 cursor-pointer"
              onClick={image? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpeg, .jpg, .svg, .webp"/>
          </div>
          <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
            <div className="w-full">
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="firstName"
                type="text"
                value={firstName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                placeholder="lastName"
                type="text"
                value={lastName}
                className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="w-full flex gap-5 ">
              {colors.map((color, index) => (
                <div
                  className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                  ${selectedColor === index ? "outline outline-white " : ""}
                  `}
                  key={index}
                  onClick={() => setselectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-[#00DFC0] hover:bg-[#00dfc19b] transition-all duration-300" onClick={saveChanges}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
