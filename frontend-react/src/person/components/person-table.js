import React from "react";

import Table from "../../commons/tables/table";

const columns = [
    {
        Header: 'Name',
        accessor: 'name',
    },
    {
        Header: 'Age',
        accessor: 'age',
    }
];

const filters = [
    {
        accessor: 'name',
    }
];

function PersonTable(props) {
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