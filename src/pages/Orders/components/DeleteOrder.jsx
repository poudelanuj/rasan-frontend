import { Button, Modal, Space, Spin } from "antd";
import { useMutation } from "react-query";
import { updateOrderStatus } from "../../../context/OrdersContext";
import { ReactComponent as DeleteModal } from "../../../assets/images/DeleteModal.svg";
import { openSuccessNotification, openErrorNotification } from "../../../utils";

const DeleteOrder = ({ title, isArchiveOrder, refetchOrders, closeModal }) => {
  const handleArchiveOrder = useMutation(
    () =>
      updateOrderStatus({
        orderId: isArchiveOrder.id,
        status: "archive",
      }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchOrders();
      },

      onError: (error) => {
        openErrorNotification(error);
      },
    }
  );

  return (
    <Modal
      footer={false}
      title={title}
      visible={isArchiveOrder.isOpen}
      onCancel={closeModal}
    >
      <div className="flex flex-col items-center">
        {handleArchiveOrder.status === "loading" ? (
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
            disabled={handleArchiveOrder.status === "loading"}
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button
            disabled={handleArchiveOrder.status === "loading"}
            type="primary"
            danger
            onClick={() => handleArchiveOrder.mutate()}
          >
            Yes, Archive
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default DeleteOrder;
