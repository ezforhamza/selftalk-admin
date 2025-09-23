import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

// Backend nav data
export const backendNavData: NavProps["data"] = [
	{
		name: "Dashboard",
		items: [
			{
				title: "Dashboard",
				path: "/dashboard",
				icon: <Icon icon="local:ic-dashboard" size="24" />,
			},
		],
	},
];
