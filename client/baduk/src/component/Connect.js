import io from 'socket.io-client'
import { useEffect } from 'react'

export default function Connect(props) {
    const socket = io.socket("http://localhost:3002");

    useEffect(() => {
        socket.on("received_coordinates", (data) => {

        })
    }, [socket]);

    const sendmessage = () => {
        socket.emit("send_coordinates", {"x" : 1, "y" : 2});
    };

    
}