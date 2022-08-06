import { useContext, useEffect } from "react"
import { useParams } from "react-router-dom"
import { RoomContext } from "../context/RoomContext"

export const Room = () => {
    const { id } = useParams()
    const { ws } = useContext(RoomContext)

    useEffect(() => {
        ws.emit('join-room', { roomId: id })
        console.log(`Joined the room ${id}`)

        return () => {
            ws.emit('leave-room', { roomId: id })
            console.log(`Left the room ${id}`)
        }
    }, [id])
    return <>Room id {id}</>
}