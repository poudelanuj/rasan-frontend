import { Avatar, Card } from "antd";
import { colors, DEFAULT_CARD_IMAGE } from "../../../constants";

const WelcomeCard = ({ title, contact, group, avatar }) => {
  return (
    <Card
      bodyStyle={{ paddingBottom: 50 }}
      className="w-[300px] !rounded-lg"
      headStyle={{
        backgroundColor: colors.primary,
        borderTopRightRadius: "8px",
        borderTopLeftRadius: "8px",
      }}
      title={<div className="text-gray-50 ml-20">{title}</div>}
    >
      <div className="absolute bottom-[180px] p-1 bg-gray-100 rounded-full w-fit">
        <Avatar size={60} src={avatar || DEFAULT_CARD_IMAGE} />
      </div>

      <div className="relative top-10 bg-gray-50 rounded p-2 px-4">
        <div>
          <small className="text-gray-400">Contact</small>
          <div className="text-gray-700 font-medium">{contact}</div>
        </div>
        <div className="mt-4">
          <small className="text-gray-400">Group</small>
          <div className="text-gray-700 font-medium">{group}</div>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;
