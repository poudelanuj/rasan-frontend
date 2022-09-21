const UserInfo = ({ user }) => {
  return (
    <>{user?.full_name ? `${user.full_name} (${user?.phone})` : user?.phone}</>
  );
};

export default UserInfo;
