import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import UserForm from "./components/user-form";
import * as API_USERS from "./api/user-api";
import UserTable from "./components/user-table";

function UserContainer(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  function handleDeleteCallback() {
    setIsDeleted(true); // Step 2: Notify delete operation
  }
  // Store error status and message in the same object because we don't want
  // to render the component twice (using setError and setErrorStatus)
  // This approach can be used for linked state variables.
  const [error, setError] = useState({ status: 0, errorMessage: null });

  // componentDidMount
  useEffect(() => {
    fetchUsers();
  }, []);

  function fetchUsers() {
    return API_USERS.getUsers((result, status, err) => {
      if (result !== null && status === 200) {
        setTableData((tableData) => result);
        setIsLoaded((isLoaded) => true);
      } else {
        setError((error) => ({ status: status, errorMessage: err }));
      }
    });
  }

  function toggleForm() {
    setIsSelected((isSelected) => !isSelected);
  }

  function reload() {
    setIsLoaded(false);
    setIsDeleted(false); // Reset the delete operation flag
    toggleForm();
    fetchUsers();
  }

  return (
    <div>
      <CardHeader>
        <strong> User Management </strong>
      </CardHeader>
      <Card>
        <br />
        <Row>
          <Col sm={{ size: "8", offset: 1 }}>
            <Button color="primary" onClick={toggleForm}>
              Add User{" "}
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={{ size: "8", offset: 1 }}>
            {isLoaded && (
              <UserTable
                tableData={tableData}
                onDelete={handleDeleteCallback}
              /> // Step 3: Pass the callback function
            )}
            {error.status > 0 && (
              <APIResponseErrorMessage
                errorStatus={error.status}
                error={error.errorMessage}
              />
            )}
          </Col>
        </Row>
      </Card>

      <Modal isOpen={isSelected} toggle={toggleForm} size="lg">
        <ModalHeader toggle={toggleForm}> Add User: </ModalHeader>
        <ModalBody>
          <UserForm reloadHandler={reload} />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default UserContainer;
