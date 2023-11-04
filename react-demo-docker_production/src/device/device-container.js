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
import DeviceForm from "./components/device-form";
import * as API_USERS from "./api/device-api";
import DeviceTable from "./components/device-table";

function DeviceContainer(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Store error status and message in the same object because we don't want
  // to render the component twice (using setError and setErrorStatus)
  // This approach can be used for linked state variables.
  const [error, setError] = useState({ status: 0, errorMessage: null });

  // componentDidMount
  useEffect(() => {
    fetchDevices();
  }, []);

  function fetchDevices() {
    return API_USERS.getDevices((result, status, err) => {
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
    setIsLoaded((isLoaded) => false);

    toggleForm();
    fetchDevices();
  }

  return (
    <div>
      <CardHeader>
        <strong> Device Management </strong>
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
            {isLoaded && <DeviceTable tableData={tableData} />}
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

export default DeviceContainer;
