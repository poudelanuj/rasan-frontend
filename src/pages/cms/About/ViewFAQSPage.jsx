import { useMutation, useQuery } from "react-query";
import { Button, Dropdown, Space, Menu, Tag, Input } from "antd";
import { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useParams } from "react-router-dom";
import {
  deleteFAQS,
  getFAQGroupsById,
  postFAQS,
  publishFAQS,
  updateFAQS,
} from "../../../api/aboutus";
import { GET_FAQ_GROPUS_BY_ID } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import { PUBLISHED, UNPUBLISHED } from "../../../constants";
import {
  openSuccessNotification,
  openErrorNotification,
} from "../../../utils/openNotification";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import { isEmpty } from "lodash";

export const getStatusColor = (status) => {
  switch (status) {
    case PUBLISHED:
      return "green";
    case UNPUBLISHED:
      return "orange";
    default:
      return "green";
  }
};

const ViewFAQSPage = () => {
  const { groupId } = useParams();

  const { TextArea } = Input;

  const [deleteIds, setDeletetIds] = useState([]);

  const [editId, setEditId] = useState(null);

  const [isDeleteFAQsModalOpen, setIsDeleteFAQsModalOpen] = useState(false);

  const [isAddFAQFormOpen, setIsAddFAQFormOpen] = useState(false);

  const {
    data: dataSource,
    isFetching,
    refetch: refetchFAQS,
  } = useQuery({
    queryFn: () => getFAQGroupsById(groupId),
    queryKey: [GET_FAQ_GROPUS_BY_ID, groupId],
    enabled: !!groupId,
  });

  const [postPutFAQS, setPostPutFAQS] = useState({});

  const postPutFAQChange = (e) => {
    const { name, value } = e.target;
    setPostPutFAQS({ ...postPutFAQS, [name]: value });
  };

  const handleUpdateFAQS = useMutation(
    ({ id, data }) => updateFAQS({ id, data }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        setPostPutFAQS({
          title: "",
          content: "",
          title_np: "",
          content_np: "",
        });
        refetchFAQS();
        setEditId(null);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handlePostFAQS = useMutation((data) => postFAQS(data), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      refetchFAQS();
      setIsAddFAQFormOpen(false);
      setPostPutFAQS({
        title: "",
        content: "",
        title_np: "",
        content_np: "",
      });
    },
    onError: (err) => openErrorNotification(err),
  });

  const handleDeleteFAQS = useMutation((id) => deleteFAQS(id), {
    onSuccess: (data) => {
      openSuccessNotification(data.message);
      setIsDeleteFAQsModalOpen(false);
      refetchFAQS();
      setDeletetIds([]);
    },
    onError: (err) => openErrorNotification(err),
  });

  const handlePublishFAQS = useMutation(
    ({ id, shouldPublish }) => publishFAQS({ id, shouldPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchFAQS();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const dataSourceFAQS = dataSource?.faqs.map((el) => {
    return {
      id: el.id,
      title: el.title,
      title_np: el.title_np,
      content: el.content,
      content_np: el.content_np,
      published_at: moment(el.published_at).format("ll"),
      status: el.is_published ? "Published" : "Not published",
      is_published: el.is_published,
    };
  });

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <ButtonWPermission
              className="!border-none !bg-inherit !text-current"
              codename="delete_faq"
              disabled={isEmpty(deleteIds)}
              onClick={() => {
                setIsDeleteFAQsModalOpen(true);
              }}
            >
              Delete
            </ButtonWPermission>
          ),
        },
      ]}
    />
  );

  return (
    <>
      {isFetching ? (
        <Loader isOpen={true} />
      ) : (
        <>
          {dataSourceFAQS && (
            <>
              <CustomPageHeader title={dataSource?.name} />

              <div className="relative bg-white p-6 rounded-lg flex flex-col gap-5">
                <span className="absolute right-5">
                  <Dropdown overlay={bulkMenu}>
                    <Button className="bg-white" type="default">
                      <Space>Bulk Actions</Space>
                    </Button>
                  </Dropdown>
                </span>

                <ButtonWPermission
                  className="!bg-[rgb(244,247,251)] !w-[36%] !ml-9 !border-dashed !border-2 !py-8 !flex items-center justify-center"
                  codename="add_faq"
                  onClick={() => {
                    setPostPutFAQS({
                      title: "",
                      content: "",
                      title_np: "",
                      content_np: "",
                    });
                    setIsAddFAQFormOpen(true);
                    setEditId(null);
                  }}
                >
                  Add New FAQ
                </ButtonWPermission>

                {isAddFAQFormOpen && (
                  <form
                    className="flex rounded-lg gap-6 items-center ml-9"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handlePostFAQS.mutate({ group: groupId, ...postPutFAQS });
                    }}
                  >
                    <div className="flex flex-col p-5 rounded-lg bg-white gap-3 border w-[37.2%]">
                      <input
                        className="focus:border-0 outline-none font-semibold px-3"
                        name="title"
                        placeholder="Add title"
                        type="text"
                        required
                        onChange={postPutFAQChange}
                      />
                      <TextArea
                        bordered={false}
                        name="content"
                        placeholder="Add content"
                        autoSize
                        required
                        onChange={postPutFAQChange}
                      />
                    </div>

                    <div className="flex flex-col py-5 px-2 rounded-lg bg-white gap-3 border w-[37.2%]">
                      <input
                        className="focus:border-0 outline-none font-semibold px-3"
                        name="title_np"
                        placeholder="Add title in Nepali"
                        type="text"
                        required
                        onChange={postPutFAQChange}
                      />
                      <TextArea
                        bordered={false}
                        name="content_np"
                        placeholder="Add content in Nepali"
                        autoSize
                        required
                        onChange={postPutFAQChange}
                      />
                    </div>

                    <div className="flex gap-5 items-center">
                      <Button
                        htmlType="submit"
                        loading={handlePostFAQS.isLoading}
                      >
                        Save
                      </Button>
                      <CloseCircleOutlined
                        className="text-xl cursor-pointer"
                        onClick={() => setIsAddFAQFormOpen(false)}
                      />
                    </div>
                  </form>
                )}

                {dataSourceFAQS.map((el) => (
                  <form
                    key={el.id}
                    className="flex rounded-lg gap-6 items-start"
                    onSubmit={(e) => {
                      e.preventDefault();
                      el.id === editId &&
                        handleUpdateFAQS.mutate({
                          id: editId,
                          data: postPutFAQS,
                        });
                    }}
                  >
                    <input
                      className="accent-blue-500 mt-[3rem]"
                      type="checkbox"
                      onClick={(e) => {
                        e.target.checked
                          ? setDeletetIds([...deleteIds, el.id])
                          : setDeletetIds(
                              deleteIds.filter((items) => items !== el.id)
                            );
                      }}
                    />

                    <div className="flex flex-col py-5 px-2 rounded-lg bg-white gap-3 border w-[36%]">
                      <input
                        className={`${
                          el.id !== editId && "pointer-events-none"
                        } focus:border-0 outline-none font-semibold px-3`}
                        defaultValue={el.title}
                        name="title"
                        placeholder="Add content"
                        type="text"
                        required
                        onChange={postPutFAQChange}
                      />
                      <TextArea
                        bordered={false}
                        className={`${
                          el.id !== editId && "pointer-events-none"
                        }`}
                        defaultValue={el.content}
                        name="content"
                        placeholder="Add content"
                        autoSize
                        required
                        onChange={postPutFAQChange}
                      />
                    </div>

                    <div className="flex flex-col py-5 px-2 rounded-lg bg-white gap-3 border w-[36%]">
                      <input
                        className={`${
                          el.id !== editId && "pointer-events-none"
                        } focus:border-0 outline-none font-semibold px-3`}
                        defaultValue={el.title_np}
                        name="title_np"
                        placeholder="Add title in Nepali"
                        type="text"
                        required
                        onChange={postPutFAQChange}
                      />
                      <TextArea
                        bordered={false}
                        className={`${
                          el.id !== editId && "pointer-events-none"
                        }`}
                        defaultValue={el.content_np}
                        name="content_np"
                        placeholder="Add content in Nepali"
                        autoSize
                        required
                        onChange={postPutFAQChange}
                      />
                    </div>

                    <div className="flex flex-col gap-4 items-end">
                      <Tag className="w-fit" color={getStatusColor(el.status)}>
                        {el.status.toUpperCase()}
                      </Tag>
                      <span className="flex gap-5 items-center">
                        {editId === el.id ? (
                          <>
                            <Button
                              htmlType="submit"
                              loading={handleUpdateFAQS.isLoading}
                              type="primary"
                            >
                              Save
                            </Button>
                            <Button
                              type="ghost"
                              onClick={() => setEditId(null)}
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <ButtonWPermission
                            codename="change_faq"
                            icon={
                              <EditOutlined
                                className="text-xl cursor-pointer"
                                onClick={() => {
                                  setPostPutFAQS({
                                    title: el.title,
                                    content: el.content,
                                    title_np: el.title_np,
                                    content_np: el.content_np,
                                    group: groupId,
                                  });
                                  setIsAddFAQFormOpen(false);
                                  setEditId(el.id);
                                }}
                              />
                            }
                          />
                        )}
                        <ButtonWPermission
                          codename="delete_faq"
                          icon={
                            <DeleteOutlined
                              className="text-xl cursor-pointer"
                              onClick={() => {
                                setIsDeleteFAQsModalOpen(true);
                                setDeletetIds([el.id]);
                              }}
                            />
                          }
                        />
                        {!(editId === el.id) && (
                          <ButtonWPermission
                            className="w-24 text-center"
                            codename="change_faq"
                            danger={el.is_published}
                            loading={
                              handlePublishFAQS.variables &&
                              handlePublishFAQS.variables.id === el.id &&
                              handlePublishFAQS.isLoading
                            }
                            type="primary"
                            onClick={() =>
                              handlePublishFAQS.mutate({
                                id: el.id,
                                shouldPublish: !el.is_published,
                              })
                            }
                          >
                            {el.is_published ? "Unpublish" : "Publish"}
                          </ButtonWPermission>
                        )}
                      </span>
                    </div>
                  </form>
                ))}
              </div>

              <ConfirmDelete
                closeModal={() => setIsDeleteFAQsModalOpen(false)}
                deleteMutation={() => handleDeleteFAQS.mutate(deleteIds)}
                isOpen={isDeleteFAQsModalOpen}
                status={handleDeleteFAQS.status}
                title="Delete FAQS"
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ViewFAQSPage;
