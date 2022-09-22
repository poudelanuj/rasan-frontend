import { Button, Dropdown, Space, Menu, Table, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { uniqBy, isEmpty } from "lodash";
import CustomPageHeader from "../../shared/PageHeader";
// import ConfirmDelete from "../../shared/ConfirmDelete";
import Loader from "../../shared/Loader";
import { ACTIVE, INACTIVE } from "../../constants";
import {
  activateLuckyDraw,
  deleteLuckyDraw,
  getPaginatedLuckyDraw,
} from "../../api/luckyDraw";
import { GET_PAGINATED_LUCKY_DRAW } from "../../constants/queryKeys";
import { openErrorNotification, openSuccessNotification } from "../../utils";
import ConfirmDelete from "../../shared/ConfirmDelete";
import ButtonWPermission from "../../shared/ButtonWPermission";

export const getStatusColor = (status) => {
  switch (status) {
    case ACTIVE:
      return "green";
    case INACTIVE:
      return "orange";
    default:
      return "green";
  }
};

const LuckyDraw = () => {
  const navigate = useNavigate();

  const [deleteLuckyDrawModal, setDeleteLuckyDrawModal] = useState({
    isOpen: false,
    title: "",
  });

  const [luckyDrawId, setLuckyDrawId] = useState([]);

  const [page, setPage] = useState(1);

  const pageSize = 20;

  const [luckyDraw, setLuckyDraw] = useState([]);

  const {
    data,
    status,
    refetch: refetchLuckyDraw,
    isRefetching,
  } = useQuery({
    queryFn: () => getPaginatedLuckyDraw(page, pageSize),
    queryKey: [GET_PAGINATED_LUCKY_DRAW, page.toString() + pageSize.toString()],
  });

  useEffect(() => {
    if (data) {
      setLuckyDraw([]);
      setLuckyDraw((prev) => uniqBy([...prev, ...data.results], "id"));
    }
  }, [data]);

  useEffect(() => {
    refetchLuckyDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleActivateLuckyDraw = useMutation(
    ({ id, shouldActivate }) => activateLuckyDraw({ id, shouldActivate }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message);
        refetchLuckyDraw();
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const handleDeleteLuckyDraw = useMutation(
    () => deleteLuckyDraw(luckyDrawId),
    {
      onSuccess: (data) => {
        openSuccessNotification(data[0].data.message);
        refetchLuckyDraw();
        setDeleteLuckyDrawModal({
          ...deleteLuckyDrawModal,
          title: "",
          isOpen: false,
        });
        setLuckyDrawId([]);
      },
      onError: (err) => openErrorNotification(err),
    }
  );

  const luckyDrawSource = luckyDraw?.map((el, index) => {
    return {
      id: el.id,
      key: index + 1,
      campaign_title: el.title,
      coupons_generated: el.coupons_count,
      event_start_date: moment(el.event_date).utc().format("lll"),
      status: el.is_active ? "Active" : "Inactive",
      is_active: el.is_active,
    };
  });

  const columns = [
    {
      title: "S.N.",
      dataIndex: "key",
      key: "key",
      width: "5%",
    },
    {
      title: "Campaign Title",
      dataIndex: "campaign_title",
      key: "campaign_title",
      width: "20%",
      render: (_, { id, campaign_title }) => (
        <div
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`${id}`)}
        >
          {campaign_title}
        </div>
      ),
    },
    {
      title: "Coupons Generated",
      dataIndex: "coupons_generated",
      key: "coupons_generated",
    },
    {
      title: "Event Start Date",
      dataIndex: "event_start_date",
      key: "event_start_date",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { is_active, status }) => {
        return (
          <>
            <Tag
              color={
                is_active ? getStatusColor(ACTIVE) : getStatusColor(INACTIVE)
              }
            >
              {status.toUpperCase()}
            </Tag>
          </>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      width: "13%",
      render: (_, { id, campaign_title, is_active }) => {
        return (
          <div className="flex items-center justify-between">
            <ButtonWPermission
              className="w-20 text-center"
              codename="change_luckydrawevent"
              danger={is_active}
              loading={
                handleActivateLuckyDraw.variables &&
                handleActivateLuckyDraw.variables.id === id &&
                handleActivateLuckyDraw.isLoading
              }
              size="small"
              type="primary"
              onClick={() =>
                handleActivateLuckyDraw.mutate({
                  id,
                  shouldActivate: !is_active,
                })
              }
            >
              {is_active ? "Deactivate" : "Activate"}
            </ButtonWPermission>

            <ButtonWPermission
              codename="delete_luckydrawevent"
              icon={
                <DeleteOutlined
                  onClick={() => {
                    setDeleteLuckyDrawModal({
                      ...deleteLuckyDrawModal,
                      isOpen: true,
                      title: `Delete ${campaign_title}?`,
                    });
                    setLuckyDrawId([id]);
                  }}
                />
              }
            />
          </div>
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setLuckyDrawId(selectedRows.map((el) => el.id));
    },
  };

  const bulkMenu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <ButtonWPermission
              className="!border-none !bg-inherit !text-current"
              codename="delete_luckydrawevent"
              disabled={isEmpty(luckyDrawId)}
              onClick={() => {
                setDeleteLuckyDrawModal({
                  ...deleteLuckyDrawModal,
                  isOpen: true,
                  title: "Delete all lucky draw?",
                });
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
      <CustomPageHeader title="Lucky Draw Campaigns" isBasicHeader />

      <div className="py-5 px-4 bg-[#FFFFFF]">
        <div className="mb-4 flex justify-between">
          <ButtonWPermission
            className="flex items-center"
            codename="add_luckydrawevent"
            type="primary"
            ghost
            onClick={() => navigate("create")}
          >
            Create Campaigns
          </ButtonWPermission>

          <Dropdown overlay={bulkMenu}>
            <Button className="bg-white" type="default">
              <Space>Bulk Actions</Space>
            </Button>
          </Dropdown>
        </div>

        {status === "loading" ? (
          <Loader isOpen={true} />
        ) : (
          <Table
            columns={columns}
            dataSource={luckyDrawSource}
            loading={status === "loading" || isRefetching}
            pagination={{
              pageSize,
              total: data?.count,

              onChange: (page, pageSize) => {
                setPage(page);
              },
            }}
            rowSelection={{ ...rowSelection }}
          />
        )}
      </div>

      <ConfirmDelete
        closeModal={() =>
          setDeleteLuckyDrawModal({
            ...deleteLuckyDrawModal,
            isOpen: false,
          })
        }
        deleteMutation={() => handleDeleteLuckyDraw.mutate()}
        isOpen={deleteLuckyDrawModal.isOpen}
        status={handleDeleteLuckyDraw.status}
        title={deleteLuckyDrawModal.title}
      />
    </>
  );
};

export default LuckyDraw;
