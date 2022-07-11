import { COMING_SOON_IMAGE } from "../../constants";

const Notifications = () => {
  return (
    <div className="py-5">
      <img
        alt="COMING SOON"
        className="rounded h-[80vh] w-full object-cover"
        src={COMING_SOON_IMAGE}
      />
    </div>
  );
};

export default Notifications;
