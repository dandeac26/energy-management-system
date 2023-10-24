import React, { useState, useEffect, useReducer } from "react";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { Col, Row } from "react-bootstrap";

import Field from "./fields/Field";

function Table(props) {
    const [data, setData] = useState(props.data);
    const [columns, setColumns] = useState(props.columns);
    const [search, setSearch] = useState(props.search);
    const [filters, setFilters] = useState([]);
    const [pageSize, setPageSize] = useState(props.pageSize || 10);

    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    function filter(data) {
        let accepted = true;

        filters.forEach(val => {
            if (String(val.value) === "") {
                accepted = true;
            }

            if (!String(data[val.accessor]).includes(String(val.value)) && !String(val.value).includes(String(data[val.accessor]))) {
                accepted = false;
            }
        });

        return accepted;
    }

    function handleChange(value, index, header) {
        if (filters === undefined) {
            setFilters((filters) => ([]));
        }
        let keep = value.target.value;

        setFilters((filters) => {
            let newFilters = JSON.parse(JSON.stringify(filters));

            newFilters[index] = {
                value: keep,
                accessor: header
            };

            return newFilters;
        });

    }

    function getTRPropsType(state, rowInfo) {
        if (rowInfo) {
            return {
                style: {
                    textAlign: "center"
                }
            };
        }
        else
            return {};
    }

    return (
        <div>
            <Row>
                {
                    search.map((header, index) => {
                        return (
                            <Col key={index}>
                                <div >
                                    <Field id={header.accessor} label={header.accessor}
                                        onChange={(e) => handleChange(e, index, header.accessor)} />
                                </div>
                            </Col>
                        )
                    })
                }
            </Row>
            <Row>
                <Col>
                    <ReactTable
                        data={data ? data.filter(data => filter(data)) : []}
                        resolveData={data => data.map(row => row)}
                        columns={columns}
                        defaultPageSize={pageSize}
                        getTrProps={getTRPropsType}
                        showPagination={true}
                        style={{
                            height: '300px'
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
}

export default Table;
