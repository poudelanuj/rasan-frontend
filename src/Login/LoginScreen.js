import React, { useContext } from 'react'
import { LoginContext } from './context/LoginContext'

import Login from './components/Login';
import Otp from './components/Otp';
import Loading from './components/Loading';
import Toast from './components/Toast';

import { useNavigate } from 'react-router-dom';

function LoginScreen() {
    const {loginState, loginDispatch} = useContext(LoginContext);
    const navigate = useNavigate();
    return (
        <>
            <div className='bg-[url(/public/log-in-bg.svg)] h-screen w-screen bg-cover bg-center flex justify-center items-center'>
                <div className='min-w-[20rem] min-h-[22rem] bg-white/[0.3] rounded-xl p-10 transition-all ease-out duration-300 relative flex justify-center items-center'>
                    {loginState.loginWidgetState === 'otp' && (
                        <button className='flex justify-center items-center py-1 px-5 rounded-xl bg-white/[0.3] absolute text-[#00A0B0] top-3 left-3 hover:bg-white/[0.5] transition' onClick={()=> loginDispatch({type: 'SET_LOGINW_STATE', payload: 'login'})}>
                            Back
                        </button>
                    )}
                    <form className='flex flex-col items-center h-full justify-around'>
                        {loginState.loginWidgetState === 'login' && (
                            <Login />
                        )}
                        {loginState.loginWidgetState === 'otp' && (
                            <Otp />
                        )}
                        {loginState.loginWidgetState === 'loading' && (
                            <Loading />
                        )}
                        {loginState.loginWidgetState === 'success' && (
                            navigate('/')
                        )}
                    </form>
                </div>
            </div>
            {loginState.showToast && (
            <Toast />
            )}
        </>
    )
}

export default LoginScreen