const UserInfo = ({ user }) => {
  return (
    <>
      {user?.full_name} {user?.phone}
    </>
  );
};

export default UserInfo;
