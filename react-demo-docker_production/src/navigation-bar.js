import React from "react";
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
} from "reactstrap";

import logo from "./commons/images/icon.png";

const textStyle = {
  color: "white",
  textDecoration: "none",
};

function NavigationBar() {
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
          <Button href="/login">Login</Button>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavigationBar;
