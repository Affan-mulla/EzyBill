import { FloatingDock } from '@/components/ui/floating-dock'
import React from 'react'
import { items } from '@/Constants'
const Sidebar = () => {
  
  return (
    <FloatingDock items={items} desktopClassName={'w-fit'} mobileClassName={'ml-4'} />
  )
}

export default Sidebar