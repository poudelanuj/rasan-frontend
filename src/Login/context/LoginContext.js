import axios from "axios";
import { createLoginContext } from "./createLoginContext";

const loginReducer = (state, action) => {
    switch (action.type) {
        case "SET_PHONE_NUMBER":
            // check if phone number is numeric
            if (!isNaN(action.payload) && action.payload.length <= 10) {
                return {
                    ...state,
                    phoneNumber: action.payload,
                };
            }
            return state;
        case "SET_OTP":
            return {
                ...state,
                otp: action.payload,
            };
        case "SET_IS_LOGGED_IN":
            return {
                ...state,
                isLoggedIn: action.payload,
            };
        case "SET_LOGINW_STATE":
            return {
                ...state,
                loginWidgetState: action.payload,
            };
        case "SET_TOAST":
            return {
                ...state,
                showToast: action.payload.showToast,
                toastMessage: action.payload.toastMessage,
                toastHeading: action.payload.toastHeading,
                toastType: action.payload.toastType,
            };
        default:
            return state;
    }
};

const initialState = {
    phoneNumber: "",
    otp: "",
    loginWidgetState: "login", // login, otp, loading
    showToast: false,
    toastMessage: "",
    toastHeading: "",
    toastType: "",
};

const verifyOtp = (loginDispatch) => async (phone, pin) => {
    await axios.post('/api/auth/login/', {
        phone: `+977-${phone}`,
        pin,
    })
        .then(res => {
            console.log(res);
            if (res.data.success) {
                localStorage.setItem('auth_token', res.data.data.token);
                loginDispatch({ type: 'SET_LOGINW_STATE', payload: 'success' })
            } else {
                loginDispatch({ type: 'SET_LOGINW_STATE', payload: 'otp' })
                loginDispatch({ type: 'SET_TOAST', payload: { showToast: true, toastMessage: res.data.message, toastType: 'error', toastHeading: 'Error' } });
            }
        })
        .catch(err => {
            console.log(err);
            loginDispatch({ type: 'SET_TOAST', payload: { showToast: true, toastMessage: (err.response.data && err.response.data.message && err.response.data.message) || (err.message && err.message) || ('Something went wrong. OTP wasn\'t verified!'), toastType: 'error', toastHeading: 'Error' } });
            loginDispatch({ type: 'SET_LOGINW_STATE', payload: 'otp' })
        })
}

const getOtp = (loginDispatch) => async (phone) => {
    await axios
        .post("/api/auth/request/", {
            phone: `+977-${phone}`,
        })
        .then((res) => {
            console.log(res);
            if (res.data.success) {
                loginDispatch({
                    type: "SET_TOAST",
                    payload: {
                        showToast: true,
                        toastType: "success",
                        toastMessage: res.data.message,
                        toastHeading: "Success",
                    },
                });
                loginDispatch({ type: "SET_LOGINW_STATE", payload: "otp" });
            } else {
                loginDispatch({
                    type: "SET_TOAST",
                    payload: {
                        showToast: true,
                        toastType: "error",
                        toastHeading: res.data.message,
                        toastMessage: res.data.errors.map((error) => {
                            return error[0];
                        }),
                    },
                });
                loginDispatch({ type: "SET_LOGINW_STATE", payload: "login" });
            }
        })
        .catch((err) => {
            console.log(err);
            loginDispatch({
                type: "SET_TOAST",
                payload: {
                    showToast: true,
                    toastMessage:
                        (err.response.data &&
                            err.response.data.message &&
                            err.response.data.message) ||
                        (err.message && err.message) ||
                        "Something went wrong. OTP wasn't sent!",
                    toastType: "error",
                    toastHeading: "Error",
                },
            });
            loginDispatch({ type: "SET_LOGINW_STATE", payload: "login" });
        });
}


export const { LoginContext, LoginContextProvider } = createLoginContext(
    loginReducer,
    { verifyOtp, getOtp }, // actions
    initialState,
);