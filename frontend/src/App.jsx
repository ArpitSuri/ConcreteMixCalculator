import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Homepage from './screens/HomeScreen'
import MixDesignForm from './screens/InputForm'
import MixDesignResult from './screens/ResultScreen'
import {Toaster} from 'react-hot-toast'
import GoogleLogin from './screens/GoogleLogin'
import Dashboard from './screens/DashBoard'
import { GoogleOAuthProvider } from '@react-oauth/google'
import MyDesigns from './screens/MyDesign'

function App() {
  const [formDataSend, setFormDataSend] = useState(null);   // NEW for input
  const [resultData, setResultData] = useState(null);  // Already there

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin />
      </GoogleOAuthProvider>
    )
  }

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
          <Route path="/input" element={<MixDesignForm setFormDataSend={setFormDataSend} setResultData={setResultData} />} />
          <Route path="/result" element={<MixDesignResult formDataSend={formDataSend} result={resultData} />} />
          <Route path="/login" element={<GoogleAuthWrapper />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-designs" element={<MyDesigns />} />
    </Routes>
    </BrowserRouter>


      <Toaster position="top-center" reverseOrder={false} />

    </>
  )
}

export default App
