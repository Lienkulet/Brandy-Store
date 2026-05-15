import OverviewIcon from "@/components/icons/OverviewIcon";
import OrderIcon from "@/components/icons/OrderIcon";
import ProductsIcon from "@/components/icons/ProductsIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";

export type NavItem = {
  href:  string;
  label: string;
  Icon:  React.ComponentType;
};

export const NAV: NavItem[] = [
  { href: "/admin/overview", label: "Overview", Icon: OverviewIcon },
  { href: "/admin/orders",   label: "Orders",   Icon: OrderIcon    },
  { href: "/admin/products", label: "Products", Icon: ProductsIcon  },
  { href: "/admin/settings", label: "Settings", Icon: SettingsIcon  },
];
