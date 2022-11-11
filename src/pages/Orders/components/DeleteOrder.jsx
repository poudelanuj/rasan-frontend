import { Button, Modal, Space, Spin } from "antd";
import { ReactComponent as DeleteModal } from "../../../assets/images/DeleteModal.svg";

const DeleteOrder = ({ title, isOpen, deleteMutation, status, closeModal }) => {
  return (
    <Modal footer={false} title={title} visible={isOpen} onCancel={closeModal}>
      <div className="flex flex-col items-center">
        {status === "loading" ? (
          <Spin className="my-4" size="large" />
        ) : (
          <DeleteModal />
        )}

        <h2 className="my-5 text-lg font-medium">Archive Order</h2>
        <div className=" text-center w-80 text-sm text-gray-500">
          This is a permanent action and cannot be undone. Are you sure you want
          to archive this order?
        </div>

        <Space className="mt-8">
          <Button disabled={status === "loading"} onClick={closeModal}>
            Cancel
          </Button>
          <Button
            disabled={status === "loading"}
            type="primary"
            danger
            onClick={() => deleteMutation()}
          >
            Yes, Archive
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default DeleteOrder;
