import React from "react";
import Table from "./Table";

function Pagination({ data }) {
  return <Table currentPost={data} />;
}

export default Pagination;
