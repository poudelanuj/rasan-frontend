import React from "react";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";

const UserGroup = ({ ug }) => {
  return (
    <div className="flex">
      <IoIosPeople />
      <div>{ug.name}</div>
      <Link to={"/user-group/" + ug.id}>edit</Link>
    </div>
  );
};

export default UserGroup;
