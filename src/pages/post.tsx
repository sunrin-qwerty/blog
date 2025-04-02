import './style/home.css'
import './../App.css'
import Headers from './header'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import React from 'react'

const Post: React.FC = () => {
    const { id } = useParams()
    const backendSelectUrl = "http://localhost:3000/read"
    const [post, setPost] = React.useState<any>(null)
    const [loading, setLoading] = React.useState(true)

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = ('0' + (date.getMonth() + 1)).slice(-2)
        const day = ('0' + date.getDate()).slice(-2)
        return `${year}.${month}.${day}`
    }

    React.useEffect(() => {
        axios.get(`${backendSelectUrl}/posts/${id}`)
            .then(({ data }) => {
                setPost({
                    ...data,
                    created_at: formatDate(data.created_at),
                    updated_at: formatDate(data.updated_at)
                })
            })
            .catch(() => setPost(null))
            .finally(() => setLoading(false))
    }, [id])
    if (loading) {
        return <div>Loading...</div>
    }
    if (!post) {
        return <div>Post not found</div>
    }
    return (
        <>
            <Headers />
            <div className="post">
                <p className='tage_name'>{post.tage_name}</p>
                <div className="title-box">
                    <h2 className='title'>{post.title}</h2>
                    <p className='date'>{post.created_at}</p>
                </div>
                <p className='explantion'>{post.explanation}</p>
                <div className="content">{post.content}</div>
                <div className="post-author">
                    <img src={`https://cdn.discordapp.com/avatars/${post.discord_id}/${post.avatar}.png`} alt="User Avatar" className="avatars" />
                    <p>{post.username}</p>
                </div>
            </div>
        </>
    )
}

export default Post