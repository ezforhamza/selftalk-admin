import apiClient from "../apiClient";

import type { UserInfo, UserToken } from "#/entity";

export interface SignInReq {
	email: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	username: string;
}

// API Response structures
export interface ApiUserInfo {
	_id: string;
	username: string;
	email: string;
	profilePicture: string;
	voice_id: string | null;
	model_id: string | null;
	total_minutes: number;
	available_minutes: number;
	current_subscription: any | null;
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

export interface ApiSignInResponse {
	success: boolean;
	statusCode: number;
	message: string;
	data: {
		user: ApiUserInfo;
		accessToken: string;
	};
}

export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
	SignIn = "/auth/login",
	SignUp = "/auth/register",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/user",
}

// Transform API user info to frontend user info
const transformApiUserToUserInfo = (apiUser: ApiUserInfo): UserInfo => ({
	id: apiUser._id,
	email: apiUser.email,
	username: apiUser.username,
	avatar: apiUser.profilePicture || undefined,
	// For now, we'll set basic roles structure - can be enhanced later
	roles: [
		{
			id: apiUser.role._id,
			name: apiUser.role.name,
			code: apiUser.role.name.toUpperCase(),
		},
	],
	// Set permissions based on role - admin gets all permissions
	permissions:
		apiUser.role.name === "admin"
			? [
					{ id: "permission_create", name: "permission-create", code: "permission:create" },
					{ id: "permission_read", name: "permission-read", code: "permission:read" },
					{ id: "permission_update", name: "permission-update", code: "permission:update" },
					{ id: "permission_delete", name: "permission-delete", code: "permission:delete" },
				]
			: [],
});

const signin = async (data: SignInReq): Promise<SignInRes> => {
	// Make the API call and get the raw response (without automatic data extraction)
	const response = await apiClient.post<ApiSignInResponse>({
		url: UserApi.SignIn,
		data,
	});

	// Since our API client automatically extracts .data, we get the data directly
	const { user: apiUser, accessToken } = response as any;

	// Transform API user to frontend format
	const user = transformApiUserToUserInfo(apiUser);

	return {
		accessToken,
		refreshToken: accessToken, // Using same token as refresh for now
		user,
	};
};

const signup = (data: SignUpReq) => apiClient.post<SignInRes>({ url: UserApi.SignUp, data });
const logout = () => apiClient.get({ url: UserApi.Logout });
const findById = (id: string) => apiClient.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export default {
	signin,
	signup,
	findById,
	logout,
};
