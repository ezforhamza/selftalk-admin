import apiClient from "../apiClient";
import type { FAQ } from "#/entity";

// Request types for FAQ operations
export interface CreateFAQReq {
	category: 'General' | 'Account' | 'Billing' | 'Features' | 'Technical';
	question: string;
	answer: string;
}

export interface UpdateFAQReq {
	category?: 'General' | 'Account' | 'Billing' | 'Features' | 'Technical';
	question?: string;
	answer?: string;
}

// API Response structures (what the API client returns after extracting data)
export interface FAQDataResponse {
	faq: FAQ;
}

export interface FAQListDataResponse {
	faqs: FAQ[];
}

export enum FAQApi {
	CreateFAQ = "/admin/faq",
	GetFAQs = "/admin/faq",
	GetFAQ = "/admin/faq",
	UpdateFAQ = "/admin/faq",
	DeleteFAQ = "/admin/faq",
}

// Get all FAQs with optional category filter
const getFAQs = async (category?: string): Promise<FAQ[]> => {
	const params = category ? { category } : {};
	const response = await apiClient.get<FAQListDataResponse>({
		url: FAQApi.GetFAQs,
		params,
	});

	// API client extracts data automatically, so we get { faqs: FAQ[] }
	return response.faqs;
};

// Get single FAQ by ID
const getFAQ = async (id: string): Promise<FAQ> => {
	const response = await apiClient.get<FAQDataResponse>({
		url: `${FAQApi.GetFAQ}/${id}`,
	});

	// API client extracts data automatically, so we get { faq: FAQ }
	return response.faq;
};

// Create new FAQ
const createFAQ = async (data: CreateFAQReq): Promise<FAQ> => {
	const response = await apiClient.post<FAQDataResponse>({
		url: FAQApi.CreateFAQ,
		data,
	});

	// API client extracts data automatically, so we get { faq: FAQ }
	return response.faq;
};

// Update FAQ
const updateFAQ = async (id: string, data: UpdateFAQReq): Promise<FAQ> => {
	const response = await apiClient.put<FAQDataResponse>({
		url: `${FAQApi.UpdateFAQ}/${id}`,
		data,
	});

	// API client extracts data automatically, so we get { faq: FAQ }
	return response.faq;
};

// Delete FAQ
const deleteFAQ = async (id: string): Promise<void> => {
	await apiClient.delete({
		url: `${FAQApi.DeleteFAQ}/${id}`,
	});
};

export default {
	getFAQs,
	getFAQ,
	createFAQ,
	updateFAQ,
	deleteFAQ,
};