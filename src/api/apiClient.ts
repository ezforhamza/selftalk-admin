import { GLOBAL_CONFIG } from "@/global-config";
import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";
import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";
import { toast } from "sonner";
// import type { Result } from "#/api"; // Commented out as we now handle both API formats
import { ResultStatus } from "#/enum";

const axiosInstance = axios.create({
	baseURL: GLOBAL_CONFIG.apiBaseUrl,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
});

axiosInstance.interceptors.request.use(
	(config) => {
		// Get token from userStore
		const userToken = userStore.getState().userToken;
		if (userToken.accessToken) {
			config.headers.Authorization = `Bearer ${userToken.accessToken}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
	(res: AxiosResponse<any>) => {
		if (!res.data) throw new Error(t("sys.api.apiRequestFailed"));

		// Handle new SelfTalk API format { success, statusCode, message, data }
		if (typeof res.data.success === "boolean") {
			const { success, data, message } = res.data;
			if (success) {
				return data;
			}
			throw new Error(message || t("sys.api.apiRequestFailed"));
		}

		// Handle legacy format { status, data, message }
		const { status, data, message } = res.data;
		if (status === ResultStatus.SUCCESS) {
			return data;
		}
		throw new Error(message || t("sys.api.apiRequestFailed"));
	},
	(error: AxiosError<any>) => {
		const { response, message } = error || {};
		let errMsg = message || t("sys.api.errorMessage");

		// Handle SelfTalk API error format
		if (response?.data?.message) {
			errMsg = response.data.message;
		}

		toast.error(errMsg, { position: "top-center" });
		if (response?.status === 401) {
			userStore.getState().actions.clearUserInfoAndToken();
		}
		return Promise.reject(error);
	},
);

class APIClient {
	get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "GET" });
	}
	post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "POST" });
	}
	put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PUT" });
	}
	delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "DELETE" });
	}
	request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return axiosInstance.request<any, T>(config);
	}
}

export default new APIClient();
