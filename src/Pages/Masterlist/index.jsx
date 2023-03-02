import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { useNavigate } from "react-router";

const Masterlist = () => {
  const navigate = useNavigate();

  return <Outlet />;
};

export default Masterlist;
