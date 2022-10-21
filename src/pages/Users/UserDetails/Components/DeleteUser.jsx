import { Button, message, Modal, Space, Spin } from "antd";
import { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { ReactComponent as DeleteModal } from "../../../../assets/images/DeleteModal.svg";
import { deleteUser } from "../../../../context/UserContext";

const DeleteUser = ({ title, phone }) => {
  let navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: deleteUserMutation, isLoading } = useMutation(deleteUser, {
    onSuccess: (data) => {
      setIsOpen(false);
      navigate("/users");
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  return (
    <>
      <Button
        className="ml-auto w-2/12"
        type="primary"
        danger
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Delete User
      </Button>
      <Modal
        footer={false}
        title={title}
        visible={isOpen}
        onCancel={() => {
          setIsOpen(false);
        }}
      >
        <div className="flex flex-col items-center">
          {isLoading ? <Spin className="my-4" size="large" /> : <DeleteModal />}

          <h2 className="my-5 text-lg font-medium">Delete User</h2>
          <div className=" text-center w-80 text-sm text-gray-500">
            This is a permanent action and cannot be undone. Are you sure you
            want to delete this user?
          </div>

          <Space className="mt-8">
            <Button
              disabled={isLoading}
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              type="primary"
              danger
              onClick={() => deleteUserMutation({ phone: phone })}
            >
              Yes, Delete
            </Button>
          </Space>
        </div>
      </Modal>
    </>
  );
};

export default DeleteUser;
