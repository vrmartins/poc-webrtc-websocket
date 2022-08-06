import { Socket } from 'socket.io'
import { v4 as uuidV4 } from 'uuid'

const rooms: Record<string, Set<string>> = {}

interface IRoomParams {
    roomId: string
    peerId: string
}

export const roomHandler = (socket: Socket) => {
    const createRoom = () => {
        const roomId = uuidV4()
        rooms[roomId] = new Set()
        socket.join(roomId)
        socket.emit('room-created', { roomId })
        console.log(`User created the room ${roomId}`)

    }

    const leaveRoom = ({ roomId, peerId }: IRoomParams) => {
        console.log(`User left the room ${roomId}`)
        socket.leave(roomId)
        rooms[roomId].delete(peerId)

        socket.to(roomId).emit('user-disconnected', { peerId })
    }

    const joinRoom = ({ roomId, peerId }: IRoomParams) => {
        console.log(`User ${peerId} joined the room ${roomId}`)
        socket.join(roomId)

        if (!(roomId in rooms)) {
            console.warn(`User ${peerId} requested to join to room ${roomId} and it was not creaated`)
            rooms[roomId] = new Set()
        }

        rooms[roomId].add(peerId)
        socket.to(roomId).emit('user-joined', { peerId })
        socket.emit('get-users', { roomId, participants: Array.from(rooms[roomId].values()) })

        socket.on('disconnect', () => {
            leaveRoom({ roomId, peerId })
        })
    }

    socket.on('create-room', createRoom)
    socket.on('join-room', joinRoom)
    socket.on('leave-room', leaveRoom)
}