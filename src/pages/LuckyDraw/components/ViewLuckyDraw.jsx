import { useState } from "react";
import { Image, Tag, Menu, Dropdown, Button, Space, Table } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import moment from "moment";
import { isEmpty } from "lodash";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteCoupon, getLuckyDrawById } from "../../../api/luckyDraw";
import { GET_LUCKY_DRAW_BY_ID } from "../../../constants/queryKeys";
import CustomPageHeader from "../../../shared/PageHeader";
import Loader from "../../../shared/Loader";
import { getStatusColor } from "..";
import ConfirmDelete from "../../../shared/ConfirmDelete";
import { ACTIVE, INACTIVE } from "../../../constants";
import { openErrorNotification, openSuccessNotification } from "../../../utils";
import ButtonWPermission from "../../../shared/ButtonWPermission";

const ViewLuckyDraw = () => {
  const { eventId } = useParams();

  const navigate = useNavigate();

  const [deleteCouponModal, setDeleteCouponModal] = useState({
    isOpen: false,
    title: "",
  });

  const [couponId, setCouponId] = useState([]);

  const {
    data: luckyDraw,
    refetch: refetchLuckyDraw,
    status,
  } = useQuery({
    queryFn: () => getLuckyDrawById(eventId),
    queryKey: [GET_LUCKY_DRAW_BY_ID, eventId],
    enabled: !!eventId,
  });

  const handleDeleteCoupon = useMutation(() => deleteCoupon(couponId), {
    onSuccess: (data) => {
      openSuccessNotification(data[0].data.message);
      refetchLuckyDraw();
      setDeleteCouponModal({
        ...deleteCouponModal,
        title: "",
        isOpen: false,
      });
    },
    onError: (err) => openErrorNotification(err),
  });

  const couponsDataSource = luckyDraw?.coupons?.results.map((el, index) => {
    return {
      key: index + 1,
      id: el.coupon_id,
      customer_name: el.customer_name,
      user: el.user,
      remarks: el.remarks,
      created_at: moment(el.created_at).utc().format("lll"),
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
      title: "Customer Name",
      dataIndex: "customer_name",
      key: "customer_name",
      width: "20%",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
      key: "remarks",
    },
    {
      title: "Actions",
      dataIndex: "action",
      key: "action",
      render: (_, { id, user }) => {
        return (
          <ButtonWPermission
            codename="delete_luckydrawcoupon"
            icon={
              <DeleteOutlined
                onClick={() => {
                  setDeleteCouponModal({
                    ...deleteCouponModal,
                    isOpen: true,
                    title: `Delete ${user}?`,
                  });
                  setCouponId([id]);
                }}
              />
            }
          />
        );
      },
    },
  ];

  const rowSelection = {
    onChange: (_, selectedRows) => {
      setCouponId(selectedRows.map((el) => el.id));
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
              codename="delete_luckydrawcoupon"
              disabled={isEmpty(couponId)}
              onClick={() => {
                setDeleteCouponModal({
                  ...deleteCouponModal,
                  isOpen: true,
                  title: "Delete all coupons?",
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
      <CustomPageHeader title={luckyDraw && luckyDraw.title} />

      {status === "loading" ? (
        <Loader isOpen={true} />
      ) : (
        luckyDraw && (
          <>
            <div className="bg-[#FFFFFF] p-6 flex gap-6 items-start">
              <Image
                height={190}
                src={luckyDraw.event_banner.full_size}
                width={240}
              />
              <div className="w-full flex justify-between items-start">
                <div className="flex flex-col">
                  <p>
                    Title:{" "}
                    <span className="font-semibold">{luckyDraw.title}</span>
                  </p>

                  <p>
                    Description:{" "}
                    <span className="font-semibold">
                      {luckyDraw.description}
                    </span>
                  </p>

                  <p>
                    Created at:{" "}
                    <span className="font-semibold">
                      {moment(luckyDraw.created_at).utc().format("lll")}
                    </span>
                  </p>

                  <p>
                    Event date:{" "}
                    <span className="font-semibold">
                      {moment(luckyDraw.event_date).utc().format("lll")}
                    </span>
                  </p>

                  <Tag
                    className="text-center w-fit"
                    color={
                      luckyDraw.is_active
                        ? getStatusColor(ACTIVE)
                        : getStatusColor(INACTIVE)
                    }
                  >
                    {luckyDraw.is_active ? "Active" : "Inactive"}
                  </Tag>
                </div>

                <ButtonWPermission
                  className="!text-[#00A0B0] !border-none !bg-inherit !flex items-center gap-1.5"
                  codename="change_luckydrawevent"
                  onClick={() => navigate(`/lucky-draw/update/${eventId}`)}
                >
                  <EditOutlined /> Edit Details
                </ButtonWPermission>
              </div>
            </div>

            <div className="flex flex-col py-8 gap-3">
              <Dropdown className="w-fit" overlay={bulkMenu}>
                <Button className="bg-white" type="default">
                  <Space>Bulk Actions</Space>
                </Button>
              </Dropdown>

              <Table
                columns={columns}
                dataSource={couponsDataSource}
                loading={status === "loading" || refetchLuckyDraw}
                rowSelection={{ ...rowSelection }}
              />
            </div>

            <ConfirmDelete
              closeModal={() =>
                setDeleteCouponModal({
                  ...deleteCouponModal,
                  isOpen: false,
                })
              }
              deleteMutation={() => handleDeleteCoupon.mutate()}
              isOpen={deleteCouponModal.isOpen}
              status={handleDeleteCoupon.status}
              title={deleteCouponModal.title}
            />
          </>
        )
      )}
    </>
  );
};

export default ViewLuckyDraw;
