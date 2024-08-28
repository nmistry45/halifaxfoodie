import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { Toolbar } from "@material-ui/core";
import RestaurantIcon from "@mui/icons-material/Restaurant";

function Visualization() {
  return (
    <>
      <Toolbar style={{ color: "white", background: "#0b93f6" }}>
        {window.localStorage.getItem("name")}
        <RestaurantIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
      </Toolbar>

      <div className="App" style={{ padding: "20px" }}>
        <iframe
          width="600"
          height="450"
          src="https://datastudio.google.com/embed/reporting/4dd5c119-8476-4928-9918-847c90060762/page/Ks38C"
          allowFullScreen
        ></iframe>
      </div>
    </>
  );
}

export default Visualization;
