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
import * as API_DEVICES from "../device/api/device-api";
import DeviceTable from "../device/components/device-table";
import APIResponseErrorMessage from "../commons/errorhandling/api-response-error-message";
import DeviceForm from "../device/components/device-form";

// function ProfileContainer(props){
// const [tableData, setTableData] = useState([]);
// const [isLoaded, setIsLoaded] = useState(false);

// useEffect(() => {
//   fetchDevices();
// }, []);

// function fetchDevices() {
//   return API_USERS.getDevices((result, status, err) => {
//     if (result !== null && status === 200) {
//       setTableData((tableData) => result);
//       setIsLoaded((isLoaded) => true);
//     } else {
//       setError((error) => ({ status: status, errorMessage: err }));
//     }
//   });
// }

// render() {
//   return (
//     <div>
//       <h2>Your Devices</h2>
//       <DeviceTable tableData={tableData} />{" "}
//       {/* Render the DeviceTable component with device data */}
//     </div>
//   );
// }

function Profile(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  // Store error status and message in the same object because we don't want
  // to render the component twice (using setError and setErrorStatus)
  // This approach can be used for linked state variables.
  const [error, setError] = useState({ status: 0, errorMessage: null });

  // componentDidMount
  useEffect(() => {
    fetchDevices();
  }, []);

  function fetchDevices() {
    // Get the authenticated user's information from localStorage
    const authenticatedUser = JSON.parse(
      localStorage.getItem("authenticatedUser")
    );

    if (authenticatedUser) {
      const userId = authenticatedUser.id; // Adjust the field name as per your data structure

      return API_DEVICES.getUserDevices(userId, (result, status, err) => {
        if (result !== null && status === 200) {
          setTableData((tableData) => result);
          setIsLoaded((isLoaded) => true);
        } else {
          setError((error) => ({ status: status, errorMessage: err }));
        }
      });
    } else {
      // Handle the case where the authenticated user data is not available in localStorage
      // You might want to handle this situation with an error or a redirection to the login page
    }
  }

  function toggleForm() {
    setIsSelected((isSelected) => !isSelected);
  }

  function reload() {
    setIsLoaded((isLoaded) => false);

    toggleForm();
    fetchDevices();
  }

  function handleDeleteCallback() {
    setIsDeleted(true); // Step 2: Notify delete operation
  }

  return (
    <div>
      <CardHeader>
        <strong> Your Devices </strong>
      </CardHeader>
      <Card>
        <br />
        <Row>
          <Col sm={{ size: "8", offset: 1 }}>
            <Button color="primary" onClick={toggleForm}>
              Add Device{" "}
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col sm={{ size: "8", offset: 1 }}>
            {isLoaded && (
              <DeviceTable
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
        <ModalHeader toggle={toggleForm}> Add Device: </ModalHeader>
        <ModalBody>
          <DeviceForm reloadHandler={reload} />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default Profile;
