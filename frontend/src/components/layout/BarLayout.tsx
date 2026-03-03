import React from "react";
import Navbar from "./Navbar";

const BarLayout = ({ children, location }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar location={location} />
      <section className="pb-6">{children}</section>
    </div>
  );
};

export default BarLayout;
