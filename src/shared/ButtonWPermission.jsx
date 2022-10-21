import { Button } from "antd";
import { isEmpty } from "lodash";
import { useAuth } from "../AuthProvider";

const ButtonWPermission = (props) => {
  const { permissions } = useAuth();

  const { codename: codeName, children, disabled } = props;

  return (
    <Button
      {...props}
      disabled={
        (permissions &&
          isEmpty(
            permissions.filter(({ codename }) => codename === codeName)
          )) ||
        disabled
      }
    >
      {children}
    </Button>
  );
};

export default ButtonWPermission;
