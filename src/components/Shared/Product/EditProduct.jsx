import React from 'react'
import AddProductForm from './AddProductForm'
import { useGetProduct, useGetProductById } from '@/lib/Query/queryMutation'
import { useParams } from 'react-router-dom'
import Loader from '@/components/ui/Loader'

const EditProduct = () => {
    const {id} = useParams();
   
    const {data,isLoading} = useGetProductById(id);
    
    
    
  return (
    <div className='bg-zinc-50 dark:bg-neutral-900 h-full md:px-[100px] p-5'>
      {isLoading ? (
        <Loader/>
      ) : (
        <AddProductForm action={"edit"} currentData={data} />
      )}
    </div>
  )
}

export default EditProduct