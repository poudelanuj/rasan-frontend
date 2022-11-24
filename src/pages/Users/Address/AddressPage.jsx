import { useState } from "react";
import { Button, Collapse, Tree, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useQuery } from "react-query";
import { getAddresses } from "../../../api/userAddresses";
import { GET_ADDRESSES } from "../../../constants/queryKeys";
import CreateAddress from "./components/CreateAddress";

const AddressPage = () => {
  const [isCreateAddressOpen, setIsCreateAddressOpen] = useState(false);

  const { data: addressList } = useQuery({
    queryFn: getAddresses,
    queryKey: [GET_ADDRESSES],
  });

  const addressTree = addressList?.map((province) => ({
    title: province.name,
    key: province.name,
    id: province.id,
    children: province.cities?.map((city) => ({
      title: city.name,
      key: city.name,
      id: city.id,
      children: city.areas?.map((area) => ({
        title: area.name,
        key: area.name,
        id: area.id,
      })),
    })),
  }));

  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-fit"
        type="primary"
        ghost
        onClick={() => setIsCreateAddressOpen(true)}
      >
        Add New Address
      </Button>

      {addressTree &&
        addressTree.map((province) => (
          <Collapse key={province.key}>
            <Collapse.Panel key={province.key} header={province.title}>
              {province.children.map((city) => (
                <Collapse key={city.key}>
                  <Collapse.Panel key={city.key} header={city.title}>
                    {city.children.map((area, index) => (
                      <p key={area.key}>{`${index}.  ${area.title}`}</p>
                    ))}
                  </Collapse.Panel>
                </Collapse>
              ))}
            </Collapse.Panel>
          </Collapse>
        ))}

      <Divider className="!my-2" />

      {addressTree && (
        <Tree
          switcherIcon={<DownOutlined />}
          treeData={addressTree}
          defaultExpandAll
          showLine
        />
      )}

      <CreateAddress
        isCreateAddressOpen={isCreateAddressOpen}
        setIsCreateAddressOpen={setIsCreateAddressOpen}
      />
    </div>
  );
};

export default AddressPage;
