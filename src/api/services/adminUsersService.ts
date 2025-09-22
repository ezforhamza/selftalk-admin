import apiClient from "../apiClient";

// API User structure (what the backend returns)
export interface ApiUser {
	_id: string;
	username: string;
	email: string;
	profilePicture: string;
	voice_id: string | null;
	model_id: string | null;
	total_minutes: number;
	available_minutes: number;
	current_subscription: {
		_id: string;
		name: string;
		price: number;
		billing_period: string;
	} | null;
	subscription_started_at: string | null;
	role: {
		_id: string;
		name: string;
		description: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
	is_suspended: boolean;
	createdAt: string;
	updatedAt: string;
}

// API Response structure
export interface ApiUsersResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: {
		users: ApiUser[];
	};
	meta: {
		total: number;
		limit: number;
		totalPages: number;
		currentPage: number;
	};
}

export interface ApiUserResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: {
		user: ApiUser;
	};
}

// Frontend User structure (what the frontend expects)
export interface FrontendUser {
	id: string;
	name: string;
	email: string;
	avatar: string;
	currentPackageId: string;
	plan: string;
	status: string;
	joinDate: string;
	lastActive: string;
	minutesUsed: number;
	minutesTotal: number;
	subscription: {
		id: string;
		userId: string;
		packageId: string;
		packageSnapshot: {
			name: string;
			price: number;
			voiceMinutes: number;
			billingCycle: string;
		};
		status: string;
		startDate: string;
		endDate: string | null;
		nextBillingDate: string | null;
		paymentMethod: {
			type: string;
			last4: string;
			brand: string;
		} | null;
		autoRenew: boolean;
		createdAt: string;
		updatedAt: string;
	};
}

export enum AdminUsersApi {
	GetUsers = "/admin/users",
	ToggleSuspension = "/admin/users/suspension",
}

// Generate random avatar background colors
const AVATAR_COLORS = [
	"#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
	"#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
	"#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
	"#ec4899", "#f43f5e"
];

// Transform API user to frontend user format
export const transformApiUserToFrontendUser = (apiUser: ApiUser): FrontendUser => {
	// Calculate minutes used from total and available
	const minutesUsed = apiUser.total_minutes - apiUser.available_minutes;

	// Generate avatar with user initials and random color
	const initials = apiUser.username
		.split(' ')
		.map(n => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	const colorIndex = apiUser._id.charCodeAt(0) % AVATAR_COLORS.length;
	const avatarColor = AVATAR_COLORS[colorIndex];

	// Create avatar URL with initials and background color
	const avatar = apiUser.profilePicture ||
		`data:image/svg+xml,${encodeURIComponent(`
			<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
				<rect width="40" height="40" fill="${avatarColor}"/>
				<text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14" font-weight="bold">${initials}</text>
			</svg>
		`)}`;

	// Determine plan name and subscription details
	const planName = apiUser.current_subscription?.name || "Free";
	const planPrice = apiUser.current_subscription?.price || 0;

	// Status mapping
	const status = apiUser.is_suspended ? "Suspended" : "Active";

	// Date formatting
	const joinDate = new Date(apiUser.createdAt).toISOString().split('T')[0];
	const lastActive = new Date(apiUser.updatedAt).toISOString().split('T')[0];

	// Static payment method for now (to be implemented later)
	const paymentMethod = planPrice > 0 ? {
		type: "card",
		last4: "4242",
		brand: "visa"
	} : null;

	// Create subscription data
	const subscription = {
		id: apiUser.current_subscription?._id || `sub_${apiUser._id}`,
		userId: apiUser._id,
		packageId: apiUser.current_subscription?._id || `pkg_free_${apiUser._id}`,
		packageSnapshot: {
			name: planName,
			price: planPrice,
			voiceMinutes: apiUser.total_minutes,
			billingCycle: apiUser.current_subscription?.billing_period || "monthly",
		},
		status: planName === "Free" ? "free" : (status === "Active" ? "active" : "cancelled"),
		startDate: apiUser.subscription_started_at ?
			new Date(apiUser.subscription_started_at).toISOString().split('T')[0] : joinDate,
		endDate: null, // Will be calculated based on billing cycle later
		nextBillingDate: planName === "Free" ? null :
			new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
		paymentMethod,
		autoRenew: planName !== "Free" && status === "Active",
		createdAt: apiUser.subscription_started_at || apiUser.createdAt,
		updatedAt: apiUser.updatedAt,
	};

	return {
		id: apiUser._id,
		name: apiUser.username,
		email: apiUser.email,
		avatar,
		currentPackageId: subscription.packageId,
		plan: planName,
		status,
		joinDate,
		lastActive,
		minutesUsed,
		minutesTotal: apiUser.total_minutes,
		subscription,
	};
};

// API service functions
const getUsers = async (page: number = 1, limit: number = 10): Promise<{
	users: FrontendUser[];
	meta: { total: number; limit: number; totalPages: number; currentPage: number };
}> => {
	const response = await apiClient.get<{
		users: ApiUser[];
		meta: { total: number; limit: number; totalPages: number; currentPage: number };
	}>({
		url: AdminUsersApi.GetUsers,
		params: { page, limit }
	});

	return {
		users: response.users.map(transformApiUserToFrontendUser),
		meta: response.meta
	};
};

const toggleUserSuspension = async (userId: string): Promise<FrontendUser> => {
	const response = await apiClient.put<{ user: ApiUser }>({
		url: `${AdminUsersApi.ToggleSuspension}/${userId}`
	});

	return transformApiUserToFrontendUser(response.user);
};

export default {
	getUsers,
	toggleUserSuspension,
};