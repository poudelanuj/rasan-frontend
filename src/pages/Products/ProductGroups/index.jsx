import { Pagination, Select } from "antd";
import React, { useEffect, useState } from "react";
import { uniqBy } from "lodash";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation } from "react-router-dom";
import {
  deleteProductGroup,
  publishProductGroup,
  unpublishProductGroup,
} from "../../../context/CategoryContext";
import SimpleAlert from "../alerts/SimpleAlert";
import CategoryWidget from "../categories/shared/CategoryWidget";
import AddProductGroup from "./AddProductGroup";
import AddCategoryButton from "../subComponents/AddCategoryButton";
import ClearSelection from "../subComponents/ClearSelection";
import SearchBox from "../subComponents/SearchBox";
import {
  openErrorNotification,
  openSuccessNotification,
} from "../../../utils/openNotification";
import { DEFAULT_RASAN_IMAGE } from "../../../constants";
import { getPaginatedProductGroups } from "../../../api/products/productGroups";
import { GET_PAGINATED_PRODUCT_GROUPS } from "../../../constants/queryKeys";
import Loader from "../../../shared/Loader";
import CustomPageHeader from "../../../shared/PageHeader";

const { Option } = Select;

function ProductGroupsScreen() {
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
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [paginatedProductGroups, setPaginatedProductGroups] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

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
    if (data)
      setPaginatedProductGroups((prev) =>
        uniqBy([...prev, ...data.results], "slug")
      );
  }, [data]);

  useEffect(() => {
    refetchProductGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const location = useLocation();
  let extraSlug;
  try {
    extraSlug = location.pathname.split("/")[2];
  } catch (error) {
    extraSlug = null;
  }
  const { mutate: publishProductGroupMutate } = useMutation(
    publishProductGroup,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("get-product-groups");
        openSuccessNotification(
          data?.data?.message || "Rasan Choice published successfully"
        );
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );
  const { mutate: unpublishProductGroupMutate } = useMutation(
    unpublishProductGroup,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries("get-product-groups");
        openSuccessNotification(
          data?.data?.message || "Rasan Choice unpublished successfully"
        );
      },
      onError: (err) => {
        openErrorNotification(err);
      },
    }
  );
  const { mutate: deleteProductGroupMutate } = useMutation(deleteProductGroup, {
    onSuccess: (data) => {
      queryClient.invalidateQueries("get-product-groups");
      openSuccessNotification(
        data?.data?.message || "Rasan Choice deleted successfully"
      );
    },
    onError: (err) => {
      openErrorNotification(err);
    },
  });

  const handleBulkPublish = () => {
    selectedProducts.forEach(async (product) => {
      publishProductGroupMutate({ slug: product.slug });
    });
    setSelectedProducts([]);
  };
  const handleBulkUnpublish = () => {
    selectedProducts.forEach(async (product) => {
      unpublishProductGroupMutate({ slug: product.slug });
    });
    setSelectedProducts([]);
  };
  const handleBulkDelete = () => {
    selectedProducts.forEach((product) => {
      deleteProductGroupMutate({ slug: product.slug });
    });
    setSelectedProducts([]);
  };

  const handleBulkAction = (event) => {
    const action = event;
    switch (action) {
      case "publish":
        setAlert({
          show: true,
          title: "Publish Selected Rasan Choices?",
          text: "Are you sure you want to publish selected Rasan Choices?",
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
          title: "Unpublish Selected Rasan Choices?",
          text: "Are you sure you want to unpublish selected Rasan Choices?",
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
          title: "Delete Selected Rasan Choices?",
          text: "Are you sure you want to delete selected Rasan Choices?",
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
      {extraSlug === "add" && (
        <AddProductGroup alert={alert} setAlert={setAlert} />
      )}
      {(status === "loading" || isRefetching) && <Loader isOpen />}

      <div>
        <CustomPageHeader title="Rasan Choices" isBasicHeader />

        <div className="flex flex-col bg-white p-6 rounded-[8.6333px] min-h-[75vh]">
          <div className="flex justify-between mb-3">
            <SearchBox placeholder="Search Brands..." />
            <div className="flex">
              <ClearSelection
                selectedCategories={selectedProducts}
                setSelectedCategories={setSelectedProducts}
              />
              {selectedProducts.length > 0 && (
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
              <AddCategoryButton linkText="Add Rasan Choice" linkTo="add" />
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
                  editLink={`/product-groups/${group.slug}/edit`}
                  id={group.slug}
                  image={
                    group.product_group_image.thumbnail || DEFAULT_RASAN_IMAGE
                  }
                  imgClassName=""
                  is_published={group.is_published}
                  selectedCategories={selectedProducts}
                  setSelectedCategories={setSelectedProducts}
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
      </div>
    </>
  );
}

export default ProductGroupsScreen;
