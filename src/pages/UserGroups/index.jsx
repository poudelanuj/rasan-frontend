import { useMutation, useQuery } from "react-query";
import { useState } from "react";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { IoIosPeople } from "react-icons/io";
import { deleteUserGroup, getUserGroups } from "../../api/userGroups";
import { GET_USER_GROUPS } from "../../constants/queryKeys";
import Loader from "../../shared/Loader";
import CustomPageHeader from "../../shared/PageHeader";
import CreateUserGroupModal from "./components/CreateUserGroupModal";
import { openErrorNotification, openSuccessNotification } from "../../utils";
import ConfirmDelete from "../../shared/ConfirmDelete";
import ButtonWPermission from "../../shared/ButtonWPermission";

const UserGroups = () => {
  const navigate = useNavigate();

  const [isCreateUserGroupModal, setIsCreateUserGroupModal] = useState(false);

  const [isDeleteUserGroupModal, setIsDeleteUserGroupModal] = useState({
    isOpen: false,
    id: null,
  });

  const {
    data: userGroup,
    isFetching,
    refetch: refetchUserGroup,
  } = useQuery({
    queryFn: () => getUserGroups(),
    queryKey: [GET_USER_GROUPS],
  });

  const handleDeleteUserGroup = useMutation((id) => deleteUserGroup(id), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      setIsDeleteUserGroupModal({
        ...isDeleteUserGroupModal,
        isOpen: false,
        id: null,
      });
      refetchUserGroup();
    },
    onError: (err) => openErrorNotification(err),
  });

  return (
    <>
      <CustomPageHeader title="User Groups" isBasicHeader />

      <div className="p-6 rounded-lg bg-[#FFFFFF]">
        <ButtonWPermission
          className="mb-6"
          codename="add_group"
          type="primary"
          ghost
          onClick={() => setIsCreateUserGroupModal(true)}
        >
          Create User Group
        </ButtonWPermission>

        {isFetching ? (
          <Loader isOpen={true} />
        ) : (
          <div className="w-full grid grid-cols-4 gap-4">
            {userGroup &&
              userGroup.map(({ name, id }) => (
                <div
                  key={id}
                  className="p-4 border flex items-center justify-between text-primary cursor-pointer"
                >
                  <div
                    className="flex items-center"
                    onClick={() => navigate(`${id}`)}
                  >
                    <IoIosPeople className="inline mr-3 text-3xl" />
                    {name}
                  </div>

                  <ButtonWPermission
                    className="!border-none !bg-inherit"
                    codename="delete_group"
                    disabled={name === "superadmin"}
                    icon={<DeleteOutlined />}
                    onClick={() =>
                      setIsDeleteUserGroupModal({
                        ...isDeleteUserGroupModal,
                        isOpen: true,
                        id,
                      })
                    }
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      <CreateUserGroupModal
        isOpen={isCreateUserGroupModal}
        userGroup={userGroup}
        onClose={() => setIsCreateUserGroupModal(false)}
      />

      <ConfirmDelete
        closeModal={() =>
          setIsDeleteUserGroupModal({
            ...isDeleteUserGroupModal,
            isOpen: false,
          })
        }
        deleteMutation={() =>
          handleDeleteUserGroup.mutate(isDeleteUserGroupModal.id)
        }
        isOpen={isDeleteUserGroupModal.isOpen}
        status={handleDeleteUserGroup.status}
        title={"Delete User Group?"}
      />
    </>
  );
};

export default UserGroups;
