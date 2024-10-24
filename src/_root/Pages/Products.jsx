import DemoPage from '@/components/Shared/Product/Page'
import ProfileNotify from '@/components/Shared/ProfileNotify'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { IconCircleDashedPlus, IconCirclePlus, IconCirclePlus2, IconFileExport, IconFilter, IconPlus } from '@tabler/icons-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Products = () => {
  return (
    <div className='min-h-screen h-full flex md:px-8 px-4 py-4 w-full dark:bg-neutral-950   flex-col gap-4 '>
      <div className=' flex md:justify-between w-full gap-4 items-center'>
        
        <ProfileNotify className={'w-[70px] md:w-[50px]'}/>
        <div className='flex w-full gap-3 justify-end items-center h-fit'>
          <Link to={`/add-product`}>
            <Button variant='default' className='py-0 md:px-4 px-2' size='sm'><IconCircleDashedPlus className='mr-2'/> Add Product</Button>
          </Link>
        </div>
      </div>

      <div className='flex flex-col h-auto gap-4 '>
        
        <Card className=' h-full px-4 py-2 rounded-md border-[1px] flex flex-col '>
            <div>
              <h1 className='text-2xl font-semibold -tracking-tight md:text-3xl dark:text-zinc-50'>Products</h1>
              <p className='dark:text-zinc-300 '>Manage your products and keep track of stocks.</p>
            </div>
            <div>
              <DemoPage />
            </div>
        </Card>
      </div>

    </div>
  )
}

export default Products