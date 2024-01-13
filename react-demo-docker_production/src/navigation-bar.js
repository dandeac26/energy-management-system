import React, { useState, useRef, useEffect } from "react";

import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  Button,
  NavLink,
  UncontrolledDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
} from "reactstrap";
import { TabContent, TabPane, NavItem } from "reactstrap";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import logo from "./commons/images/icon.png";

const textStyle = {
  color: "white",
  textDecoration: "none",
};

function NavigationBar() {
  const [modal, setModal] = React.useState(false);
  const [currentMessage, setCurrentMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [stompClient, setStompClient] = React.useState(null);
  const messagesEndRef = useRef(null);
  const [activeChats, setActiveChats] = useState({});
  const [activeTab, setActiveTab] = useState("0");

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const toggleModal = () => setModal(!modal);

  const connect = () => {
    // Mock connection to WebSocket
    const socket = new SockJS("http://localhost:8088/websocket-endpoint");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    });

    setStompClient(client);
  };

  const disconnect = () => {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
    setStompClient(null);
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() && stompClient) {
      const newMessage = {
        sender: "user",
        destination: "admin",
        text: currentMessage,
        seen: false,
        role: "user",
      };
      stompClient.send("/app/send", {}, JSON.stringify(newMessage));
      setCurrentMessage("");
    }
  };

  const handleIncomingMessage = (msg) => {
    setActiveChats((prevChats) => {
      const chat = prevChats[msg.sender] || { messages: [] };
      chat.messages.push(msg);
      return { ...prevChats, [msg.sender]: chat };
    });
    if (!activeTab) {
      setActiveTab(msg.sender);
    }
  };

  const modalStyle = {
    maxWidth: "500px", // Set your desired width
    height: "600px", // Set your desired height
    overflow: "hidden", // This ensures the modal itself won't grow
  };
  return (
    <div>
      <Navbar color="dark" light expand="md">
        <NavbarBrand href="/">
          <img src={logo} width={"50"} height={"35"} />
        </NavbarBrand>
        <Nav className="mr-auto" navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle style={textStyle} nav caret>
              Menu
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                <NavLink href="/user">Users</NavLink>
                <NavLink href="/device">Devices</NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <Nav className="ml-auto" navbar>
          {" "}
          {/* Move "Login" button to the right */}
          <Button
            style={{ marginRight: "10px", backgroundColor: "gray" }}
            onClick={toggleModal}
          >
            Chat
          </Button>
          <Button style={{ backgroundColor: "Green" }} href="/login">
            Login
          </Button>
          <Modal
            isOpen={modal}
            toggle={toggleModal}
            onOpened={connect}
            onClosed={disconnect}
            style={modalStyle}
          >
            <ModalHeader toggle={toggleModal}>Chat</ModalHeader>
            <ModalBody>
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  padding: "10px",
                  height: "600px",
                }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: msg.sender === "user" ? "right" : "left",
                      margin: "5px 0",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor:
                          msg.sender === "user" ? "#e0e0e0" : "#f0f0f0",
                        borderRadius: "10px",
                        padding: "10px 15px",
                        display: "inline-block",
                        maxWidth: "80%",
                      }}
                    >
                      {msg.text}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <FormGroup>
                <Input
                  type="textarea"
                  placeholder="Type your message here..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleSendMessage}>
                Send
              </Button>{" "}
              <Button color="secondary" onClick={toggleModal}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
