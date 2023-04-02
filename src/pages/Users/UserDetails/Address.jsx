import { useState } from "react";
import { Button } from "antd";

import AddressCreationForm from "./Components/AddressCreationForm";
import AddressForm from "./Components/AddressForm";

export default function UserAddress({ user }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col p-4">
      <span className="text-gray-700 text-xl m-4">Addresses</span>

      <div className="grid grid-cols-2 gap-20 detail-form border p-10 border-primary flex-col">
        {user?.addresses.map((address) => {
          return (
            <AddressForm key={address.id} address={address} id={user.id} />
          );
        })}

        <div className="col-span-full">
          <Button
            className="bg-primary w-full text-lg"
            type="primary"
            onClick={() => {
              setVisible(true);
            }}
          >
            New Address
          </Button>

          <AddressCreationForm
            id={user.id}
            visible={visible}
            onCancel={() => {
              setVisible(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
