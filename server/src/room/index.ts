import { Socket } from 'socket.io'
import { v4 as uuidV4 } from 'uuid'

export const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidV4()
        socket.join(roomId)
        socket.emit('room-created', { roomId })
        console.log(`User created the room ${roomId}`)

    }

    const joinRoom = ({ roomId }: { roomId: string }) => {
        console.log(`User joined the room ${roomId}`)
        socket.join(roomId)
    }

    const leaveRoom = ({ roomId }: { roomId: string }) => {
        console.log(`User left the room ${roomId}`)
        socket.leave(roomId)
    }
    
    socket.on('create-room', createRoom)
    socket.on('join-room', joinRoom)
    socket.on('leave-room', leaveRoom)
}