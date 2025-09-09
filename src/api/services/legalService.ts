import axios from "axios";

const API_BASE_URL = "/api";

export interface LegalDocumentResponse {
	content: string;
	lastUpdated: string;
}

export interface UpdateLegalDocumentRequest {
	content: string;
}

export interface UpdateLegalDocumentResponse {
	success: boolean;
	message: string;
	lastUpdated: string;
}

export const legalService = {
	// Privacy Policy
	getPrivacyPolicy: async (): Promise<LegalDocumentResponse> => {
		const response = await axios.get(`${API_BASE_URL}/legal/privacy-policy`);
		return response.data;
	},

	updatePrivacyPolicy: async (content: string): Promise<UpdateLegalDocumentResponse> => {
		const response = await axios.put(`${API_BASE_URL}/legal/privacy-policy`, { content });
		return response.data;
	},

	// Terms and Conditions
	getTermsConditions: async (): Promise<LegalDocumentResponse> => {
		const response = await axios.get(`${API_BASE_URL}/legal/terms-conditions`);
		return response.data;
	},

	updateTermsConditions: async (content: string): Promise<UpdateLegalDocumentResponse> => {
		const response = await axios.put(`${API_BASE_URL}/legal/terms-conditions`, { content });
		return response.data;
	},
};
