import { Modal, Button, Form, Input } from "antd";
import { useMutation } from "react-query";
import { postFAQGroups } from "../../../../api/aboutus";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";

const CreateFAQGroupsModal = ({
  isCreateFAQGroupsModalOpen,
  setIsCreateFAQGroupsModalOpen,
  refetchFAQGroups,
}) => {
  const [form] = Form.useForm();

  const handleCreateFAQGroups = useMutation((data) => postFAQGroups(data), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      form.resetFields();
      setIsCreateFAQGroupsModalOpen(false);
      refetchFAQGroups();
    },
    onError: (err) => openErrorNotification(err),
  });

  return (
    <Modal
      cancelText="Cancel"
      footer={
        <>
          <Button
            className="mr-2"
            type="ghost"
            onClick={() => setIsCreateFAQGroupsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            loading={handleCreateFAQGroups.isLoading}
            type="primary"
            onClick={() => {
              form
                .validateFields()
                .then((values) => handleCreateFAQGroups.mutate(values));
            }}
          >
            Create FAQ Group
          </Button>
        </>
      }
      title="Create FAQ Group"
      visible={isCreateFAQGroupsModalOpen}
      centered
      onCancel={() => setIsCreateFAQGroupsModalOpen(false)}
    >
      <Form
        form={form}
        initialValues={{
          modifier: "public",
        }}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          label="Group Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input group name!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Group Name in Nepali"
          name="name_np"
          rules={[
            {
              required: true,
              message: "Please input group name in Nepali!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateFAQGroupsModal;
