import LoginScreen from "./LoginScreen";

import { LoginContextProvider } from "./context/LoginContext";

function LoginApp() {
  return (
    <LoginContextProvider>
      <LoginScreen />
    </LoginContextProvider>
  );
}

export default LoginApp;
