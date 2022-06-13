import React from 'react'
import {
    SearchOutlined,
  } from "@ant-design/icons";

function SearchBox({placeholder}) {
    return (
        <div className="py-[3px] px-3 min-w-[18rem] border-[1px] border-[#D9D9D9] rounded-lg flex items-center justify-between">
            <SearchOutlined style={{ color: "#D9D9D9" }} />
            <input type="text" placeholder={placeholder} className="w-full ml-1 placeholder:text-[#D9D9D9]" />
        </div>
    )
}

export default SearchBox