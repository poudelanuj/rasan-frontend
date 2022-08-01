import { Modal, Spin, Space, Button } from "antd";
import { ReactComponent as DeleteModal } from "../../../../assets/images/DeleteModal.svg";
import { useMutation } from "react-query";
import { deleteTutorials } from "../../../../api/tutorial";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";

const DeleteTutorialsModal = ({
  title,
  slugs,
  refetchTutorials,
  isDeleteTutorialsModalOpen,
  setIsDeleteTutorialsModalOpen,
}) => {
  const handleDeleteTutorial = useMutation(() => deleteTutorials(slugs), {
    onSuccess: (res) => {
      openSuccessNotification(res[0].data.message);
      refetchTutorials();
      setIsDeleteTutorialsModalOpen(false);
    },
    onError: (err) => openErrorNotification(err),
  });
  return (
    <Modal
      footer={false}
      title={"Delete Tutorials"}
      visible={isDeleteTutorialsModalOpen}
      onCancel={() => setIsDeleteTutorialsModalOpen(false)}
    >
      <div className="flex flex-col items-center">
        {handleDeleteTutorial.status === "loading" ? (
          <Spin className="my-4" size="large" />
        ) : (
          <DeleteModal />
        )}

        <h2 className="my-5 text-lg font-medium">{title}</h2>
        <div className=" text-center w-80 text-sm text-gray-500">
          This is a permanent action and cannot be undone. Are you sure you want
          to delete this order?
        </div>

        <Space className="mt-8">
          <Button
            disabled={handleDeleteTutorial.status === "loading"}
            onClick={() => setIsDeleteTutorialsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={handleDeleteTutorial.status === "loading"}
            type="primary"
            danger
            onClick={() => handleDeleteTutorial.mutate()}
          >
            Yes, Delete
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default DeleteTutorialsModal;
