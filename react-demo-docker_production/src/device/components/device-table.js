import React from "react";

import Table from "../../commons/tables/table";

const columns = [
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "HourlyMaxConsumption",
    accessor: "hourlyMaxConsumption",
  },
];

const filters = [
  {
    accessor: "description",
  },
];

function DeviceTable(props) {
  return (
    <Table
      data={props.tableData}
      columns={columns}
      search={filters}
      pageSize={5}
    />
  );
}

export default DeviceTable;
