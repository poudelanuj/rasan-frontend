import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useLocation, useParams } from "react-router-dom";
import { Pagination, Select } from "antd";
import {
  deleteBrand,
  getBrands,
  publishBrand,
  unpublishBrand,
} from "../../context/CategoryContext";
import AddBrand from "./Brands/AddBrand";
import EditBrand from "./Brands/EditBrand";
import CategoryWidget from "./CategoryWidget";
import AddCategoryButton from "./subComponents/AddCategoryButton";
import Header from "./subComponents/Header";
import SearchBox from "./subComponents/SearchBox";

import SimpleAlert from "./alerts/SimpleAlert";
import ClearSelection from "./subComponents/ClearSelection";
import Loader from "./subComponents/Loader";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../utils/openNotification";
import { DEFAULT_CARD_IMAGE } from "../../constants";

const { Option } = Select;

function BrandsScreen() {
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    text: "",
    type: "",
    primaryButton: "",
    secondaryButton: "",
    image: "",
    action: "",
    actionOn: "",
    icon: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const { data, isLoading } = useQuery(
    "get-brands",
    () => getBrands({ currentPage }),
    {
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );

  const queryClient = useQueryClient();
  const { slug } = useParams();

  const { mutate: publishCategoryMutate } = useMutation(publishBrand, {
    onSuccess: (data) => {
      openSuccessNotification(
        data?.data?.message || "Brand published successfully"
      );
      queryClient.invalidateQueries("get-brands");
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });
  const { mutate: unpublishCategoryMutate } = useMutation(unpublishBrand, {
    onSuccess: (data) => {
      openSuccessNotification(
        data?.data?.message || "Brand unpublished successfully"
      );
      queryClient.invalidateQueries("get-brands");
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });
  const { mutate: deleteMutate } = useMutation(deleteBrand, {
    onSuccess: (data) => {
      openSuccessNotification(
        data?.data?.message || "Brand deleted successfully"
      );
      queryClient.invalidateQueries("get-brands");
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  const location = useLocation();
  let brandSlug;
  try {
    brandSlug = location.pathname.split("/")[2];
  } catch (error) {
    brandSlug = null;
  }

  const paginate = async (page) => {
    setCurrentPage(page);
  };

  const brands = data?.data?.data?.results;

  const handleBulkPublish = () => {
    selectedBrands.forEach(async (category) => {
      publishCategoryMutate({ slug: category.slug });
      openSuccessNotification(`${category.name} published`);
    });
    setSelectedBrands([]);
  };
  const handleBulkUnpublish = () => {
    selectedBrands.forEach(async (category) => {
      unpublishCategoryMutate({ slug: category.slug });
      openSuccessNotification(`${category.name} unpublished`);
    });
    setSelectedBrands([]);
  };
  const handleBulkDelete = () => {
    selectedBrands.forEach((category) => {
      deleteMutate({ slug: category.slug });
    });
    setSelectedBrands([]);
  };

  const handleBulkAction = (event) => {
    const action = event;
    switch (action) {
      case "publish":
        setAlert({
          show: true,
          title: "Publish Selected Brands?",
          text: "Are you sure you want to publish selected Brands?",
          type: "info",
          primaryButton: "Publish Selected",
          secondaryButton: "Cancel",
          image: "/publish-icon.svg",
          action: async () => handleBulkPublish(),
        });
        break;
      case "unpublish":
        setAlert({
          show: true,
          title: "Unpublish Selected Brands?",
          text: "Are you sure you want to unpublish selected Brands?",
          type: "warning",
          primaryButton: "Unpublish Selected",
          secondaryButton: "Cancel",
          image: "/unpublish-icon.svg",
          action: async () => handleBulkUnpublish(),
        });
        break;
      case "delete":
        setAlert({
          show: true,
          title: "Delete Selected Brands?",
          text: "Are you sure you want to delete selected Brands?",
          type: "danger",
          primaryButton: "Delete Selected",
          secondaryButton: "Cancel",
          image: "/delete-icon.svg",
          action: async () => handleBulkDelete(),
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      {alert.show && (
        <SimpleAlert
          action={alert.action}
          alert={alert}
          icon={alert.icon}
          image={alert.image}
          primaryButton={alert.primaryButton}
          secondaryButton={alert.secondaryButton}
          setAlert={setAlert}
          text={alert.text}
          title={alert.title}
          type={alert.type}
        />
      )}
      <div>
        <Header title="Brands" />
        {isLoading && <Loader loadingText={"Loading Brands..."} />}
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
                  onChange={handleBulkAction}
                >
                  <Option value="publish">Publish</Option>
                  <Option value="unpublish">Unpublish</Option>
                  <Option value="delete">Delete</Option>
                </Select>
              )}
              <AddCategoryButton linkText="Add Brand" linkTo="add" />
            </div>
          </div>
          <div className="grid gap-8 grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))]">
            {brands &&
              brands.map((brand, index) => (
                <CategoryWidget
                  key={brand.slug}
                  completeLink={`/brands/${brand.slug}`}
                  editLink={`/brands/edit/${brand.slug}`}
                  id={brand.sn}
                  image={
                    brand.brand_image.full_size ||
                    brand.brand_image.medium_square_crop ||
                    brand.brand_image.small_square_crop ||
                    brand.brand_image.thumbnail ||
                    DEFAULT_CARD_IMAGE
                  }
                  is_published={brand.is_published}
                  selectedCategories={selectedBrands}
                  setSelectedCategories={setSelectedBrands}
                  slug={brand.slug}
                  title={brand.name}
                />
              ))}
          </div>
          <Pagination
            pageSize={10}
            showTotal={(total) => `Total ${total} items`}
            style={{
              marginTop: "1rem",
              alignSelf: "end",
            }}
            total={data?.data?.data?.count}
            hideOnSinglePage
            showQuickJumper
            onChange={async (page) => paginate(page)}
          />
        </div>
      </div>
      {brandSlug === "add" && <AddBrand alert={alert} setAlert={setAlert} />}
      {brandSlug === "edit" && (
        <EditBrand alert={alert} setAlert={setAlert} slug={slug} />
      )}
    </>
  );
}

export default BrandsScreen;
