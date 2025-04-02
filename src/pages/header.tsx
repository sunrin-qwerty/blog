import React, { useState, useEffect } from 'react'
import './../App.css'
import './style/header.css'
import logo from '/qwerty-logo.svg'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

interface User {
    id: string
    username: string
    email: string
    avatar?: string
}

const backendAuthUrl = "http://localhost:3000/auth/discord"

const Headers: React.FC = () => {
    const [user, setUser] = useState<User | null>(null)
    const navigator = useNavigate()

    useEffect(() => {
        axios.get<User>(`${backendAuthUrl}/user`, { withCredentials: true })
            .then(({ data }) => setUser(data))
            .catch(() => setUser(null))
    }, [])

    return (
        <header>
            <div className="hd-logo" onClick={() => navigator("/")}>
                <img src={logo} alt="logo" />
                <h1>QWERTY Blog</h1>
            </div>
            <ul className="nav">
                <li>
                    {user ? (
                        <>
                            <a href={`${backendAuthUrl}/logout`}>Logout</a>
                            <img onClick={() => navigator("/profile")} src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="User Avatar" className="avatar" />
                        </>
                    ) : (
                        <a href={`${backendAuthUrl}/login`}>Login</a>
                    )}
                </li>
            </ul>
        </header>
    )
}

export default Headers
