import { BASE_URL } from "@/data/axios";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = BASE_URL.replace("/api", "");

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("connect_error", (err) => {
      setError("Connection failed: " + err.message);
      console.error("Socket connection error:", err);
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return { socket, error };
};

export default useSocket;
