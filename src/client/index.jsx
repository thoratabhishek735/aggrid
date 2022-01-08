import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [params, setParams] = useState(null);

  const fetchDataApi = async (params) => {
    return new Promise((resolve, reject) => {
      fetch("/api/query/", {
        method: "post",
        body: JSON.stringify(params.request),
        headers: { "Content-Type": "application/json; charset=utf-8" },
      })
        .then((httpResponse) => httpResponse.json())
        .then((response) => {
          params.successCallback(response.rows, response.lastRow);

          resolve({
            success: true,
            rows: response.rows,
            lastRow: response.lastRow,
          });
        })
        .catch((error) => {
          console.error("response error", error);
        });
    });
  };

  function createServerSideDatasource() {
    return {
      getRows: async (params) => {
        const response = await fetchDataApi(params);

        setTimeout(() => {
          if (response && response.success) {
            params.success({
              rowData: response.rows,
              rowsCount: response.lastRow,
            });
          } else {
            params.fail();
          }
        }, 1500);
      },
    };
  }

  useEffect(() => {
    const func = async () => {
      var datasource = await createServerSideDatasource();
      gridApi.setServerSideDatasource(datasource);
    };
    if (params) {
      func();
    }
  }, [gridApi]);

  const onGridReady = (params) => {
    console.log("grid,", params);
    setParams(params);
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div
        id="myGrid"
        style={{
          height: "100%",
          width: "100%",
        }}
        className="ag-theme-alpine-dark"
      >
        <AgGridReact
          defaultColDef={{
            flex: 3,
            minWidth: 100,
            resizable: true,
            sortable: true,
          }}
          autoGroupColumnDef={{
            flex: 1,
            minWidth: 200,
            field: "athlete",
          }}
          rowModelType={"serverSide"}
          onGridReady={onGridReady}
          serverSideStoreType={"partial"}
          suppressAggFuncInHeader={true}
          pagination={true}
          paginationPageSize={20}
        >
          <AgGridColumn
            field="country"
            colId="country"
            valueGetter="data.country"
            rowGroup={true}
            filter="agSetColumnFilter"
            filterParams={{
              values: [
                "United States",
                "Ireland",
                "United Kingdom",
                "Russia",
                "Australia",
                "Canada",
                "Norway",
              ],
            }}
            minWidth={200}
          />
          <AgGridColumn
            field="athlete"
            minWidth={220}
            filter="agTextColumnFilter"
          />

          <AgGridColumn field="year" filter="agNumberColumnFilter" />
          <AgGridColumn field="sport" minWidth={200} />
          <AgGridColumn field="gold" aggFunc="sum" />
          <AgGridColumn field="silver" aggFunc="sum" />
          <AgGridColumn field="bronze" aggFunc="sum" />
        </AgGridReact>
      </div>
    </div>
  );
};

render(<GridExample></GridExample>, document.querySelector("#root"));
