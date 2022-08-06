import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

export const Create: React.FC = () => {
    const { ws } = useContext(RoomContext);
    const joinRoom = () => {
        ws.emit('create-room')
    }
    return (
        <button
            onClick={joinRoom}
            className="bg-rose-400 py-2 px-8 rounded-lg text-xl hover:bg-rose-600 text-white"
        >
            Start new meeting
        </button>
    )
}