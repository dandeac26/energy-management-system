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
      // role: "client",
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const user = {
      name: this.state.name,
      password: this.state.password,
      // role: this.state.role,
    };

    const callback = (json, status, err) => {
      if (err) {
        console.error("An error occurred:", err);
      } else {
        console.log("Received JSON:", json);

        if (json) {
          // Check if 'json' is defined
          if (status === 200) {
            // Authentication successful
            console.log("success log");
            localStorage.setItem("authenticatedUser", JSON.stringify(json));
            this.props.history.push("/profile");
          } else if (status === 401) {
            // Authentication failed, handle the 401 Unauthorized error
            console.error("Authentication failed: Unauthorized");
            // You can set an error message in the state and display it on the login form
          } else {
            // Handle other status codes or scenarios
            console.error("Authentication failed with status: " + json.status);
          }
        } else {
          console.error("Response JSON is undefined");
        }
      }
    };

    try {
      const response = await API_USERS.authenticateUser(user, callback);
      // console.log(response.json);
      // No need to check response.status here
    } catch (error) {
      console.error("An error occurred while authenticating:", error);
    }
  };
  render() {
    const loginFormStyle = {
      marginTop: "50px", // Add margin to the top of the login form
    };
    return (
      <Container style={loginFormStyle}>
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
