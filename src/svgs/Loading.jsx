import React from "react";

function Loading() {
  return (
    <>
      <h1 className='text-center py-1 text-xl font-semibold font-["Tahoma"] text-[#00A0B0]'>
        Loading...
      </h1>
      {/* <img src='/loading.svg' className='w-24 my-5' alt='loading' /> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-24 my-5"
      >
        <circle cx="28" cy="75" r="11" fill="#00a0b0">
          <animate
            attributeName="fill-opacity"
            repeatCount="indefinite"
            dur="1s"
            values="0;1;1"
            keyTimes="0;0.2;1"
            begin="0s"
          ></animate>
        </circle>

        <path
          d="M28 47A28 28 0 0 1 56 75"
          fill="none"
          stroke="#00a0b0"
          strokeWidth="10"
        >
          <animate
            attributeName="stroke-opacity"
            repeatCount="indefinite"
            dur="1s"
            values="0;1;1"
            keyTimes="0;0.2;1"
            begin="0.1s"
          ></animate>
        </path>
        <path
          d="M28 25A50 50 0 0 1 78 75"
          fill="none"
          stroke="#00a0b0"
          strokeWidth="10"
        >
          <animate
            attributeName="stroke-opacity"
            repeatCount="indefinite"
            dur="1s"
            values="0;1;1"
            keyTimes="0;0.2;1"
            begin="0.2s"
          ></animate>
        </path>
      </svg>
      <p className='text-center text-sm font-["Tahoma"] text-[#00A0B0]'>
        This may take a while!
      </p>
    </>
  );
}

export default Loading;
