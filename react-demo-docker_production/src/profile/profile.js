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

function Profile(props) {
  const [isSelected, setIsSelected] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  const [error, setError] = useState({ status: 0, errorMessage: null });

  useEffect(() => {
    fetchDevices();
  }, []);

  function fetchDevices() {
    const authenticatedUser = JSON.parse(
      localStorage.getItem("authenticatedUser")
    );

    if (authenticatedUser) {
      const userId = authenticatedUser.id;

      return API_DEVICES.getUserDevices(userId, (result, status, err) => {
        if (result !== null && status === 200) {
          setTableData((tableData) => result);
          setIsLoaded((isLoaded) => true);
        } else {
          setError((error) => ({ status: status, errorMessage: err }));
        }
      });
    } else {
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
    setIsDeleted(true);
  }

  return (
    <div>
      <CardHeader>
        <strong> YOUR PROFILE! </strong>
      </CardHeader>
    </div>
  );
}

export default Profile;
