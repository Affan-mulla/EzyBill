import {  IconAtom, IconBook, IconCashRegister, IconLayoutDashboardFilled, IconSettings } from "@tabler/icons-react";
import React from "react";

export const items = [
  {
    icon: React.createElement(IconLayoutDashboardFilled),  // Using React.createElement
    route: "/",
    label: "Dashboard",
  },
  {
    icon: React.createElement(IconAtom),
    route: "/products",
    label: "Products",
  },
  {
    icon: React.createElement(IconBook),
    route: "/customer",
    label: "Customers",
  },
  {
    icon: React.createElement(IconCashRegister),
    route: "/billing",
    label: "Billing",
  },
  {
    icon: React.createElement(IconSettings),
    route: "/setting",
    label: "Setting",
  },
];
