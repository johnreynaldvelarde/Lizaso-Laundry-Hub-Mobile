import { BASE_URL } from "@/data/axios";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = BASE_URL.replace("/api", "");

const useSocket = (userDetails) => {
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      if (userDetails?.userId && userDetails?.storeId) {
        newSocket.emit("register", {
          userId: userDetails.userId,
          storeId: userDetails.storeId,
          userType: userDetails.user_type,
        });
      }
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
  }, [userDetails]);

  return { socket, error };
};

export default useSocket;
