import { Modal, Spin } from "antd";

const Loader = ({ isOpen }) => {
  return (
    <Modal
      bodyStyle={{
        display: "flex",
        justifyContent: "center",
      }}
      className="p-8"
      closable={false}
      footer={false}
      visible={isOpen}
      width={100}
      centered
    >
      <Spin />
    </Modal>
  );
};

export default Loader;
