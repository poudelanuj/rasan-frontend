import { Modal, Form, Input, Button } from "antd";
import { useMutation } from "react-query";
import { createTutorialTags } from "../../../../api/tutorial";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";

const CreateTutorialTagsModal = ({
  isCreateTagsModalOpen,
  setIsCreateTagsModalOpen,
  refetchTags,
}) => {
  const [form] = Form.useForm();

  const handleCreateTags = useMutation((data) => createTutorialTags(data), {
    onSuccess: (res) => {
      openSuccessNotification(res.message);
      form.resetFields();
      setIsCreateTagsModalOpen(false);
      refetchTags();
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  return (
    <Modal
      cancelText="Cancel"
      centered={true}
      footer={
        <>
          <Button
            className="mr-2"
            type="ghost"
            onClick={() => setIsCreateTagsModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            loading={handleCreateTags.isLoading}
            type="primary"
            onClick={() => {
              form.validateFields().then((values) => {
                handleCreateTags.mutate(values);
              });
            }}
          >
            Create
          </Button>
        </>
      }
      title="Create Tutorial Tags"
      visible={isCreateTagsModalOpen}
      onCancel={() => setIsCreateTagsModalOpen(false)}
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
          label="Tutorial Tags"
          name="tag"
          rules={[
            {
              required: true,
              message: "Please input the title",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTutorialTagsModal;
