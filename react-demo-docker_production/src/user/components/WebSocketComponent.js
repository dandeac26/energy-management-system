import React, { useEffect } from "react";
import io from "socket.io-client";

const WebSocketComponent = () => {
  useEffect(() => {
    const wsUrl =
      process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:5001"; // Make sure this matches your server's URL
    const socket = io(wsUrl);

    socket.on("test_message", (data) => {
      console.log("Test message received:", data);
    });

    socket.on("message", (data) => {
      console.log("Received data:", data);
      displayPopupNotification(data);
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const displayPopupNotification = (data) => {
    if (window.location.href === "http://localhost:3003/device") {
      if (data && data.notification && data.content) {
        console.log("Received notification:", data);
        alert(data.notification + "\n" + data.content);
      } else {
        console.warn("Invalid notification data received:", data);
      }
    }
  };

  return null;
};

export default WebSocketComponent;
