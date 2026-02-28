import React from "react";
import Appbar from "./Appbar";
import Navbar from "./Navbar";

const BarLayout = ({ children, location }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar location={location} />
      <section className="pb-24">{children}</section>
      <Appbar />
    </div>
  );
};

export default BarLayout;
