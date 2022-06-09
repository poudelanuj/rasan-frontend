import React, {useContext} from 'react'
import {MdOutlineTextsms} from 'react-icons/md';

import { LoginContext } from '../context/LoginContext';

function Otp({loginObject}) {
    const {verifyOtp, loginState, loginDispatch} = useContext(LoginContext);
    return (
        <>
            <h1 className='text-center py-1 text-xl font-semibold font-["Tahoma"] text-[#00A0B0]'>Type your  OTP</h1>
            <svg className='w-16 my-5' viewBox='0 0 93.22 122.88'>
                <use href='#otp-svg' />
            </svg>
            <div className='bg-white border-b-2 my-5 border-[#00A0B0] p-2 rounded-lg flex items-center justify-between'>
                <div className='mr-2 cursor-pointer'>
                    <MdOutlineTextsms />
                </div>
                <input className='w-full py-1 px-2 outline-[#00A0B0]' type='text' placeholder='XXXXXX' value={loginState.otp} onChange={(e)=> loginDispatch({type: 'SET_OTP', payload: e.target.value})} />
            </div>
            <button className='bg-[#00A0B0] text-white py-1 px-5 rounded-md transition text-base hover:bg-[#008A97]' onClick={ async () => {
                if (loginState.otp.length === 6) {
                    loginDispatch({ type: 'SET_LOGINW_STATE', payload: 'loading' })
                    // post otp await request to server
                    console.log(loginState.otp, `+977-${loginState.phoneNumber}`);
                    await verifyOtp(loginState.phoneNumber, loginState.otp);

                } else {
                    loginDispatch({ type: 'SET_TOAST', payload: {showToast: true, toastMessage: 'OTP must be atleast 6 digits long!', toastType: 'error', toastHeading: 'Error'} });
                }
                }} type='button'>
                Verify
            </button>
            <svg viewBox='0 0 24 24' className='hidden'>
                <symbol id='otp-svg' viewBox='0 0 93.22 122.88'>
                <title>otp</title><path style={{fillRule:'evenodd', fill:'#00A0B0'}} d="M12.71,0h43A12.74,12.74,0,0,1,68.43,12.71V31.52H64.78V16H3.66v89.07H64.79V95.22l3.65-3v17.93a12.74,12.74,0,0,1-12.71,12.71h-43A12.74,12.74,0,0,1,0,110.17V12.71A12.74,12.74,0,0,1,12.71,0ZM36.4,52a1.85,1.85,0,0,1,3.69,0v2.38l2-1.32a1.83,1.83,0,1,1,2,3l-2.54,1.71,2.55,1.69a1.84,1.84,0,0,1-2,3.06l-2-1.32v2.39a1.85,1.85,0,0,1-3.69,0V61.27l-2,1.32a1.83,1.83,0,1,1-2-3.05l2.55-1.7-2.55-1.7a1.83,1.83,0,1,1,2-3.06l2,1.32V52Zm38.73,0a1.84,1.84,0,0,1,3.68,0v2.38l2-1.32a1.83,1.83,0,0,1,2,3l-2.55,1.71,2.55,1.69a1.84,1.84,0,1,1-2,3.06l-2-1.32v2.39a1.84,1.84,0,1,1-3.68,0V61.27l-2,1.32a1.84,1.84,0,1,1-2-3.05l2.55-1.7-2.55-1.7a1.84,1.84,0,1,1,2-3.06l2,1.32V52ZM55.77,52a1.84,1.84,0,0,1,3.68,0v2.38l2-1.32a1.84,1.84,0,0,1,2,3l-2.55,1.71,2.55,1.69a1.84,1.84,0,1,1-2,3.06l-2-1.32v2.39a1.84,1.84,0,0,1-3.68,0V61.27l-2,1.32a1.83,1.83,0,0,1-2-3.05l2.55-1.7-2.55-1.7a1.84,1.84,0,1,1,2-3.06l2,1.32V52ZM26.55,39.11H88.17a5.08,5.08,0,0,1,5,5.06V71.24a5.26,5.26,0,0,1-5,5.26H66.53C61,83.51,53.79,87.73,45.27,90a1.89,1.89,0,0,1-1.88-.56,1.86,1.86,0,0,1,.15-2.64,20.35,20.35,0,0,0,2.74-2.9,25.27,25.27,0,0,0,3.45-7.6H26.55a5.09,5.09,0,0,1-5.06-5.06V44.17a5.07,5.07,0,0,1,5.06-5.06ZM34.22,109A5.21,5.21,0,1,1,29,114.25,5.22,5.22,0,0,1,34.22,109Z"/>
                </symbol>
            </svg>

        </>
    )
}

export default Otp