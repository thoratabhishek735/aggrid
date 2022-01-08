import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { AgGridReact, AgGridColumn } from "@ag-grid-community/react";
import { ServerSideRowModelModule } from "@ag-grid-enterprise/server-side-row-model";
import '../../node_modules/@ag-grid-community/core/dist/styles/ag-grid.css';
import '../../node_modules/@ag-grid-community/core/dist/styles/ag-theme-alpine-dark.css';
// import grid from "./grid.css";

const Index = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [params, setParams] = useState(null);

  const fetchDataApi = (params) => {
    console.log("QUERY", params.request);
    fetch("/api/query/", {
      method: "post",
      body: JSON.stringify(params.request),
      headers: { "Content-Type": "application/json; charset=utf-8" },
    })
      .then((httpResponse) => httpResponse.json())
      .then((response) => {
        params.successCallback(response.rows, response.lastRow);
      })
      .catch((error) => {
        console.error(error);
        params.failCallback();
      });
  };

  function createServerSideDatasource() {
    return {
      getRows: async (params) => {
        console.log(
          "[Datasource] - rows requested by grid: startRow = " +
            params.request.startRow +
            ", endRow = " +
            params.request.endRow
        );
        var response = await fetchDataApi(params);
        setTimeout(function () {
          if (response && response.success) {
            params.success({ rowData: response.rows });
          } else {
            params.fail();
          }
        }, 1000);
      },
    };
  }

  useEffect(() => {
    console.log("grid changed");
    const fun = async () => {
      var datasource = await createServerSideDatasource();
      params.api.setServerSideDatasource(datasource);
    };
    fun();
  }, [gridApi]);

  const onGridReady = (params) => {
    setParams(params);
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div id="myGrid" className="ag-theme-alpine-dark">
        <AgGridReact
          modules={[
            ServerSideRowModelModule
          ]}
          defaultColDef={{
            flex: 3,
            minWidth: 100,
            resizable: true,
            sortable: true,
          }}
        //   autoGroupColumnDef={{
        //     flex: 1,
        //     minWidth: 200,
        //     field: "athlete",
        //   }}
          rowModelType={"serverSide"}
          onGridReady={onGridReady}
          serverSideStoreType={"partial"}
          suppressAggFuncInHeader={true}
          pagination={true}
          paginationPageSize={10}
          cacheBlockSize={10}
        >
          <AgGridColumn
            field="country"
            // colId="country"
            // valueGetter="data.country"
            // rowGroup={true}
            filter="agSetColumnFilter"
            filterParams={{
              values: [
                'United States',
                'Ireland',
                'United Kingdom',
                'Russia',
                'Australia',
                'Canada',
                'Norway',
              ],
            }}
            minWidth={200}
          />
          <AgGridColumn field="athlete" minWidth={220} filter="agTextColumnFilter" />

          <AgGridColumn field="year" filter="agNumberColumnFilter"  />
          <AgGridColumn field="sport" minWidth={200} />
          <AgGridColumn field="gold" />
          <AgGridColumn field="silver" />
          <AgGridColumn field="bronze" />
        </AgGridReact>
      </div>
    </div>
  );
};

export default Index;
