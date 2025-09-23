import "./global.css";
import "./theme/theme.css";
import "./locales/i18n";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { worker } from "./_mock";
import App from "./App";
import menuService from "./api/services/menuService";
import { registerLocalIcons } from "./components/icon";
import { GLOBAL_CONFIG } from "./global-config";
import ErrorBoundary from "./routes/components/error-boundary";
import { routesSection } from "./routes/sections";
import { urlJoin } from "./utils";

await registerLocalIcons();
// Check if we should use real API instead of mocks
const isUsingRealAPI = GLOBAL_CONFIG.apiBaseUrl.includes("selftalk-backend");

if (!isUsingRealAPI) {
	// Only start MSW if we're not using the real API
	await worker.start({
		onUnhandledRequest: "bypass",
		serviceWorker: { url: urlJoin(GLOBAL_CONFIG.publicPath, "mockServiceWorker.js") },
	});
}
if (GLOBAL_CONFIG.routerMode === "backend") {
	await menuService.getMenuList();
}

const router = createBrowserRouter(
	[
		{
			Component: () => (
				<App>
					<Outlet />
				</App>
			),
			errorElement: <ErrorBoundary />,
			children: routesSection,
		},
	],
	{
		basename: GLOBAL_CONFIG.publicPath,
	},
);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<RouterProvider router={router} />);
