import { Button, Pagination, Select } from "antd";
import React, { useEffect, useState } from "react";
import { uniqBy } from "lodash";
import { useMutation, useQuery } from "react-query";

import CategoryWidget from "../categories/shared/CategoryWidget";
import ClearSelection from "../subComponents/ClearSelection";
import SearchBox from "../subComponents/SearchBox";
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
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";
import Alert from "../../../shared/Alert";
import AddProductGroup from "./AddProductGroup";
import EditProductGroup from "./EditProductGroup";

const { Option } = Select;

function ProductGroupsScreen() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
  const [isEditGroupOpen, setIsEditGroupOpen] = useState(false);
  const [selectedGroupSlug, setSelectedGroupSlug] = useState(""); // * For Edit

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [paginatedProductGroups, setPaginatedProductGroups] = useState([]);
  const [selectedProductGroups, setSelectedProductGroups] = useState([]);

  const {
    data,
    status,
    refetch: refetchProductGroups,
    isRefetching,
  } = useQuery(
    [GET_PAGINATED_PRODUCT_GROUPS, page.toString() + pageSize.toString()],
    () => getPaginatedProductGroups(page, pageSize)
  );

  useEffect(() => {
    if (data && status === "success" && !isRefetching)
      setPaginatedProductGroups((prev) =>
        uniqBy([...prev, ...data.results], "slug")
      );
  }, [data, isRefetching, status]);

  useEffect(() => {
    refetchProductGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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

      {(status === "loading" || isRefetching) && <Loader isOpen />}

      <CustomPageHeader title="Rasan Choices" isBasicHeader />

      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
        <div className="flex justify-between mb-3">
          <SearchBox placeholder="Search Brands..." />
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
                <Option value={ALERT_TYPE.publish}>Publish</Option>
                <Option value={ALERT_TYPE.unpublish}>Unpublish</Option>
                <Option value={ALERT_TYPE.delete}>Delete</Option>
              </Select>
            )}
            <Button type="primary" onClick={() => setIsAddGroupOpen(true)}>
              Add New Rasan Choice
            </Button>
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
            onChange={(page, pageSize) => {
              setPage(page);
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
