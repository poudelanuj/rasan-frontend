const UserInfo = ({ user }) => {
  return <>{user?.full_name || "-"}</>;
};

export default UserInfo;
