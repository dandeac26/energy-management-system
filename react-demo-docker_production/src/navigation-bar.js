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
  const [activeTab, setActiveTab] = useState("0");
  const [activeChats, setActiveChats] = useState({}); // Stores active chats with users
  const [selectedChat, setSelectedChat] = useState("John"); // Stores the currently selected chat
  const userDataString = localStorage.getItem("authenticatedUser");
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const isAdmin =
    userData && Array.isArray(userData.roles) && userData.roles[0] === "ADMIN";

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  function isUserAuthenticated() {
    const userData = localStorage.getItem("authenticatedUser");
    return userData !== null;
  }

  // useEffect(() => {
  //   scrollToBottom();
  //   isUserAuthenticated();
  // }, [messages]);
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, []);

  const handleIncomingMessage = (message) => {
    const receivedMessage = JSON.parse(message.body);
    // Determine whether the message is incoming or outgoing
    const messageSender =
      receivedMessage.sender === userData.username
        ? receivedMessage.destination
        : receivedMessage.sender;

    setActiveChats((prevChats) => {
      const updatedChats = { ...prevChats };
      const chatMessages = updatedChats[messageSender] || { messages: [] };
      chatMessages.messages.push(receivedMessage);

      updatedChats[messageSender] = chatMessages;
      return updatedChats;
    });
  };

  const toggleModal = () => setModal(!modal);

  const connect = () => {
    // Mock connection to WebSocket
    const socket = new SockJS("http://localhost:8088/websocket-endpoint");
    const client = Stomp.over(socket);

    // client.connect({}, () => {

    //   client.subscribe("/topic/messages", (message) => {
    //     const receivedMessage = JSON.parse(message.body);

    //     // If the message is from the admin and this client is the admin, ignore it
    //     if (receivedMessage.sender === userData.username && isAdmin) {
    //       return;
    //     }

    //     setActiveChats((prevChats) => {
    //       const updatedChats = { ...prevChats };
    //       const chatKey = isAdmin ? receivedMessage.sender : "admin";

    //       const chatMessages = updatedChats[chatKey] || { messages: [] };
    //       chatMessages.messages.push(receivedMessage);

    //       updatedChats[chatKey] = chatMessages;
    //       return updatedChats;
    //     });

    //     // If there is no selected chat, set it to the sender of the first received message
    //     if (!selectedChat && receivedMessage.sender !== userData.username) {
    //       setSelectedChat(receivedMessage.sender);
    //     }
    //   });
    // });

    client.connect({}, () => {
      client.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        setActiveChats((prevChats) => {
          const updatedChats = { ...prevChats };
          const chatKey =
            receivedMessage.sender === userData.username
              ? receivedMessage.destination
              : receivedMessage.sender;
          if (!updatedChats[chatKey]) {
            updatedChats[chatKey] = { messages: [] };
          }
          updatedChats[chatKey].messages.push(receivedMessage);
          return updatedChats;
        });
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
        sender: userData.username,
        destination: isAdmin ? selectedChat : "admin", // Admin sends to selected user, client sends to admin
        text: currentMessage,
        seen: false,
        role: userData.roles[0],
      };
      stompClient.send("/app/send", {}, JSON.stringify(newMessage));
      setCurrentMessage("");
    }
  };
  // const handleSendMessage = () => {
  //   let userData = JSON.parse(localStorage.getItem("authenticatedUser"));
  //   // let destination = userData.roles[0] === "ADMIN" ? "user" : "admin";
  //   let isAdmin =
  //     userData &&
  //     Array.isArray(userData.roles) &&
  //     userData.roles[0] === "ADMIN";
  //   let destination = isAdmin ? selectedChat : "admin";

  //   console.log("Message destination:", destination);

  //   if (currentMessage.trim() && stompClient) {
  //     const newMessage = {
  //       sender: userData.username,
  //       destination: destination,
  //       text: currentMessage,
  //       seen: false,
  //       role: userData.roles[0],
  //     };
  //     // if (!isAdmin) {
  //     //   setActiveChats((prevChats) => {
  //     //     const updatedChats = { ...prevChats };
  //     //     // Assuming 'destination' holds the username of the client
  //     //     if (!updatedChats[destination]) {
  //     //       updatedChats[destination] = { messages: [] };
  //     //     }
  //     //     updatedChats[destination].messages.push(newMessage);
  //     //     return updatedChats;
  //     //   });
  //     // }
  //     // if (isAdmin) {
  //     //   setActiveChats((prevChats) => {
  //     //     const updatedChats = { ...prevChats };
  //     //     // Assuming 'destination' holds the username of the client
  //     //     if (!updatedChats[destination]) {
  //     //       updatedChats[destination] = { messages: [] };
  //     //     }
  //     //     updatedChats[destination].messages.push(newMessage);
  //     //     return updatedChats;
  //     //   });
  //     // }

  //     if (!isAdmin) {
  //       setActiveChats((prevChats) => {
  //         const updatedChats = { ...prevChats };
  //         const userChat = updatedChats["admin"] || { messages: [] };
  //         userChat.messages.push(newMessage);
  //         updatedChats["admin"] = userChat;
  //         return updatedChats;
  //       });
  //     }
  //     stompClient.send("/app/send", {}, JSON.stringify(newMessage));
  //     setCurrentMessage("");
  //   }
  // };

  // const handleIncomingMessage = (msg) => {
  //   setActiveChats((prevChats) => {
  //     const chat = prevChats[msg.sender] || { messages: [] };
  //     chat.messages.push(msg);
  //     return { ...prevChats, [msg.sender]: chat };
  //   });
  //   if (!activeTab) {
  //     setActiveTab(msg.sender);
  //   }
  // };

  const modalStyle = {
    maxWidth: "500px",
    height: "600px",
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
          {/* <Modal
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
          </Modal> */}
          <Modal
            isOpen={modal}
            toggle={toggleModal}
            onOpened={connect}
            onClosed={disconnect}
            style={modalStyle}
          >
            <ModalHeader toggle={toggleModal}>Chat</ModalHeader>
            <ModalBody key={selectedChat}>
              {isAdmin && (
                <Nav tabs>
                  {Object.keys(activeChats).map((user) => (
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
                  ))}
                </Nav>
              )}
              <TabContent activeTab={selectedChat}>
                {Object.keys(activeChats).map((user) => (
                  <TabPane tabId={user} key={user}>
                    <div
                      className="chat-messages"
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        height: "600px",
                      }}
                    >
                      {activeChats[user].messages.map((msg, index) => (
                        <div
                          key={index}
                          style={{
                            textAlign:
                              msg.sender === userData.username
                                ? "right"
                                : "left",
                          }}
                        >
                          <span
                            style={{
                              backgroundColor:
                                msg.sender === userData.username
                                  ? "#e0e0e0"
                                  : "#f0f0f0",
                              borderRadius: "10px",
                              padding: "10px 15px",
                              display: "inline-block",
                              maxWidth: "80%",
                              margin: "5px",
                            }}
                          >
                            {msg.text}
                          </span>
                        </div>
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
