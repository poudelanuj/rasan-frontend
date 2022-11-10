import React from "react";

function ClearSelection({ selectedCategories, setSelectedCategories }) {
  return (
    <>
      {selectedCategories.length > 0 && (
        <button
          className="w-fit text-[#00A0B0] font-normal border-[1px] border-[#00A0B0] hover:bg-[#00A0B0] hover:text-white py-1 px-4 rounded-md flex items-center justify-between mr-[1rem] transition-colors"
          onClick={() => setSelectedCategories([])}
        >
          Clear Selection
        </button>
      )}
    </>
  );
}

export default ClearSelection;
