import Peer from 'peerjs'
import React, { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import { v4 as uuidV4 } from 'uuid'

const WS = 'ws://localhost:8000'

export const RoomContext = createContext<null | any>(null)

const ws = socketIOClient(WS)

export const RoomProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()
    const [me, setMe] = useState<Peer>()
    const [stream, setStream] = useState<MediaStream>()
    const enterRoom = ({ roomId }: { roomId: string }) => {
        console.log({ roomId })
        navigate(`/room/${roomId}`)
    }
    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log(participants)
    }

    useEffect(() => {

        console.log('RoomContext', 'useEffect')
        const myId = uuidV4()
        const peer = new Peer(myId)
        setMe(peer)

        try {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                .then(stream => {
                    setStream(stream)
                })
        } catch (error) {
            console.error(error)
        }

        ws.on('room-created', enterRoom)
        ws.on('get-users', getUsers)

        return () => {
            ws.off('room-created', enterRoom)
        }
    }, [])
    return (
        <RoomContext.Provider value={{ ws, me, stream }}>
            {children}
        </RoomContext.Provider>
    )
}