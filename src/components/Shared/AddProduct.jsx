import React, { useState } from 'react'
import AddProductForm from './Product/AddProductForm'
const AddProduct = () => {

  return (
    <div className='dark:bg-neutral-950 h-full md:px-[100px] p-5'>
      <AddProductForm action={"new"}/>
    </div>
  );
};

export default AddProduct;
