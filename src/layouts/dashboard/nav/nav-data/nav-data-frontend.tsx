import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const frontendNavData: NavProps["data"] = [
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
	{
		name: "Management",
		items: [
			{
				title: "Users",
				path: "/users",
				icon: <Icon icon="lucide:users" size="24" />,
			},
			{
				title: "Packages",
				path: "/packages",
				icon: <Icon icon="lucide:package" size="24" />,
			},
			{
				title: "Notifications",
				path: "/notifications",
				icon: <Icon icon="solar:bell-bold-duotone" size="24" />,
			},
		],
	},
	{
		name: "Legal",
		items: [
			{
				title: "Privacy Policy",
				path: "/privacy-policy",
				icon: <Icon icon="lucide:shield-check" size="24" />,
			},
			{
				title: "Terms & Conditions",
				path: "/terms-conditions",
				icon: <Icon icon="lucide:file-text" size="24" />,
			},
		],
	},
	{
		name: "Support",
		items: [
			{
				title: "FAQ",
				path: "/faq",
				icon: <Icon icon="lucide:help-circle" size="24" />,
			},
		],
	},
];
