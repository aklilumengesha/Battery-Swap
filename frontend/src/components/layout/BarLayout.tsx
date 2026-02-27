import React from "react";
import Appbar from "./Appbar";
import Navbar from "./Navbar";

const BarLayout = ({ children, location }) => {
  return (
    <div>
      <Navbar location={location} />
      <section>{children}</section>
      <div className="h-[80px]"></div>
      <Appbar />
    </div>
  );
};

export default BarLayout;
