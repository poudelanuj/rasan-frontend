import React from "react";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";

const UserGroup = ({ ug }) => {
  return (
    <div className="flex w-1/3 items-center border p-3 mt-3 text-primary justify-between">
      <div>
        <span className="text-3xl text-gray-500">
          <IoIosPeople className="inline mr-3" />
        </span>
        {ug.name}
      </div>
      <Link to={"/user-group/" + ug.id}>edit</Link>
    </div>
  );
};

export default UserGroup;
