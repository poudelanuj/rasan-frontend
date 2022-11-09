import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { uniqBy } from "lodash";
import { Pagination, Select, Spin } from "antd";
import { SearchOutlined, LoadingOutlined } from "@ant-design/icons";

import CategoryWidget from "../categories/shared/CategoryWidget";

import ClearSelection from "../subComponents/ClearSelection";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { ALERT_TYPE, DEFAULT_RASAN_IMAGE } from "../../../constants";
import { GET_PAGINATED_BRANDS } from "../../../constants/queryKeys";
import {
  bulkDelete,
  bulkPublish,
  getPaginatedBrands,
} from "../../../api/brands";
import CustomPageHeader from "../../../shared/PageHeader";
import Alert from "../../../shared/Alert";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import ButtonWPermission from "../../../shared/ButtonWPermission";

const { Option } = Select;

function BrandsScreen() {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isEditBrandOpen, setIsEditBrandOpen] = useState(false);
  const [selectedBrandSlug, setSelectedBrandSlug] = useState(""); // * For Edit

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [paginatedBrands, setPaginatedBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const searchText = useRef();

  let timeout = 0;

  const {
    data,
    status,
    refetch: refetchBrands,
    isRefetching,
  } = useQuery(
    [GET_PAGINATED_BRANDS, page.toString() + pageSize.toString()],
    () => getPaginatedBrands(page, pageSize, searchText.current)
  );

  useEffect(() => {
    if (data && status === "success" && !isRefetching) {
      setPaginatedBrands([]);
      setPaginatedBrands((prev) => uniqBy([...prev, ...data.results], "slug"));
    }
  }, [data, isRefetching, status]);

  useEffect(() => {
    refetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const queryClient = useQueryClient();

  const handleBulkPublish = useMutation(
    ({ slugs, isPublish }) => bulkPublish({ slugs, isPublish }),
    {
      onSuccess: (data) => {
        openSuccessNotification(data.message || "Brands Updated");
        setOpenAlert(false);
        setSelectedBrands([]);
        setPaginatedBrands([]);
        queryClient.invalidateQueries([GET_PAGINATED_BRANDS]);
        queryClient.refetchQueries([GET_PAGINATED_BRANDS]);
      },
      onError: (error) => openErrorNotification(error),
    }
  );

  const handleBulkDelete = useMutation((slugs) => bulkDelete(slugs), {
    onSuccess: (data) => {
      openSuccessNotification(data.message || "Brands Deleted");
      setOpenAlert(false);
      setSelectedBrands([]);
      setPaginatedBrands([]);
      queryClient.invalidateQueries([GET_PAGINATED_BRANDS]);
      queryClient.refetchQueries([GET_PAGINATED_BRANDS]);
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
                slugs: selectedBrands.map(({ slug }) => slug),
              })
            }
            alertType={ALERT_TYPE.publish}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkPublish.status}
            text="Are you sure you want to publish selected brands?"
            title="Publish Selected Brands"
          />
        );

      case "unpublish":
        return (
          <Alert
            action={() =>
              handleBulkPublish.mutate({
                isPublish: false,
                slugs: selectedBrands.map(({ slug }) => slug),
              })
            }
            alertType={ALERT_TYPE.unpublish}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkPublish.status}
            text="Are you sure you want to unpublish selected brands?"
            title="Unpublish Selected Brands"
          />
        );
      case "delete":
        return (
          <Alert
            action={() =>
              handleBulkDelete.mutate(selectedBrands.map(({ slug }) => slug))
            }
            alertType={ALERT_TYPE.delete}
            closeModal={() => setOpenAlert(false)}
            isOpen={openAlert}
            status={handleBulkDelete.status}
            text="Are you sure you want to delete selected brands?"
            title="Delete Selected Brands"
          />
        );
      default:
        break;
    }
  };

  return (
    <>
      {openAlert && renderAlert()}
      <CustomPageHeader title="Brands" isBasicHeader />

      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
        <div className="w-full flex justify-between sm:flex-row flex-col-reverse gap-2 mb-3">
          <div className="flex items-center">
            <div className="py-[3px] px-3 min-w-[18rem] w-full border-[1px] border-[#D9D9D9] rounded-lg flex items-center justify-between">
              <SearchOutlined style={{ color: "#D9D9D9" }} />
              <input
                className="focus:outline-none w-full ml-1 placeholder:text-[#D9D9D9]"
                placeholder={"Search categories..."}
                type="text"
                onChange={(e) => {
                  searchText.current = e.target.value;
                  if (timeout) clearTimeout(timeout);
                  timeout = setTimeout(() => {
                    setPage(1);
                    refetchBrands();
                  }, 400);
                }}
              />
            </div>

            {(status === "loading" || isRefetching) && (
              <Spin indicator={<LoadingOutlined />} />
            )}
          </div>

          <ButtonWPermission
            className="sm:!hidden !rounded-lg"
            codename="add_brand"
            type="primary"
            onClick={() => setIsAddBrandOpen(true)}
          >
            Add New Brand
          </ButtonWPermission>

          <div className="flex">
            <ClearSelection
              selectedCategories={selectedBrands}
              setSelectedCategories={setSelectedBrands}
            />
            {selectedBrands.length > 0 && (
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
                    codename="change_brand"
                  >
                    Publish
                  </ButtonWPermission>
                </Option>
                <Option value={ALERT_TYPE.unpublish}>
                  <ButtonWPermission
                    className="!border-none !text-current !bg-inherit"
                    codename="change_brand"
                  >
                    Unpublish
                  </ButtonWPermission>
                </Option>
                <Option value={ALERT_TYPE.delete}>
                  <ButtonWPermission
                    className="!border-none !text-current !bg-inherit"
                    codename="delete_brand"
                  >
                    Delete
                  </ButtonWPermission>
                </Option>
              </Select>
            )}
            <ButtonWPermission
              className="sm:!block !hidden"
              codename="add_brand"
              type="primary"
              onClick={() => setIsAddBrandOpen(true)}
            >
              Add New Brand
            </ButtonWPermission>
          </div>
        </div>
        <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
          {paginatedBrands.map((brand, index) => (
            <CategoryWidget
              key={brand.slug}
              completeLink={`/brands/${brand.slug}`}
              editClick={() => {
                setIsEditBrandOpen(true);
                setSelectedBrandSlug(brand.slug);
              }}
              id={brand.sn}
              image={brand.brand_image.thumbnail || DEFAULT_RASAN_IMAGE}
              is_published={brand.is_published}
              selectedCategories={selectedBrands}
              setSelectedCategories={setSelectedBrands}
              slug={brand.slug}
              title={brand.name}
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

      {isAddBrandOpen && (
        <AddBrand
          closeModal={() => setIsAddBrandOpen(false)}
          isOpen={isAddBrandOpen}
          setPaginatedBrandsList={setPaginatedBrands}
        />
      )}

      {isEditBrandOpen && (
        <EditBrand
          closeModal={() => setIsEditBrandOpen(false)}
          isOpen={isEditBrandOpen}
          setPaginatedBrandsList={setPaginatedBrands}
          slug={selectedBrandSlug}
        />
      )}
    </>
  );
}

export default BrandsScreen;
