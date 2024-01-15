import React, { Component } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import * as API_USERS from "../user/api/user-api.js";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      password: "",
      showModal: false,
      modalMessage: "",
      isErrorMessage: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      username: this.state.name,
      password: this.state.password,
    };

    const callback = (json, status, err) => {
      if (err) {
        console.error("An error occurred:", err);
        let errorMessage = "An error occurred. Please try again.";

        try {
          const errorJson = JSON.parse(err);
          errorMessage = errorJson.message || errorMessage;
        } catch (parseError) {
          errorMessage = err.toString();
        }

        this.setState({
          showModal: true,
          isErrorMessage: true,
          modalMessage: "Username or password are incorrect!",
        });
      } else {
        console.log("Received JSON:", json);

        if (json) {
          if (status === 200) {
            // Authentication successful
            console.log("success log");
            localStorage.setItem("authenticatedUser", JSON.stringify(json));
            this.setState({
              showModal: true,
              isErrorMessage: false,
              modalMessage: "Login successful! Redirecting...",
            });
            setTimeout(() => {
              this.props.navigate("/device");
            }, 2000);
          } else if (status === 401) {
            // Authentication failed, handle the 401 Unauthorized error
            console.error("Authentication failed: Unauthorized");
            this.setState({
              showModal: true,
              isErrorMessage: true,
              modalMessage: "Login failed. Please try again.",
            });
          } else {
            // Handle other status codes
            console.error("Authentication failed with status: " + json.status);
            this.setState({
              showModal: true,
              isErrorMessage: true,
              modalMessage: "Authentication failed. Please try again.",
            });
          }
        } else {
          console.error("Response JSON is undefined");
          this.setState({
            showModal: true,
            isErrorMessage: true,
            modalMessage: "Login failed. Please try again.",
          });
        }
      }
    };

    try {
      const response = await API_USERS.authenticateUser(user, callback);
      // No need to check response.status here
    } catch (error) {
      console.error("An error occurred while authenticating:", error);
    }
  };

  renderModal() {
    if (!this.state.showModal) return null;

    const modalStyle = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: this.state.isErrorMessage ? "#F74F4F" : "lightgreen",
      padding: "20px",
      zIndex: 1000,
    };

    return (
      <div style={modalStyle}>
        <p>{this.state.modalMessage}</p>
      </div>
    );
  }

  render() {
    const loginFormStyle = {
      marginTop: "50px",
    };
    return (
      <Container style={loginFormStyle}>
        {this.renderModal()}
        <Row>
          <Col sm="12" md={{ size: 6, offset: 3 }}>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your password"
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <Button
                color="primary"
                type="submit"
                style={{ marginRight: "10px" }}
              >
                Login
              </Button>
              <Button color="secondary">Register</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;
