import React, { useState, useEffect } from 'react'
import './style/home.css'
import './../App.css'
import Headers from './header'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const backendSelectUrl = "https://blog.sunrint-qwerty.kr/api/select"

const Home: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([])
    const [tags, setTags] = useState<any[]>([])
    const navigator = useNavigate()

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        const day = ('0' + date.getDate()).slice(-2)
        return `${year}.${month}.${day}`
    }

    useEffect(() => {
        axios.get(`${backendSelectUrl}/posts`)
            .then(({ data }) => {
                const formattedPosts = data.map((post: any) => ({
                    ...post,
                    created_at: formatDate(post.created_at),
                    updated_at: formatDate(post.updated_at)
                }))
                setPosts(formattedPosts)
            })
    }, [])

    useEffect(() => {
        axios.get(`${backendSelectUrl}/tage`)
            .then(({ data }) => {
                setTags(data)
            })
    }
    , [])

    return (
        <>
            <Headers />
            <div className='tag-list'>
                <button className='tage_name'
                    onClick={() => {
                        axios.get(`${backendSelectUrl}/posts`)
                            .then(({ data }) => {
                                const formattedPosts = data.map((post: any) => ({
                                    ...post,
                                    created_at: formatDate(post.created_at),
                                    updated_at: formatDate(post.updated_at)
                                }))
                                setPosts(formattedPosts)
                            })
                    }}
                
                >All</button>
                {tags.map((tag, index) => (
                    <div key={index} className='tag-box'>
                        <button 
                            className='tag_name'
                            onClick={() => {
                                axios.get(`${backendSelectUrl}/posts?tag_id=${tag.id}`)
                                    .then(({ data }) => {
                                        const filteredPosts = data.map((post: any) => ({
                                            ...post,
                                            created_at: formatDate(post.created_at),
                                            updated_at: formatDate(post.updated_at)
                                        }))
                                        setPosts(filteredPosts)
                                    })
                            }}
                        >
                            {tag.tage_name}
                        </button>
                    </div>
                ))}
            </div>
            <div className="posts">
                {posts.map((post, index) => (
                    <div key={index} className="post" onClick={() => navigator(`/post/${post.id}`)}>
                    <p className='tage_name'>{post.tage_name}</p>
                        <div className="title-box">
                            <h2 className='title'>{post.title}</h2>
                            <p className='date'>{post.created_at}</p>
                        </div>
                    <p className='explantion'>{post.explanation}</p>
                        <div className="post-author">
                            <img src={`https://cdn.discordapp.com/avatars/${post.discord_id}/${post.avatar}.png`} alt="User Avatar" className="avatars" />
                            <p>{post.username}</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Home
