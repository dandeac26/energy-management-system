import React, { useState, useRef, useEffect } from "react";
import classnames from "classnames";
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
import { v4 as uuidv4 } from "uuid";

const textStyle = {
  color: "white",
  textDecoration: "none",
};

const ChatMessage = ({ msg, onSeen }) => {
  const userDataString = localStorage.getItem("authenticatedUser");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const ref = useRef();
  const [hasMarkedSeen, setHasMarkedSeen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (
          entry.isIntersecting &&
          !msg.seen &&
          !hasMarkedSeen &&
          msg.sender !== userData.username
        ) {
          onSeen(msg.id, msg.sender);
          setHasMarkedSeen(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [msg, onSeen, hasMarkedSeen, userData.username]);

  return (
    <div
      ref={ref}
      key={msg.id}
      style={{
        textAlign: msg.sender === userData.username ? "right" : "left",
        margin: "5px",
      }}
    >
      <span
        style={{
          backgroundColor:
            msg.sender === userData.username ? "#e0e0e0" : "#f0f0f0",
          borderRadius: "10px",
          padding: "10px 15px",
          display: "inline-block",
          maxWidth: "80%",
        }}
      >
        {msg.text}

        {msg.sender === userData.username && msg.seen && (
          <span
            style={{ marginLeft: "10px", color: "#01A7F4", fontSize: "12pt" }}
          >
            &#10004;&#10004; {/* Unicode for checkmarks */}
          </span>
        )}
      </span>
    </div>
  );
};

function NavigationBar() {
  const [modal, setModal] = React.useState(false);
  const [currentMessage, setCurrentMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [stompClient, setStompClient] = React.useState(null);
  const messagesEndRef = useRef(null);
  const [activeChats, setActiveChats] = useState({ admin: { messages: [] } }); // Stores active chats with users
  const [selectedChat, setSelectedChat] = useState("admin"); // Stores the currently selected chat
  const userDataString = localStorage.getItem("authenticatedUser");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const isAdmin =
    userData && Array.isArray(userData.roles) && userData.roles[0] === "ADMIN";

  const modalRef = useRef(modal);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  function isUserAuthenticated() {
    const userData = localStorage.getItem("authenticatedUser");
    return userData !== null;
  }

  useEffect(() => {
    connect();
    scrollToBottom();
    return () => {
      disconnect();
    };
  }, [messages]);

  useEffect(() => {
    if (activeChats[selectedChat]) {
      scrollToBottom();
    }
  }, [activeChats, selectedChat]);

  useEffect(() => {
    modalRef.current = modal;
  }, [modal]);

  const toggleModal = () => {
    setModal(!modal);
    modalRef.current = !modal;
  };

  const connect = () => {
    const socket = new SockJS("http://localhost:8088/websocket-endpoint");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        if (
          receivedMessage.destination === userData.username ||
          receivedMessage.sender === userData.username
        ) {
          setActiveChats((prevChats) => {
            const updatedChats = { ...prevChats };
            const chatKey =
              receivedMessage.sender === userData.username
                ? receivedMessage.destination
                : receivedMessage.sender;

            if (!updatedChats[chatKey]) {
              updatedChats[chatKey] = { messages: [] };
            }

            if (receivedMessage.text === "seen" && receivedMessage.seen) {
              updatedChats[chatKey].messages = updatedChats[
                chatKey
              ].messages.map((msg) =>
                msg.id === receivedMessage.id ? { ...msg, seen: true } : msg
              );
            } else if (
              !updatedChats[chatKey].messages.some(
                (msg) => msg.id === receivedMessage.id
              )
            ) {
              updatedChats[chatKey].messages.push(receivedMessage);
            }

            return updatedChats;
          });
        }
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
    if (currentMessage.trim() !== "" && stompClient) {
      const newMessage = {
        id: uuidv4(),
        sender: userData.username,
        destination: isAdmin ? selectedChat : "admin",
        text: currentMessage,
        seen: false,
        role: userData.roles[0],
      };
      stompClient.send("/app/send", {}, JSON.stringify(newMessage));
      setCurrentMessage("");
    }
  };

  const markMessageAsSeen = (messageId, sender) => {
    if (stompClient) {
      const seenMessage = {
        id: messageId,
        sender: userData.username,
        destination: sender,
        text: "seen",
        seen: true,
        role: userData.roles[0],
      };
      stompClient.send("/app/send", {}, JSON.stringify(seenMessage));
    }
  };

  const modalStyle = {
    maxWidth: "500px",
    height: "600px",
    overflow: "hidden",
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
          {isUserAuthenticated() && (
            <Button
              style={{ marginRight: "10px", backgroundColor: "gray" }}
              onClick={toggleModal}
            >
              Chat
            </Button>
          )}
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
            <ModalBody key={selectedChat}>
              <Nav tabs>
                {Object.keys(activeChats).map((user) => {
                  if (isAdmin && user === "admin") {
                    return null;
                  }
                  return (
                    <NavItem key={user}>
                      <NavLink
                        className={classnames({
                          active: selectedChat === user,
                        })}
                        onClick={() => {
                          console.log("Setting selected chat to user:", user);
                          setSelectedChat(user);
                        }}
                      >
                        Chat with {user}
                      </NavLink>
                    </NavItem>
                  );
                })}
              </Nav>

              <TabContent activeTab={selectedChat}>
                {Object.keys(activeChats).map((user) => (
                  <TabPane tabId={user} key={user}>
                    <div
                      className="chat-messages"
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        height: "600px",
                        paddingBottom: "10px",
                        paddingTop: "10px",
                      }}
                    >
                      {activeChats[user].messages.map((msg) => (
                        <ChatMessage
                          key={msg.id}
                          msg={msg}
                          onSeen={(messageId, sender) =>
                            markMessageAsSeen(messageId, sender)
                          }
                        />
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </TabPane>
                ))}
              </TabContent>
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
