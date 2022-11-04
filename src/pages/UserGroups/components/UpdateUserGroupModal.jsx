import { Modal, Button, Form, Input, Select, Space } from "antd";
import { useEffect, useRef, useState } from "react";
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

  const [selectPermission, setSelectPermission] = useState([]);

  const { data: permissions } = useQuery({
    queryFn: () => getPermission(),
    queryKey: [GET_PERMISSIONS],
    onSuccess: (data) => setSelectPermission(data),
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
        const temp = permissions.find((el) => el.id === element.id);
        if (temp) {
          refPermissions.current = refPermissions.current.filter(
            (ele) => ele.id !== temp.id
          );
        }
      });

      setPermissionList(refPermissions.current);
    }
  }, [permissions, initialPermission, form]);

  return (
    <Modal
      cancelText="Cancel"
      centered={true}
      footer={null}
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
              filterOption={false}
              mode="multiple"
              placeholder="Select permissions"
              allowClear
              showSearch
              onChange={(val) => {
                val.forEach((element) => {
                  setPermissionList((prev) =>
                    prev.filter(
                      (ele) =>
                        ele.id !==
                        permissions.find((el) => el.id === element)?.id
                    )
                  );
                });
              }}
              onDeselect={(val) =>
                setPermissionList((prev) => [
                  permissions.find((el) => el.id === val),
                  ...prev,
                ])
              }
              onSearch={(val) => {
                setSelectPermission(() =>
                  permissions.filter((permission) =>
                    permission.name.toLowerCase().includes(val.toLowerCase())
                  )
                );
              }}
            >
              {selectPermission &&
                selectPermission.map((el) => (
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
          <div className="overflow-y-scroll h-[75vh] flex flex-col gap-2">
            {permissionList &&
              permissionList.map((el, index) => (
                <span
                  key={el.id}
                  className="break-words w-full bg-gray-100 py-1 px-2 rounded-sm cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setPermissionList((prev) =>
                      prev.filter((ele) => ele.id !== el.id)
                    );
                    form.setFieldsValue({
                      permissions: [
                        ...form.getFieldValue("permissions"),
                        el.id,
                      ],
                    });
                  }}
                >
                  {`${index + 1}. `} {el.name}
                </span>
              ))}
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default UpdateUserGroupModal;
