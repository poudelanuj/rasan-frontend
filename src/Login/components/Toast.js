import React from 'react'
import {MdOutlineClose} from 'react-icons/md'

function Toast({message, heading, type, loginObject}) {
    const {loginState, loginDispatch} = loginObject;
  return (
    <div className={'fixed right-4 bottom-4 w-80 min-h-[7rem] shadow-lg rounded-lg text-white animate-[toast_0.2s_ease-out_1] ' + ((type==='error' && 'bg-[#E74C3C]') || (type==='info' && 'bg-[#008A97]') || (type==='success' && 'bg-[#2ECC71]'))}>
        <div className='flex items-center justify-between px-2 py-1 border-b-2 border-gray-50/40'>
            <h3 className='font-normal text-white'>{heading}</h3>
            <button className='flex items-center justify-center p-1 rounded-full hover:bg-white/[0.1] transition text-white' onClick={()=> loginDispatch({type: 'SET_TOAST', payload: {showToast: false}})}>
                <MdOutlineClose />
            </button>
        </div>
        <div className='px-2 py-1'>
            {message}
        </div>
        {/* {type} */}
    </div>
  )
}

export default Toast