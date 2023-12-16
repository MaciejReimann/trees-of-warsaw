import * as React from "react";
import axios from "axios";

export const App = () => {
  const [data, setData] = React.useState<any>(undefined);

  React.useEffect(() => {
    const fetchData = async () => {
      const baseURL = "http://localhost:8088";
      const url = `${baseURL}/api/3/action/datastore_search/?resource_id=ed6217dd-c8d0-4f7b-8bed-3b7eb81a95ba`;

      const limit = 10000;
      const urlWithLimit = `${url}&limit=${limit}`;

      const res = await axios({
        method: "get",
        url: urlWithLimit,
      });

      console.log("res", res.data);

      const records = res.data.result.records;
      setData(records);
    };
    fetchData();
  }, []);

  console.log("data", data);

  return <>Trees of Warsaw</>;
};
