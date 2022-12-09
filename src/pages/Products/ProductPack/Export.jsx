import { useEffect, useState } from "react";
import { Checkbox, Modal, Switch } from "antd";
import { startCase } from "lodash";
import { getProductPackCSV } from "../../../api/products/productPack";

const JSONToCSV = (objArray) => {
  let csvrecord = Object.keys(objArray[0]).join(",") + "\n";
  objArray.forEach(function (jsonrecord) {
    csvrecord +=
      Object.values(jsonrecord)
        .map((record) =>
          Array.isArray(record) ? `"'${record.join("\n")}'"` : record
        )
        .join(",") + "\n";
  });

  return csvrecord;
};

const Export = ({ isOpen, closeModal, isPublished }) => {
  const fields = [
    "product_name",
    "product_sku_name",
    "brand_name",
    "category_name",
    "number_of_items",
    "price_per_piece",
    "mrp_per_piece",
  ];

  const [checkedFields, setCheckedFields] = useState(
    fields
      .map((field) => ({ [field]: true }))
      .reduce((prev, curr) => ({ ...prev, ...curr }))
  );

  const [inderminate, setInderminate] = useState(true);

  const handleChange = (name, isChecked) =>
    setCheckedFields((prev) => ({ ...prev, [name]: isChecked }));

  useEffect(() => {
    setInderminate(Object.values(checkedFields).every((value) => value));
  }, [checkedFields]);

  return (
    <Modal
      title="Select the necessary fields"
      visible={isOpen}
      onCancel={closeModal}
      onOk={async () => {
        const data = await getProductPackCSV({
          shouldPaginate: false,
          isPublished,
        });
        const blob = new Blob(
          [
            JSONToCSV(
              data.map((product) => {
                delete product["product_slug"];
                delete product["product_sku_slug"];
                delete product["brand_slug"];
                delete product["category_slug"];
                delete product["is_published"];

                Object.keys(checkedFields).forEach(
                  (key) => !checkedFields[key] && delete product[key]
                );

                return product;
              })
            ),
          ],
          {
            type: "text/csv;charset=utf-8;",
          }
        );
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "export.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        closeModal();
      }}
    >
      <div className="flex gap-2 items-center mb-4">
        <Switch
          checked={inderminate}
          disabled={inderminate}
          size="small"
          onChange={() => {
            setCheckedFields(
              fields
                .map((field) => ({ [field]: true }))
                .reduce((prev, curr) => ({ ...prev, ...curr }))
            );
            setInderminate(true);
          }}
        />
        <p className="m-0">Check All</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {fields.map((val) => (
          <div key={val} className="flex items-center gap-2">
            <Checkbox
              checked={checkedFields[val]}
              onChange={(event) => handleChange(val, event.target.checked)}
            />
            <p className="m-0">{startCase(val)}</p>
          </div>
        ))}
      </div>

      <p>
        *Note: If you want to reupload the CSV please upload with all the
        necessary fields
      </p>
    </Modal>
  );
};

export default Export;
