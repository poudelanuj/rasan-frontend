import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginContextProvider from './LoginContextProvider'
import LoginScreen from './LoginScreen'

function LoginApp() {
    // check if user is logged in
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('auth_token')) {
            navigate('/');
        }
    }, [])
    return (
        <LoginContextProvider>
            <LoginScreen />
        </LoginContextProvider>
    )
}

export default LoginApp