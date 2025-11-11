import { IconAtom, IconBook, IconCashRegister, IconLayoutDashboardFilled, IconSettings } from '@tabler/icons-react';

export const items = [
  {
    icon: IconLayoutDashboardFilled,
    route: '/',
    label: 'Dashboard',
  },
  {
    icon: IconAtom,
    route: '/products',
    label: 'Products',
  },
  {
    icon: IconBook,
    route: '/customer',
    label: 'Customers',
  },
  {
    icon: IconCashRegister,
    route: '/billing',
    label: 'Billing',
  },
  {
    icon: IconSettings,
    route: '/setting',
    label: 'Setting',
  },
];
