import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import { Component } from "./utils";

export function getFrontendDashboardRoutes(): RouteObject[] {
	const frontendDashboardRoutes: RouteObject[] = [
		// Main dashboard route
		{ index: true, element: <Navigate to="dashboard" replace /> },
		{ path: "dashboard", element: Component("/pages/dashboard") },

		// Admin panel routes
		{ path: "users", element: Component("/pages/users") },
		{ path: "users/:userId", element: Component("/pages/users/detail") },
		{ path: "packages", element: Component("/pages/packages") },
		{ path: "notifications", element: Component("/pages/notifications") },

		// Legal documents
		{ path: "privacy-policy", element: Component("/pages/privacy-policy") },
		{ path: "terms-conditions", element: Component("/pages/terms-conditions") },

		// FAQ
		{ path: "faq", element: Component("/pages/faq") },

		// Reusable components showcase (kept for development reference)
		{
			path: "components",
			children: [
				{ index: true, element: <Navigate to="animate" replace /> },
				{ path: "animate", element: Component("/pages/components/animate") },
				{ path: "scroll", element: Component("/pages/components/scroll") },
				{ path: "multi-language", element: Component("/pages/components/multi-language") },
				{ path: "icon", element: Component("/pages/components/icon") },
				{ path: "upload", element: Component("/pages/components/upload") },
				{ path: "chart", element: Component("/pages/components/chart") },
				{ path: "toast", element: Component("/pages/components/toast") },
			],
		},

		// Error pages (keeping for error handling)
		{
			path: "error",
			children: [
				{ index: true, element: <Navigate to="403" replace /> },
				{ path: "403", element: Component("/pages/sys/error/Page403") },
				{ path: "404", element: Component("/pages/sys/error/Page404") },
				{ path: "500", element: Component("/pages/sys/error/Page500") },
			],
		},
	];
	return frontendDashboardRoutes;
}
