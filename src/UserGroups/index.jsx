import { Button } from "antd";
import { useQuery } from "react-query";
import { getUserGroup } from "../context/UserGroupContext";
import UserGroup from "./UserGroup";
const UserGroups = () => {
  const { data: userGroups, isSuccess } = useQuery(
    "get-user-groups",
    getUserGroup
  );
  return (
    <>
      <div className="text-3xl bg-white mb-3 p-5">User Groups</div>
      <div className="bg-white p-5">
        <Button className="text-primary border-primary" type="primary">
          Create new user group
        </Button>
        {isSuccess &&
          userGroups.map((userGroup) => (
            <UserGroup key={userGroup.id} ug={userGroup} />
          ))}
      </div>
    </>
  );
};

export default UserGroups;
