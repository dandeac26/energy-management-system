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

  function sendSeenMessages(user) {
    console.log("ENTERED");
    if (stompClient) {
      console.log("the seen msg sent!");
      const newMessage = {
        id: uuidv4(),
        sender: userData.username,
        destination: user, // Admin sends to selected user, client sends to admin
        text: "seen",
        seen: true,
        role: userData.roles[0],
      };
      stompClient.send("/app/send", {}, JSON.stringify(newMessage));
      setCurrentMessage("");
    }
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
    modalRef.current = !modal; // Update the ref's current value whenever modal changes
  };

  const connect = () => {
    // Mock connection to WebSocket
    const socket = new SockJS("http://localhost:8088/websocket-endpoint");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      client.subscribe("/topic/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log(
          "username: " +
            userData.username +
            "\n dest: " +
            receivedMessage.destination +
            "\n modal: " +
            modalRef.current +
            "\n selectedChat: " +
            selectedChat +
            "\n sender: " +
            receivedMessage.sender +
            "\n msg: " +
            receivedMessage.text
        );
        if (
          receivedMessage.destination === userData.username &&
          modalRef.current &&
          (selectedChat === receivedMessage.sender ||
            userData.roles[0] === "CLIENT") &&
          receivedMessage.seen === false
        ) {
          sendSeenMessages(receivedMessage.sender);
          console.log("ENTERED SEND");
        }
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

            // Check if the message already exists based on a unique identifier
            const messageExists = updatedChats[chatKey].messages.some(
              (msg) => msg.id === receivedMessage.id // Assuming each message has a unique 'id'
            );

            if (!messageExists) {
              if (receivedMessage.seen === true) {
                // alert("seen");
              }
              updatedChats[chatKey].messages.push(receivedMessage);
              console.log("NEW MESSAGE ADDED: ", receivedMessage);
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
        destination: isAdmin ? selectedChat : "admin", // Admin sends to selected user, client sends to admin
        text: currentMessage,
        seen: false,
        role: userData.roles[0],
      };
      stompClient.send("/app/send", {}, JSON.stringify(newMessage));
      setCurrentMessage("");
    }
  };

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
          <Modal
            isOpen={modal}
            toggle={toggleModal}
            onOpened={connect}
            onClosed={disconnect}
            style={modalStyle}
          >
            <ModalHeader toggle={toggleModal}>Chat</ModalHeader>
            <ModalBody key={selectedChat}>
              {/*{isAdmin && (*/}
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
                        sendSeenMessages(user);
                      }}
                    >
                      Chat with {user}
                    </NavLink>
                  </NavItem>
                ))}
              </Nav>
              {/* )}  */}
              <TabContent activeTab={selectedChat}>
                {Object.keys(activeChats).map((user) => (
                  <TabPane tabId={user} key={user}>
                    <div
                      className="chat-messages"
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        height: "600px",
                        marginBottom: "30px",
                        paddingBottom: "10px",
                        paddingTop: "10px",
                      }}
                    >
                      {activeChats[user].messages.map((msg, index) => (
                        <div
                          key={index}
                          style={{
                            textAlign:
                              msg.sender === userData.username ||
                              msg.seen === true
                                ? "right"
                                : "left",
                          }}
                        >
                          {msg.seen === false && (
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
                          )}
                        </div>
                      ))}
                      {activeChats[user].messages.map((msg, index) => (
                        <div
                          key={index}
                          style={{
                            textAlign: "right",
                            display: "block",
                          }}
                        >
                          <p
                            style={{
                              backgroundColor: "#FFFFFF",
                              borderRadius: "1px",
                              padding: "0px",
                              display: "block",
                              maxWidth: "80%",
                              margin: "0px",
                              marginRight: "30px",
                              textAlign: "right",
                              position: "absolute",
                              bottom: "100px",
                              right: "5px",
                              color:
                                msg.seen === true && msg.sender === user
                                  ? "lightblue"
                                  : "white",
                            }}
                          >
                            {" "}
                            seen{" "}
                          </p>
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
