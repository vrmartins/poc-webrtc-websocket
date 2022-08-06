import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { VideoPlayer } from "../components/VideoPlayer"
import { RoomContext } from "../context/RoomContext"

export const Room = () => {
    const { id } = useParams()
    const { ws, me, stream } = useContext(RoomContext)

    useEffect(() => {
        if (me) ws.emit('join-room', { roomId: id, peerId: me._id })
        console.log(`Joined the room ${id}`)

        return () => {
            if (me) ws.emit('leave-room', { roomId: id, peerId: me._id })
            console.log(`Left the room ${id}`)
        }
    }, [id, me, ws])
    return <>
        Room id {id}
        <div>
            <VideoPlayer stream={stream} />
        </div>
    </>
}