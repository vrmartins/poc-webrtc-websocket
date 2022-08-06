
import React, { createContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import { useEffectOnce } from '../utils/useEffectOnce'

const WS = 'ws://localhost:8000'

export const RoomContext = createContext<null | any>(null)

const ws = socketIOClient(WS)

export const RoomProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()
    const enterRoom = ({ roomId }: { roomId: string }) => {
        console.log({ roomId })
        navigate(`/room/${roomId}`)
    }
    useEffect(() => {
        ws.on('room-created', enterRoom)
        
        return () => {
            ws.off('room-created', enterRoom)
        }
    })
    return (
        <RoomContext.Provider value={{ ws }}>
            {children}
        </RoomContext.Provider>
    )
}