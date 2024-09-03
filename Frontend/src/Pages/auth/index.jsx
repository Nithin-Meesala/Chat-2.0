import React, { useState } from 'react';
import login4 from "@/assets/login4.jpg";
import victory from "@/assets/victory.svg";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import apiClient from '@/lib/api-client'; 
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constants';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import "./../auth/style.css"

function Auth() {
  const navigate = useNavigate();
  const {setUserInfo} = useAppStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const validateSignup = ()=>{
    if(!email.length){
      toast.error("Email is required.")
      return false;
    }
    if(!password.length){
      toast.error("Password is required.")
      return false;
    }
    if(password !== confirmpassword){
      toast.error("Password and Conform password should be same.")
      return false;
    }
    return true;
    
  }
 
  const validateLogin = ()=>{
    if(!email.length){
      toast.error("Email is required.")
      return false;
    }
    if(!password.length){
      toast.error("Password is required.")
      return false;
    }
    return true;
  }

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
        console.log("Full response:", response);
  
        if (response.data ) {
          setUserInfo(response.data);
          
          if (response.data.profileSetup) {
              navigate("/chat");
          } else {
             navigate("/profile");
          }
        } else {
          console.log("User not found in response data");
        }
      } catch (error) {
        console.error("Login failed", error);
        toast.error("Login failed. Please try again.");
      }
    }
  };
  

  const handleSignup = async()=>{
    if(validateSignup()){
      const response = await apiClient.post(SIGNUP_ROUTE,{email,password},{withCredentials:true});
      if(response.status === 201){
        setUserInfo(response.data.user);
        navigate("/profile");
      }
      console.log({response});
    }
  }
  return (
    <div className='h-[100vh] w-[100vw] flex justify-center items-center bg-black grid-background'>
      <div className='h-[80vh] text-white border-2 border-white  text-opacity-90 
      shadow-2xl w-[80vw] md:w-[90vw]  lg:w-[70vw] xl:w-[60vw] rounded-3xl grid 
      xl:grid-cols-2 bg-black'
      >
        <div className=' flex flex-col gap-10 items-center justify-center'>
       
          <div className='flex justify-center items-center flex-col'>

              <div className='flex items-center justify-center mb-2'>

                <h1 className='text-5xl font-bold md:text-6xl text-[#00DFC0] '> Hey! Welcome</h1>
                {/* <img src={victory} alt="Victory emoji" className='h-[100px]' /> */}<br/><br />
                </div>
                <p className='font-medium text-center pt-4'>Get started with <span className='text-[#00DFC0] font-bold'>Lumina Chat</span></p>
          </div>
          <div className='flex items-center justify-center w-full'>
            <Tabs className='w-3/4' defaultValue='login'>
              <TabsList className="bg-transparent w-full rounded-none">
                <TabsTrigger value="login"
                className="data-[state=active]:bg-transparent text-white
                 text-opacity-90 border-b-2 rounded-none w-full
                 data-[state=active]:text-white data-[state=active]:font-semibold
                 data-[state=active]:border-b-[#00DFC0] p-3 transition-all duration-300 "
                
                >Login</TabsTrigger>
                <TabsTrigger value="signup"
                className="data-[state=active]:bg-transparent text-white
                text-opacity-90 border-b-2 rounded-none w-full
                data-[state=active]:text-white data-[state=active]:font-semibold
                data-[state=active]:border-b-[#00DFC0] p-3 transition-all duration-300 "
                >SignUp</TabsTrigger>
              </TabsList>
              <TabsContent className='flex flex-col gap-5 mt-10' value='login'>
                <Input 
                  placeholder="email" 
                  type="email" 
                  className="rounded-full p-6 text-black" 
                  value={email} 
                  onChange = {(e)=>setEmail(e.target.value)}>
                </Input>
                <Input 
                  placeholder="password" 
                  type="password" 
                  className="rounded-full p-6 text-black" 
                  value={password} 
                  onChange = {(e)=>setPassword(e.target.value)}>
                </Input>
                <Button className="rounded-full p-6 bg-[#00DFC0]" onClick={handleLogin}>Login</Button>
              </TabsContent>
              <TabsContent className='flex flex-col gap-5 ' value='signup'>
              <Input 
                  placeholder="email" 
                  type="email" 
                  className="rounded-full p-6 text-black" 
                  value={email} 
                  onChange = {(e)=>setEmail(e.target.value)}>
                </Input>
                <Input 
                  placeholder="password" 
                  type="password" 
                  className="rounded-full p-6 text-black" 
                  value={password} 
                  onChange = {(e)=>setPassword(e.target.value)}>
                </Input>
                <Input 
                  placeholder="password" 
                  type="password" 
                  className="rounded-full p-6 text-black" 
                  value={confirmpassword} 
                  onChange = {(e)=>setConfirmPassword(e.target.value)}>
                </Input>
                <Button className="rounded-full p-6 bg-[#00DFC0]" onClick={handleSignup}>SignUp</Button>
              </TabsContent>
            </Tabs>
          </div>    
        </div>
        <div className=' hidden xl:flex justify-center items-center'>
        <img src={login4} alt="" className='h-[400px] rounded-lg' />
        </div>
      </div>
     </div>
  )
}

export default Auth