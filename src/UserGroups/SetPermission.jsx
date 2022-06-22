import { Form, Input, message, Modal } from "antd";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPermission, updateGroupDetail } from "../context/UserGroupContext";

const SetPermission = ({ visible, onCancel, id, name }) => {
  const [form] = Form.useForm();
  const { data: permissionList } = useQuery("get-permissions", getPermission);
  //   const [provinces, setProvinces] = useState([]);
  //   const [cities, setCities] = useState([]);
  //   const [areas, setAreas] = useState([]);
  const queryClient = useQueryClient();
  useEffect(() => {
    let data = {
      name: name,
    };
    form.setFieldsValue(data);
  }, [name, form]);

  const { mutate: updatePermission } = useMutation(updateGroupDetail, {
    onSuccess: (data) => {
      message.success(data);
      queryClient.invalidateQueries(["get-group-details", { id }]);
    },
  });

  const onFinish = (values) => {
    const form_data = new FormData();
    for (let key in values) {
      form_data.append(key, values[key]);
    }
    updatePermission({ data: form_data, key: id });
  };
  const onFinishFailed = (errorInfo) => {};
  return (
    <Modal
      cancelText="Cancel"
      okButtonProps={{ className: "bg-primary" }}
      okText="Set"
      title="Set Permissions"
      visible={visible}
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(() => {
            form.submit();
            onCancel();
          })
          .catch((info) => {});
      }}
    >
      <Form
        autoComplete="off"
        form={form}
        initialValues={{
          remember: true,
        }}
        labelCol={{
          span: 8,
        }}
        name="basic"
        // onValuesChange={onValuesChanged}
        wrapperCol={{
          span: 16,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="User Group" name="name">
          <Input />
        </Form.Item>
        <Form.Item
          label="Province"
          name="province"
          rules={[
            {
              required: true,
              message: "Please select your province!",
            },
          ]}
        >
          {/* <Select
            options={provinces}
            placeholder="Please select a province"
            onChange={onChangeProvince}
          ></Select> */}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SetPermission;
