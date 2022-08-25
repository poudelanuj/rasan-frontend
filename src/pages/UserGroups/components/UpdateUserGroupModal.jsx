import { Modal, Button, Form, Input, Select, Space } from "antd";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getPermission, updateUserGroup } from "../../../api/userGroups";
import {
  GET_PERMISSIONS,
  GET_USER_GROUPS_BY_ID,
} from "../../../constants/queryKeys";
import { openErrorNotification, openSuccessNotification } from "../../../utils";

const UpdateUserGroupModal = ({
  isOpen,
  onClose,
  id,
  initialGroupName,
  initialPermission,
}) => {
  const queryClient = useQueryClient();

  const [form] = Form.useForm();

  const { Option } = Select;

  const refPermissions = useRef();

  const [permissionList, setPermissionList] = useState([]);

  const { data: permissions } = useQuery({
    queryFn: () => getPermission(),
    queryKey: [GET_PERMISSIONS],
  });

  const handleUpdateUserGroup = useMutation(
    ({ id, data }) => updateUserGroup({ id, data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        queryClient.refetchQueries([GET_USER_GROUPS_BY_ID]);
        onClose();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  useEffect(() => {
    if (permissions) {
      refPermissions.current = permissions;

      initialPermission.forEach((element) => {
        let temp = {};
        permissions.forEach((ele) => {
          if (element.id === ele.id) {
            temp = ele;
          }
        });

        refPermissions.current = refPermissions.current.filter(
          (el) => el.id !== temp.id
        );

        temp = {};
      });

      setPermissionList(refPermissions.current);
    }
  }, [permissions, initialPermission]);

  const permissionListChange = (id) => {
    setPermissionList((prev) => prev.filter((el) => el.id !== id));
    form.setFieldsValue({
      permissions: [...form.getFieldValue("permissions"), id],
    });
  };

  const permissionFormChange = (val) =>
    setPermissionList((prev) => [
      permissions.find((el) => el.id === val),
      ...prev,
    ]);

  return (
    <Modal
      cancelText="Cancel"
      centered={true}
      title="Update User Group"
      visible={isOpen}
      width={800}
      onCancel={onClose}
    >
      <Form
        className="flex gap-4"
        form={form}
        initialValues={{
          modifier: "public",
        }}
        layout="vertical"
        name="form_in_modal"
        onFinish={() =>
          form.validateFields().then((values) => {
            handleUpdateUserGroup.mutate({ id, data: values });
          })
        }
      >
        <Form.Item className="basis-[60%]">
          <Form.Item
            initialValue={initialGroupName}
            label="Group Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input group name",
              },
            ]}
          >
            <Input defaultValue={initialGroupName} />
          </Form.Item>

          <Form.Item
            initialValue={initialPermission.map((el) => el.id)}
            label="Permissions"
            name="permissions"
          >
            <Select
              defaultValue={initialPermission.map((el) => el.id)}
              mode="multiple"
              placeholder="Select permissions"
              allowClear
              onDeselect={permissionFormChange}
            >
              {permissions &&
                permissions.map((el) => (
                  <Option key={el.id} value={el.id}>
                    {el.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                htmlType="submit"
                loading={handleUpdateUserGroup.isLoading}
                type="primary"
              >
                Update
              </Button>
              <Button type="ghost" onClick={onClose}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form.Item>

        <div className="flex flex-col gap-[8.3px]">
          <span>Permission List</span>
          <Space>
            <Button
              onClick={() => {
                form.setFieldsValue({
                  permissions: permissions && permissions.map((el) => el.id),
                });
                setPermissionList([]);
              }}
            >
              Add All
            </Button>
            <Button
              danger
              onClick={() => {
                form.setFieldsValue({ permissions: [] });
                setPermissionList(permissions);
              }}
            >
              Remove All
            </Button>
          </Space>
          {permissionList &&
            permissionList.map((el) => (
              <span
                key={el.id}
                className="break-words w-full bg-gray-100 py-1 px-2 rounded-sm cursor-pointer hover:bg-gray-200"
                onClick={() => permissionListChange(el.id)}
              >
                {el.name}
              </span>
            ))}
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateUserGroupModal;
