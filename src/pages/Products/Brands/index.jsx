import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { uniqBy } from "lodash";
import { Pagination, Select } from "antd";

import CategoryWidget from "../categories/shared/CategoryWidget";
import SearchBox from "../subComponents/SearchBox";

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
import Loader from "../../../shared/Loader";
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
  const pageSize = 20;
  const [paginatedBrands, setPaginatedBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const {
    data,
    status,
    refetch: refetchBrands,
    isRefetching,
  } = useQuery(
    [GET_PAGINATED_BRANDS, page.toString() + pageSize.toString()],
    () => getPaginatedBrands(page, pageSize)
  );

  useEffect(() => {
    if (data)
      setPaginatedBrands((prev) => uniqBy([...prev, ...data.results], "slug"));
  }, [data]);

  useEffect(() => {
    refetchBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

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
      {(status === "loading" || isRefetching) && <Loader isOpen />}

      {openAlert && renderAlert()}
      <CustomPageHeader title="Brands" isBasicHeader />

      <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
        <div className="flex justify-between mb-3">
          <SearchBox placeholder="Search Brands..." />
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
                <Option value={ALERT_TYPE.publish}>Publish</Option>
                <Option value={ALERT_TYPE.unpublish}>Unpublish</Option>
                <Option value={ALERT_TYPE.delete}>Delete</Option>
              </Select>
            )}
            <ButtonWPermission
              codeName="add_brand"
              type="primary"
              onClick={() => setIsAddBrandOpen(true)}
            >
              Add New Brand
            </ButtonWPermission>
          </div>
        </div>
        <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
          {paginatedBrands
            .filter((item, index) => {
              const initPage = (page - 1) * pageSize;
              const endPage = page * pageSize;
              if (index >= initPage && index < endPage) return true;
              return false;
            })
            .map((brand, index) => (
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
            onChange={(page, pageSize) => {
              setPage(page);
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
