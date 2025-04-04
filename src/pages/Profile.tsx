import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './../App.css'
import './style/header.css'
import Headers from './header'

interface User {
  username: string
  email: string
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
    const backendAuthUrl = "https://blog.sunrint-qwerty.kr/api/auth/discord"

  useEffect(() => {
    checkUserStatus()
  }, [])

  const checkUserStatus = async () => {
    try {
      const response = await axios.get(`${backendAuthUrl}/user`, {
        withCredentials: true
      })
      setUser(response.data)
    } catch (error) {
      console.error('Error checking user status:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Headers />
      <h1>QWERTY Blog - Profile</h1>
        {user ? (
          <div className="user-profile">
            <h2>Welcome, {user.username}!</h2>
            <p>Email: {user.email}</p>
            <button onClick={() => navigate('/create-post')}>Create Post</button>
          </div>
        ) : (
          <div>
            <button onClick={() => navigate('/')}>Back to Login</button>
          </div>
        )}
    </>
  )
}

export default Profile