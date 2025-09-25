import type { Notification } from "#/entity";
import apiClient from "../apiClient";

// Request types for notification operations
export interface CreateNotificationReq {
	title: string;
	type: "Info" | "Success" | "Warning" | "Error";
	message: string;
	target_audience: "All Users" | "Active Users" | "Premium Users" | "Free Users";
}

// API Response structures (what the API client returns after extracting data)
export interface NotificationDataResponse {
	notification: Notification;
}

export interface NotificationListDataResponse {
	notifications: Notification[];
}

export interface NotificationListResponse {
	notifications: Notification[];
	meta: {
		total: number;
		limit: number;
		totalPages: number;
		currentPage: number;
	};
}

export enum NotificationApi {
	CreateNotification = "/admin/notifications",
	GetNotifications = "/admin/notifications",
	GetNotification = "/admin/notifications",
	UpdateNotification = "/admin/notifications",
	DeleteNotification = "/admin/notifications",
}

// Get all notifications with pagination and filters
const getNotifications = async (params?: {
	page?: number;
	limit?: number;
	type?: "Info" | "Success" | "Warning" | "Error";
	target_audience?: "All Users" | "Active Users" | "Premium Users" | "Free Users";
	is_active?: boolean;
}): Promise<NotificationListResponse> => {
	const response = await apiClient.get<NotificationListResponse>({
		url: NotificationApi.GetNotifications,
		params,
	});

	// API client extracts data automatically, so we get { notifications: Notification[], meta: {...} }
	return response;
};

// Get single notification by ID
const getNotification = async (id: string): Promise<Notification> => {
	const response = await apiClient.get<NotificationDataResponse>({
		url: `${NotificationApi.GetNotification}/${id}`,
	});

	// API client extracts data automatically, so we get { notification: Notification }
	return response.notification;
};

// Create new notification
const createNotification = async (data: CreateNotificationReq): Promise<Notification> => {
	const response = await apiClient.post<NotificationDataResponse>({
		url: NotificationApi.CreateNotification,
		data,
	});

	// API client extracts data automatically, so we get { notification: Notification }
	return response.notification;
};

// Delete notification
const deleteNotification = async (id: string): Promise<void> => {
	await apiClient.delete({
		url: `${NotificationApi.DeleteNotification}/${id}`,
	});
};

export default {
	getNotifications,
	getNotification,
	createNotification,
	deleteNotification,
};