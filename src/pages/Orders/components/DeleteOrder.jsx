import { Button, Modal, Space, Spin } from "antd";
import { useMutation } from "react-query";
import { ReactComponent as DeleteModal } from "../../../assets/images/DeleteModal.svg";
import { deleteOrder } from "../../../context/OrdersContext";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";

const DeleteOrder = ({ title, orderId, isOpen, closeModal, refetchOrders }) => {
  const handleDeleteOrder = useMutation(() => deleteOrder(orderId), {
    onSuccess: (data) => {
      openSuccessNotification("Order Deleted");
      closeModal();
    },
    onSettled: () => {
      refetchOrders();
    },
    onError: (error) => {
      openErrorNotification(error);
    },
  });

  return (
    <Modal footer={false} title={title} visible={isOpen} onCancel={closeModal}>
      <div className="flex flex-col items-center">
        {handleDeleteOrder.status === "loading" ? (
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
          <Button
            disabled={handleDeleteOrder.status === "loading"}
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            disabled={handleDeleteOrder.status === "loading"}
            type="primary"
            danger
            onClick={() => handleDeleteOrder.mutate()}
          >
            Yes, Delete
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default DeleteOrder;
