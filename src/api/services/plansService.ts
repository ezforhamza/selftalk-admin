import apiClient from "../apiClient";
import type { PackageType, PackageFormData } from "@/pages/packages/types";

// API Plan structure (what the backend returns)
export interface ApiPlan {
	_id: string;
	name: string;
	status: "Active" | "Inactive";
	price: number;
	billing_period: "monthly" | "yearly";
	voice_minutes: number;
	features: string[];
	description: string;
	is_popular: boolean;
	currency: string;
	createdAt: string;
	updatedAt: string;
}

// API Request structure for creating plans
export interface CreatePlanRequest {
	name: string;
	price: number;
	billing_period: "monthly" | "yearly";
	voice_minutes: number;
	features: string[];
	description: string;
	is_popular: boolean;
	currency: string;
}

// API Request structure for updating plans
export interface UpdatePlanRequest {
	name?: string;
	price?: number;
	billing_period?: "monthly" | "yearly";
	voice_minutes?: number;
	features?: string[];
	description?: string;
	is_popular?: boolean;
	currency?: string;
}

// API Response structure
export interface ApiResponse<T> {
	success: boolean;
	statusCode: number;
	message: string;
	data: T;
}

export interface PlansListResponse {
	plans: ApiPlan[];
}

export interface PlanResponse {
	plan: ApiPlan;
}

export enum PlansApi {
	GetPlans = "/admin/plans",
	CreatePlan = "/admin/plans",
	GetPlan = "/admin/plans",
	UpdatePlan = "/admin/plans",
	DeletePlan = "/admin/plans",
}

// Transform API plan to frontend package format
export const transformApiPlanToPackage = (apiPlan: ApiPlan): PackageType => ({
	id: apiPlan._id,
	name: apiPlan.name,
	description: apiPlan.description,
	price: apiPlan.price,
	currency: apiPlan.currency,
	billingCycle: apiPlan.billing_period,
	features: apiPlan.features,
	voiceMinutes: apiPlan.voice_minutes,
	isActive: apiPlan.status === "Active",
	isPopular: apiPlan.is_popular,
	createdAt: new Date(apiPlan.createdAt).toISOString().split("T")[0],
	updatedAt: new Date(apiPlan.updatedAt).toISOString().split("T")[0],
});

// Transform frontend package data to API request format
export const transformPackageFormToApiRequest = (formData: PackageFormData): CreatePlanRequest => ({
	name: formData.name,
	price: formData.price,
	billing_period: formData.billingCycle,
	voice_minutes: formData.voiceMinutes,
	features: formData.features,
	description: formData.description,
	is_popular: formData.isPopular,
	currency: "EUR", // Default currency, can be made configurable later
});

// Transform frontend package update data to API request format
export const transformPackageUpdateToApiRequest = (formData: Partial<PackageFormData>): UpdatePlanRequest => {
	const request: UpdatePlanRequest = {};

	if (formData.name !== undefined) request.name = formData.name;
	if (formData.price !== undefined) request.price = formData.price;
	if (formData.billingCycle !== undefined) request.billing_period = formData.billingCycle;
	if (formData.voiceMinutes !== undefined) request.voice_minutes = formData.voiceMinutes;
	if (formData.features !== undefined) request.features = formData.features;
	if (formData.description !== undefined) request.description = formData.description;
	if (formData.isPopular !== undefined) request.is_popular = formData.isPopular;

	return request;
};

const getPlans = async (status?: "Active" | "Inactive"): Promise<PackageType[]> => {
	const params = status ? { status } : {};
	const response = await apiClient.get<PlansListResponse>({
		url: PlansApi.GetPlans,
		params,
	});
	return response.plans.map(transformApiPlanToPackage);
};

const getPlan = async (id: string): Promise<PackageType> => {
	const response = await apiClient.get<PlanResponse>({
		url: `${PlansApi.GetPlan}/${id}`,
	});
	return transformApiPlanToPackage(response.plan);
};

const createPlan = async (formData: PackageFormData): Promise<PackageType> => {
	const requestData = transformPackageFormToApiRequest(formData);
	const response = await apiClient.post<PlanResponse>({
		url: PlansApi.CreatePlan,
		data: requestData,
	});
	return transformApiPlanToPackage(response.plan);
};

const updatePlan = async (id: string, formData: Partial<PackageFormData>): Promise<PackageType> => {
	const requestData = transformPackageUpdateToApiRequest(formData);
	const response = await apiClient.put<PlanResponse>({
		url: `${PlansApi.UpdatePlan}/${id}`,
		data: requestData,
	});
	return transformApiPlanToPackage(response.plan);
};

const deletePlan = async (id: string): Promise<void> => {
	await apiClient.delete<{ message: string }>({
		url: `${PlansApi.DeletePlan}/${id}`,
	});
};

export default {
	getPlans,
	getPlan,
	createPlan,
	updatePlan,
	deletePlan,
};
