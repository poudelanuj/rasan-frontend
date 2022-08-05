import { Modal, Button, Form, Input } from "antd";
import { useEffect } from "react";
import { useMutation, useQuery } from "react-query";
import { getFAQGroupsById, updateFAQGroups } from "../../../../api/aboutus";
import { GET_FAQ_GROPUS_BY_ID } from "../../../../constants/queryKeys";
import Loader from "../../../../shared/Loader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../../utils/openNotification";

const UpdateFAQGroupsModal = ({
  isUpdateFAQGroupsModalOpen,
  setIsUpdateFAQGroupsModalOpen,
  refetchFAQGroups,
  ids,
}) => {
  const [form] = Form.useForm();

  const {
    data: dataSource,
    isFetching,
    isSuccess,
    refetch,
  } = useQuery({
    queryFn: () => getFAQGroupsById(ids),
    queryKey: [GET_FAQ_GROPUS_BY_ID, ids],
    enabled: !!ids,
  });

  const handleUpdateFAQGroups = useMutation(
    ({ id, data }) => updateFAQGroups({ id, data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        form.resetFields();
        setIsUpdateFAQGroupsModalOpen(false);
        refetchFAQGroups();
        refetch();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  useEffect(() => {
    if (isSuccess)
      form.setFieldsValue({
        name: dataSource.name,
        name_np: dataSource.name_np,
      });
  }, [isSuccess, form, dataSource]);

  return (
    <>
      {isFetching ? (
        <Loader isOpen={true} />
      ) : (
        <Modal
          cancelText="Cancel"
          footer={
            <>
              <Button
                className="mr-2"
                type="ghost"
                onClick={() => setIsUpdateFAQGroupsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                loading={handleUpdateFAQGroups.isLoading}
                type="primary"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values) =>
                      handleUpdateFAQGroups.mutate({ id: ids, data: values })
                    );
                }}
              >
                Update FAQ Group
              </Button>
            </>
          }
          title="Create FAQ Group"
          visible={isUpdateFAQGroupsModalOpen}
          centered
          onCancel={() => setIsUpdateFAQGroupsModalOpen(false)}
        >
          {dataSource && (
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
          )}
        </Modal>
      )}
    </>
  );
};

export default UpdateFAQGroupsModal;
