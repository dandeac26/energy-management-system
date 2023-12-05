import React, { useEffect } from "react";
import io from "socket.io-client";

const WebSocketComponent = () => {
  useEffect(() => {
    // Dynamic WebSocket URL based on environment
    const wsUrl =
      process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:5001"; // Make sure this matches your server's URL
    const socket = io(wsUrl);

    // Listening for 'test_message' event from the server
    socket.on("test_message", (data) => {
      console.log("Test message received:", data);
    });

    // Listening for 'message' event from the server
    socket.on("message", (data) => {
      console.log("Received data:", data);
      displayPopupNotification(data); // Assuming the data is already in the required format
    });

    // Handling connection errors
    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err.message);
    });

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to display notifications
  const displayPopupNotification = (data) => {
    if (data && data.notification && data.content) {
      console.log("Received notification:", data);
      alert(data.notification + "\n" + data.content);
    } else {
      console.warn("Invalid notification data received:", data);
    }
  };

  return null;
};

export default WebSocketComponent;
