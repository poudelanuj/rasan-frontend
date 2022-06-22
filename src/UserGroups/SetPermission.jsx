import { Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPermission, updateGroupDetail } from "../context/UserGroupContext";

const SetPermission = ({ visible, onCancel, id, name, permissions }) => {
  const [form] = Form.useForm();
  const { data: permissionList } = useQuery("get-permissions", getPermission);
  const queryClient = useQueryClient();
  const permissionOfUG = permissions?.map((permission) => permission.id);
  useEffect(() => {
    let data = {
      name: name,
      permission: permissionOfUG,
    };
    form.setFieldsValue(data);
  }, [name, form, permissionOfUG]);

  const { mutate: updatePermission } = useMutation(updateGroupDetail, {
    onSuccess: (data) => {
      message.success(data);
      queryClient.invalidateQueries(["get-group-details", { id }]);
    },
  });
  const onChangeProvince = (e) => {};
  const onFinish = (values) => {
    const form_data = new FormData();
    for (let key in values) {
      if (key === "name") form_data.append(key, values[key]);
    }
    values["permissions"].forEach((permission) => {
      form_data.append("permission[]", permission);
    });
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
            console.log("Gone here");
            form.submit();
            onCancel();
          })
          .catch((info) => {});
      }}
    >
      <Form
        autoComplete="off"
        form={form}
        initialValues={{ name: name }}
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
          label="Permission"
          name="permission"
          rules={[
            {
              required: true,
              message: "Please select your permission!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Please select a permission"
            onChange={onChangeProvince}
          >
            {permissionList?.map((permission) => (
              <Select.Option key={permission.id} value={permission.id}>
                {permission.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SetPermission;
