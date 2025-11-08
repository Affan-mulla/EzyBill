import { FloatingDock } from '@/components/ui/floating-dock'
import React from 'react'
import { items } from '@/Constants'
const Sidebar = () => {
  
  return (
    <FloatingDock items={items} desktopClassName={'w-fit'} mobileClassName={'ml-4'} />
  )
}

export default Sidebar

import { FloatingDock } from '@/components/ui/floating-dock'
import React from 'react'
import { items } from '@/Constants'

const Sidebar = () => {
  const dashboardItem = {
    label: 'Dashboard',
    href: '/dashboard',
    // Using an emoji as a simple placeholder icon. 
    // In a real application, this would be an actual icon component (e.g., from Lucide React or similar).
    icon: '📊' 
  };

  // Create a new array including all existing items plus the new dashboard item
  const allItems = [...items, dashboardItem];
  
  return (
    <FloatingDock items={allItems} desktopClassName={'w-fit'} mobileClassName={'ml-4'} />
  )
}

export default Sidebar