import React, { useState, useEffect } from 'react'
import './../App.css'
import Headers from './header'
import axios from 'axios'
import Markdown from 'react-markdown'
const backendSelectUrl = "https://blog.sunrint-qwerty.kr/api/select"

const Post: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([])
    const postId = window.location.pathname.split('/').pop()

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        const day = ('0' + date.getDate()).slice(-2)
        return `${year}.${month}.${day}`
    }
    useEffect(() => {
        axios.get(`${backendSelectUrl}/posts/${postId}`)
            .then(({ data }) => {
                if (Array.isArray(data)) {
                    const formattedPosts = data.map((post: any) => ({
                        ...post,
                        created_at: formatDate(post.created_at),
                        updated_at: formatDate(post.updated_at)
                    }))
                    setPosts(formattedPosts)
                } else if (data && typeof data === 'object') {
                    const formattedPost = {
                        ...data,
                        created_at: formatDate(data.created_at),
                        updated_at: formatDate(data.updated_at)
                    }
                    setPosts([formattedPost]) 
                } else {
                    console.error("Unexpected response format:", data)
                }
            })
            .catch((error) => {
                console.error("Error fetching post:", error)
            })
    }, [])

    return (
        <>
            <Headers />
                <div className="posts">
                    {posts.map((post, index) => (
                        <div key={index} className="post">
                            <p className='tage_name'>{post.tage_name}</p>
                            <div className="title-box">
                                <h2 className='title'>{post.title}</h2>
                                <p className='date'>{post.created_at}</p>
                            </div>
                            <Markdown>{post.content}</Markdown>
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
export default Post