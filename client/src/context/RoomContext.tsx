import Peer from 'peerjs'
import React, { createContext, useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import { v4 as uuidV4 } from 'uuid'
import { addPeerAction, removePeerAction } from './peerActions'
import { peersReducer } from './peerReducer'

const WS = 'ws://localhost:8000'

export const RoomContext = createContext<null | any>(null)

const ws = socketIOClient(WS)

export const RoomProvider: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate()
    const [me, setMe] = useState<Peer>()
    const [stream, setStream] = useState<MediaStream>()
    const [peers, dispatch] = useReducer(peersReducer, {})

    const enterRoom = ({ roomId }: { roomId: string }) => {
        console.log({ roomId })
        navigate(`/room/${roomId}`)
    }
    const getUsers = ({ participants }: { participants: string[] }) => {
        console.log(participants)
    }

    const removePeer = ({ peerId }: { peerId: string }) => {
        dispatch(removePeerAction(peerId))
    }

    useEffect(() => {
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
        ws.on('user-disconnected', removePeer)

        return () => {
            ws.off('room-created', enterRoom)
        }
    }, [])

    useEffect(() => {
        if (!me || !stream) return

        ws.on('user-joined', ({ peerId }) => {
            const call = me.call(peerId, stream)
            call.on('stream', (peerStream) => {
                dispatch(addPeerAction(peerId, peerStream))
            })
        })

        me.on('call', (call) => {
            call.answer(stream)
            call.on('stream', (peerStream) => {
                dispatch(addPeerAction(call.peer, peerStream))
            })
        })
    }, [me, stream])

    return (
        <RoomContext.Provider value={{ ws, me, stream, peers }}>
            {children}
        </RoomContext.Provider>
    )
}