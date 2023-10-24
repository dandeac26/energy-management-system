let jsonStyles = require('./fields/styles/json-styles');

function getColumns(data) {
    return data.map(c => {
        return ({
            Header: c.header,
            accessor: c.accessor,
            getHeaderProps: () => {
                return {
                    style: jsonStyles.tableHeaderColors
                }
            },
            getProps: () => {
                return {
                    style: jsonStyles.tableBodyColors
                }
            }
        })
    })
}

export {
    getColumns,
}
