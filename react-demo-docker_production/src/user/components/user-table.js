import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import UserForm from "./user-form";
import Table from "../../commons/tables/table";
import * as API_USERS from "../api/user-api";
// import {fetchUsers(), onDelete()} from "./user/user-container";

function UserTable(props) {
  const [error, setError] = useState({ status: 0, errorMessage: null });
  const [tableData, setTableData] = useState(props.tableData);

  const [isSelected, setIsSelected] = useState(false);
  // const [tableData, setTableData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  const handleDelete = (id) => {
    return API_USERS.deleteUser(id, (result, status, err) => {
      if (status === 204) {
        console.log("Successfully deleted user with id: " + id);
        // props.fetchUsers(); // Call the fetchUsers function from the props
        // props.onDelete(); // Step 4: Notify delete operation
        window.location.reload();
      } else {
        setError({ status: status, errorMessage: err });
      }
    });
  };
  const handleUpdate = (row) => {
    setUpdatedData(row);
    setIsUpdating(true);
  };

  function toggleForm() {
    setIsSelected((isSelected) => !isSelected);
  }
  function reload() {
    setIsLoaded(false);
    setIsDeleted(false); // Reset the delete operation flag
    toggleForm();
    // fetchUsers();
  }

  const columns = [
    {
      Header: "Id",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
    },

    {
      Header: "Password",
      accessor: "password",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Actions",
      accessor: "actions",
      Cell: (row) => (
        <div>
          <Button
            color="info"
            style={{ marginRight: "5px" }}
            onClick={() => {
              toggleForm();
              handleUpdate(row.original);
            }}
            // onClick={() => handleUpdate(row.original)}
          >
            Update
          </Button>
          <Button color="danger" onClick={() => handleDelete(row.original.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      accessor: "name",
    },
  ];

  return (
    <div>
      <Table
        data={props.tableData}
        columns={columns}
        search={filters}
        pageSize={5}
      />

      <Modal isOpen={isSelected} toggle={toggleForm} size="lg">
        <ModalHeader toggle={toggleForm}> Add User: </ModalHeader>
        <ModalBody>
          <UserForm
            reloadHandler={reload}
            updatedData={updatedData}
            isUpdating={isUpdating}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default UserTable;
