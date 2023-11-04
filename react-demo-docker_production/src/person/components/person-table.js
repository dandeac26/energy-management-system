import React, { useState } from "react";
import Table from "../../commons/tables/table";
import * as API_USERS from "../api/person-api";
// import {fetchPersons(), onDelete()} from "./person/person-container";

function PersonTable(props) {
  const [error, setError] = useState({ status: 0, errorMessage: null });
  const [tableData, setTableData] = useState(props.tableData);
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
          <button onClick={() => handleUpdate(row.original)}>Update</button>
          <button onClick={() => handleDelete(row.original.id)}>Delete</button>
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
    <Table
      data={props.tableData}
      columns={columns}
      search={filters}
      pageSize={5}
    />
  );
}

export default PersonTable;
