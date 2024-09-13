import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import Auth from "./pages/auth"
import Chat from "./pages/chat"
import Profile from "./pages/profile"
import { userAppStore } from "./store"
import { useEffect, useState } from "react"
import { apiClient } from "./lib/api-client"
import { GET_USER_INFO } from "./utils/constants"

function App() {

  const PrivateRoute =({children})=>{
    const {userInfo} = userAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated? children : <Navigate to="/auth" />
  };
  const AuthRoute =({children})=>{
    const {userInfo} = userAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated? <Navigate to="/chat" /> : children;
  }


  const {userInfo,setUserInfo} = userAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async ()=>{
      try {
        const response = await apiClient.get(GET_USER_INFO,{withCredentials:true});
        if(response.status === 200 && response.data.id){
          setUserInfo(response.data);
        }else{
          setUserInfo(undefined)
        }  
      } catch (error) {
        setUserInfo(undefined)
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    if(!userInfo){
      getUserData();
    }else {
      setLoading(false);
    }
  }, [userInfo,setUserInfo])
  
  if(loading) {
    return( 
<div className="w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
<div className="loading">
        <svg viewBox="0 0 187.3 93.7" height="200px" width="300px" className="svgbox">
          <defs>
            <linearGradient y2="0%" x2="100%" y1="0%" x1="0%" id="gradient">
              <stop stopColor="pink" offset="0%"></stop>
              
                <stop stopColor="blue" offset="100%"></stop>
            </linearGradient>
          </defs>

          <path stroke="url(#gradient)" d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"></path>
        </svg>

        </div>
    </div>
    )
  }

  return (  
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={
        <AuthRoute>
         <Auth/>
        </AuthRoute>} />
        <Route path="/chat" element={
          <PrivateRoute>
            <Chat/>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile/>
          </PrivateRoute>
        } />

        
        {/* if the user type anything in the endpoint route and it doesn't match with the existing routes, then it will redirect it to the /auth. */}
        <Route path="*" element={<Navigate to="/auth" />}/>  
      </Routes>
    </BrowserRouter>
  )
}

export default App
