import { Pagination, Select, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { uniqBy } from "lodash";
import { useMutation, useQuery } from "react-query";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";

import CategoryWidget from "../categories/shared/CategoryWidget";
import ClearSelection from "../subComponents/ClearSelection";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { ALERT_TYPE, DEFAULT_RASAN_IMAGE } from "../../../constants";
import {
  bulkDelete,
  bulkPublish,
  getPaginatedProductGroups,
} from "../../../api/products/productGroups";
import { GET_PAGINATED_PRODUCT_GROUPS } from "../../../constants/queryKeys";
import CustomPageHeader from "../../../shared/PageHeader";
import Alert from "../../../shared/Alert";
import AddProductGroup from "./AddProductGroup";
import EditProductGroup from "./EditProductGroup";
import ButtonWPermission from "../../../shared/ButtonWPermission";
import { useRef } from "react";

const { Option } = Select;

function ProductGroupsScreen() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [selectedGroupSlug, setSelectedGroupSlug] = useState(""); // * For Edit

  const searchText = useRef();

  let timeout = 0;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [paginatedProductGroups, setPaginatedProductGroups] = useState([]);
  const [selectedProductGroups, setSelectedProductGroups] = useState([]);

  const {
    data,
    status,
    refetch: refetchProductGroups,
    isRefetching,
  } = useQuery(
    [
      GET_PAGINATED_PRODUCT_GROUPS,
      page.toString() + pageSize.toString(),
      searchText.current,
    ],
    () => getPaginatedProductGroups(page, pageSize, searchText.current)
  );

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setPaginatedProductGroups([]);
      setPaginatedProductGroups((prev) =>
        uniqBy([...prev, ...data.results], "slug")
      );
    }
  }, [data, isRefetching, status]);

  useEffect(() => {
    refetchProductGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleBulkPublish = useMutation(
    ({ slugs, isPublish }) => bulkPublish({ slugs, isPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Rasan Choices Updated");
        setOpenAlert(false);
        setSelectedProductGroups([]);
        setPaginatedProductGroups([]);
        refetchProductGroups();
      },
      onError: (error) => openErrorNotification(error),
    }
  );

  const handleBulkDelete = useMutation((slugs) => bulkDelete(slugs), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Rasan Choices Deleted");
      setOpenAlert(false);
      setSelectedProductGroups([]);
      setPaginatedProductGroups([]);
      refetchProductGroups();
    },
    onError: (error) => openErrorNotification(error),
  });

  const renderAlert = () => {
    switch (alertType) {
      case "publish":
        return (
          <Alert
            action={() =>
              handleBulkPublish.mutate({
                isPublish: true,
                slugs: selectedProductGroups.map(({ slug }) => slug),
              })
            }
            alertType={ALERT_TYPE.publish}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkPublish.status}
            text="Are you sure you want to publish selected rasan choices?"
            title="Publish Selected Rasan Choices"
          />
        );

      case "unpublish":
        return (
          <Alert
            action={() =>
              handleBulkPublish.mutate({
                isPublish: false,
                slugs: selectedProductGroups.map(({ slug }) => slug),
              })
            }
            alertType={ALERT_TYPE.unpublish}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkPublish.status}
            text="Are you sure you want to unpublish selected rasan choices?"
            title="Unpublish Selected Rasan Choices"
          />
        );
      case "delete":
        return (
          <Alert
            action={() =>
              handleBulkDelete.mutate(
                selectedProductGroups.map(({ slug }) => slug)
              )
            }
            alertType={ALERT_TYPE.delete}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkDelete.status}
            text="Are you sure you want to delete selected rasan choices?"
            title="Delete Selected Rasan Choices"
          />
        );
      default:
        break;
    }
  };

  return (
    <>
      {openAlert && renderAlert()}

      <CustomPageHeader title="Rasan Choices" isBasicHeader />

      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
        <div className="flex justify-between mb-3">
          <Space className="flex items-center">
            <div className="py-[3px] px-3 min-w-[18rem] border-[1px] border-[#D9D9D9] rounded-lg flex items-center justify-between">
              <SearchOutlined style={{ color: "#D9D9D9" }} />
              <input
                className="focus:outline-none w-full ml-1 placeholder:text-[#D9D9D9]"
                placeholder={"Search categories..."}
                type="text"
                onChange={(e) => {
                  searchText.current = e.target.value;
                  if (timeout) clearTimeout(timeout);
                  timeout = setTimeout(refetchProductGroups, 400);
                }}
              />
            </div>

            {(status === "loading" || isRefetching) && (
              <Spin indicator={<LoadingOutlined />} />
            )}
          </Space>
          <div className="flex">
            <ClearSelection
              selectedCategories={selectedProductGroups}
              setSelectedCategories={setSelectedProductGroups}
            />
            {selectedProductGroups.length > 0 && (
              <Select
                style={{
                  width: 120,
                  marginRight: "1rem",
                }}
                value={"Bulk Actions"}
                onSelect={(value) => {
                  setOpenAlert(true);
                  setAlertType(value);
                }}
              >
                <Option value={ALERT_TYPE.publish}>
                  <ButtonWPermission
                    className="!border-none !text-current !bg-inherit"
                    codename="change_productgroup"
                  >
                    Publish
                  </ButtonWPermission>
                </Option>
                <Option value={ALERT_TYPE.unpublish}>
                  <ButtonWPermission
                    className="!border-none !text-current !bg-inherit"
                    codename="change_productgroup"
                  >
                    Unpublish
                  </ButtonWPermission>
                </Option>
                <Option value={ALERT_TYPE.delete}>
                  <ButtonWPermission
                    className="!border-none !text-current !bg-inherit"
                    codename="delete_productgroup"
                  >
                    Delete
                  </ButtonWPermission>
                </Option>
              </Select>
            )}
            <ButtonWPermission
              codename="add_productgroup"
              type="primary"
              onClick={() => setIsAddGroupOpen(true)}
            >
              Add New Rasan Choice
            </ButtonWPermission>
          </div>
        </div>
        <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
          {paginatedProductGroups
            .filter((item, index) => {
              const initPage = (page - 1) * pageSize;
              const endPage = page * pageSize;
              if (index >= initPage && index < endPage) return true;
              return false;
            })
            .map((group) => (
              <CategoryWidget
                key={group.slug}
                completeLink={`/product-groups/${group.slug}`}
                editClick={() => {
                  setIsEditGroupOpen(true);
                  setSelectedGroupSlug(group.slug);
                }}
                id={group.slug}
                image={
                  group.product_group_image.thumbnail || DEFAULT_RASAN_IMAGE
                }
                imgClassName=""
                is_published={group.is_published}
                selectedCategories={selectedProductGroups}
                setSelectedCategories={setSelectedProductGroups}
                slug={group.slug}
                title={group.name}
              />
            ))}
        </div>

        <div className="flex justify-end bg-white w-full mt-10">
          <Pagination
            current={page}
            pageSize={pageSize}
            showTotal={(total) => `Total ${total} items`}
            total={data?.count}
            showSizeChanger
            onChange={(page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
            }}
          />
        </div>
      </div>

      {isAddGroupOpen && (
        <AddProductGroup
          closeModal={() => setIsAddGroupOpen(false)}
          isOpen={isAddGroupOpen}
          setProductGroupsList={setPaginatedProductGroups}
        />
      )}

      {isEditGroupOpen && (
        <EditProductGroup
          closeModal={() => setIsEditGroupOpen(false)}
          isOpen={isEditGroupOpen}
          setProductGroupsList={setPaginatedProductGroups}
          slug={selectedGroupSlug}
        />
      )}
    </>
  );
}

export default ProductGroupsScreen;
