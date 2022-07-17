import { Card } from "antd";
import { colors } from "../../../constants";

const MetricsCard = ({ title, content }) => {
  return (
    <Card
      bodyStyle={{
        padding: 10,
        backgroundColor: colors.light,
        borderRadius: 4,
        minWidth: 180,
      }}
      bordered={false}
      className="grow"
    >
      <small className="text-gray-500">{title}</small>
      <h4 className="text-xl">{content || 0}</h4>
    </Card>
  );
};

export default MetricsCard;
