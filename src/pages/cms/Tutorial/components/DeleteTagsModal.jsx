import { Modal, Spin, Space, Button } from "antd";
import { ReactComponent as DeleteModal } from "../../../../assets/images/DeleteModal.svg";
import { useMutation } from "react-query";
import { deleteTutorialTags } from "../../../../api/tutorial";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";

const DeleteTagsModal = ({
  title,
  ids,
  isDeleteTagsModalOpen,
  setIsDeleteTagsModalOpen,
  refetchTags,
}) => {
  const handleDeleteTutorialTags = useMutation(() => deleteTutorialTags(ids), {
    onSuccess: (res) => {
      openSuccessNotification(res[0].data.message);
      refetchTags();
      setIsDeleteTagsModalOpen(false);
    },
    onError: (err) => openErrorNotification(err),
  });
  return (
    <Modal
      footer={false}
      title={"Delete Tags"}
      visible={isDeleteTagsModalOpen}
      onCancel={() => setIsDeleteTagsModalOpen(false)}
    >
      <div className="flex flex-col items-center">
        {handleDeleteTutorialTags.status === "loading" ? (
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
            disabled={handleDeleteTutorialTags.status === "loading"}
            onClick={() => setIsDeleteTagsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={handleDeleteTutorialTags.status === "loading"}
            type="primary"
            danger
            onClick={() => handleDeleteTutorialTags.mutate()}
          >
            Yes, Delete
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default DeleteTagsModal;
