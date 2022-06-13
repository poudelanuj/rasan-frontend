import React, { useState } from 'react';
import {
  UploadOutlined,
  MinusOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { addCategory, publishCategory } from '../context/CategoryContext';
import { useMutation, useQueryClient } from "react-query";

function AddCategory() {
  const navigate = useNavigate();
  const [dropState, setDropState] = useState('none');
  const [formState, setFormState] = useState({
    name: '',
    name_np: '',
    image: '',
  });
  const queryClient = useQueryClient();
  const form = document.getElementById('category-upload-file');

  const { mutate: addCategoryMutate, isLoading: addCategoryIsLoading, isError: addCategoryIsError, error: addCategoryError, data: addCategoryResponseData } = useMutation(addCategory, {
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries("get-categories");
    },
    onError: (data) => {
      console.log(data);
    },
  });

  const { mutate: publishCategoryMutate, isLoading: publishCategoryIsLoading, isError: publishCategoryIsError, error: publishCategoryError } = useMutation(publishCategory, {
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries("get-categories");
      navigate('/category-list');
    }
  });


  const handleBrowseClick = () => {
    form.click();
  }
  const closeAddCategories = () => {
    navigate('/category-list');
  }
  const handleDragEnter = () => {
    setDropState('enter');
  }
  const handleDragLeave = () => {
    setDropState('leave');
  }
  const handleDrop = (e) => {
    setDropState('drop');
  }
  const handleImageChange = (e) => {
    // get the file object as url
    console.log('Handling...');
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (file) {
        setFormState({
          ...formState,
          image: e.target.result,
        });
      } else {
        setFormState({
          ...formState,
          image: '',
        });
      }
    }
    reader.readAsDataURL(file);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave();
  }
  const handleSave = async () => {
    let form_data = new FormData();
    form_data.append('name', formState.name);
    form_data.append('name_np', formState.name_np);
    form_data.append('image', form.files[0]);
    addCategoryMutate({form_data});
  }
  const handlePublish = async () => {
    await handleSave();
    console.log(addCategoryResponseData);
    const slug = addCategoryResponseData?.data?.data?.slug;
    console.log(addCategoryResponseData?.data);
    console.log(slug);
    publishCategoryMutate({slug});
    // publishCategoryMutate(formState);
  }

  return (
    <>
      <div className='fixed top-0 left-0 h-screen w-full bg-[#03022920] animate-popupopen' onClick={() => closeAddCategories()}>
      </div>
      <div className='min-w-[36.25rem] min-h-[33.5rem] fixed z-[1] top-[50%] right-[50%] translate-x-[50%] translate-y-[-50%] bg-white rounded-[10px] flex flex-col p-8 shadow-[-14px_30px_20px_rgba(0,0,0,0.05)] overflow-hidden'>
        <h2 className='text-3xl mb-3 text-[#192638] text-[2rem] font-medium'>Add Category</h2>
        {(addCategoryIsLoading || publishCategoryIsLoading) &&
        <div className='absolute top-0 right-0 bg-black/25 w-full h-full flex flex-col items-center justify-center z-50 animate-popupopen'>
          <LoadingOutlined style={{color: 'white', fontSize:'3rem'}} />
          <span className='p-2 text-white'>
            Loading...
          </span>
        </div>
        }
        <form className='flex flex-col justify-between flex-1' onSubmit={handleSubmit}>
          <div className='grid gap-[1rem] grid-cols-[100%]'>
            <div className={`flex flex-col items-center justify-center min-h-[10rem] bg-[#FBFCFF] border-[1px] border-dashed border-[#D0D7E2] rounded-[15px] ${dropState === 'drop' && 'shadow-[0px_0px_20px_rgba(0,0,0,0.5)]'}`} id='drop-file-here'>
              {formState.image.length > 0 ?
                <>
                  <img src={formState.image} className='max-h-[6rem] mx-auto' />
                  <span className='text-center text-2xl text-[#374253] text-[13px] font-normal'>
                    <MinusOutlined style={{ verticalAlign: 'text-bottom', }} /> Click to
                    <span className='text-blue-500 cursor-pointer' onClick={() => handleBrowseClick()}> change</span>
                  </span>
                </>
                :
                <>
                  <img src='/gallery-icon.svg' alt='gallery' className='w-fit mx-auto' />
                  <span className='text-center text-2xl text-[#374253] text-[13px] font-normal'>
                    <UploadOutlined style={{ verticalAlign: 'text-bottom', }} /> Drop your images here, or
                    <span className='text-blue-500 cursor-pointer' onClick={() => handleBrowseClick()}> browse</span>
                  </span>
                </>
              }
            </div>
            <input type='file' id='category-upload-file' className='hidden' onChange={handleImageChange} />
            <div className='flex flex-col'>
              <label htmlFor='name' className='mb-1'>Category Name</label>
              <input type='text' id='name' className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]" placeholder='Eg. Rice' value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} />
            </div>
            <div className='flex flex-col'>
              <div className='flex'>
                <label htmlFor='name' className='mb-1'>Category Name (In Nepali)</label>
                <img src='/flag_nepal.svg' alt='nepali' className='w-[0.8rem] ml-2' />
              </div>
              <input type='text' id='name' className=" bg-[#FFFFFF] border-[1px] border-[#D9D9D9] rounded-[2px] p-[8px_12px]" placeholder='Eg. चामल' value={formState.name_np} onChange={(e) => setFormState({ ...formState, name_np: e.target.value })} />
            </div>
          </div>
          <div className='flex justify-end'>
            <button type='button' onClick={async (e) => {
              await handleSave(e);
              return navigate('/category-list');
              }} className='text-[#00B0C2] p-[8px_12px] min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#effdff] transition-colors'>Save</button>
            <button type='button' onClick={handlePublish} className='bg-[#00B0C2] text-white p-[8px_12px] ml-5 min-w-[5rem] rounded-[4px] border-[1px] border-[#00B0C2] hover:bg-[#12919f] transition-colors'>Publish Category</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default AddCategory