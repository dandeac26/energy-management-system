import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import PersonForm from "./person-form";
import Table from "../../commons/tables/table";
import * as API_USERS from "../api/person-api";
// import {fetchPersons(), onDelete()} from "./person/person-container";

function PersonTable(props) {
  const [error, setError] = useState({ status: 0, errorMessage: null });
  const [tableData, setTableData] = useState(props.tableData);

  const [isSelected, setIsSelected] = useState(false);
  // const [tableData, setTableData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isDeleted, setIsDeleted] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedData, setUpdatedData] = useState({});

  const handleDelete = (id) => {
    return API_USERS.deletePerson(id, (result, status, err) => {
      if (status === 204) {
        console.log("Successfully deleted person with id: " + id);
        // props.fetchPersons(); // Call the fetchPersons function from the props
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
    // fetchPersons();
  }
  //   const handleUpdateSubmit = async (updatedRow) => {
  //     try {
  //       const response = await API_USERS.updatePerson(updatedRow); // Send a PUT request to update the data
  //       if (response.status === 200) {
  //         // Handle a successful update response
  //         console.log("Successfully updated person with id: " + updatedRow.id);
  //         fetchUpdatedData(); // Fetch the updated data
  //         setIsUpdating(false); // Close the form or modal
  //       } else {
  //         setError({ status: response.status, errorMessage: response.data.errorMessage });
  //       }
  //     } catch (error) {
  //       setError({ status: 500, errorMessage: "Error updating data" });
  //     }
  //   };
  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Age",
      accessor: "age",
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
        <ModalHeader toggle={toggleForm}> Add Person: </ModalHeader>
        <ModalBody>
          <PersonForm
            reloadHandler={reload}
            updatedData={updatedData}
            isUpdating={isUpdating}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

export default PersonTable;
