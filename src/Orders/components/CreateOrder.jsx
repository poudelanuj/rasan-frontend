import { Modal } from "antd";

const CreateOrder = ({ isOpen, closeModal, title }) => {
  return (
    <Modal title={title} visible={isOpen} onCancel={closeModal}>
      Create Order Content
    </Modal>
  );
};

export default CreateOrder;
