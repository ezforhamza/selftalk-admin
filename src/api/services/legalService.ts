import apiClient from "../apiClient";

// Backend document structure based on actual API
export interface BackendDocument {
	_id: string;
	title: string;
	content: string;
	slug: string;
	isPublished: boolean;
	createdAt: string;
	updatedAt: string;
}

// Request types for document operations
export interface UpdateDocumentReq {
	title: string;
	content: string;
	isPublished: boolean;
}

// API Response structures (what the API client returns after extracting data)
export interface DocumentDataResponse {
	document: BackendDocument;
}

// Frontend compatibility types (keeping existing interface for backward compatibility)
export interface LegalDocumentResponse {
	content: string;
	lastUpdated: string;
}

export interface UpdateLegalDocumentResponse {
	success: boolean;
	message: string;
	lastUpdated: string;
}

export enum LegalApi {
	GetAllDocuments = "/admin/documents",
	GetDocumentById = "/admin/documents",
	GetDocumentBySlug = "/admin/documents/slug",
	UpdateDocumentById = "/admin/documents",
}

// Transform backend document to frontend format for backward compatibility
const transformDocumentToLegacyFormat = (document: BackendDocument): LegalDocumentResponse => ({
	content: document.content,
	lastUpdated: document.updatedAt || document.createdAt || new Date().toISOString(),
});

// Privacy Policy operations (using slug-based retrieval)
const getPrivacyPolicy = async (): Promise<LegalDocumentResponse> => {
	const response = await apiClient.get<DocumentDataResponse>({
		url: `${LegalApi.GetDocumentBySlug}/privacy-policy`,
	});

	return transformDocumentToLegacyFormat(response.document);
};

const updatePrivacyPolicy = async (content: string): Promise<UpdateLegalDocumentResponse> => {
	// First get the document to get its ID and current title
	const currentDoc = await apiClient.get<DocumentDataResponse>({
		url: `${LegalApi.GetDocumentBySlug}/privacy-policy`,
	});

	// Update using the document ID
	const response = await apiClient.put<DocumentDataResponse>({
		url: `${LegalApi.UpdateDocumentById}/${currentDoc.document._id}`,
		data: {
			title: currentDoc.document.title, // Keep existing title
			content: content,
			isPublished: true, // Set as published when updating
		} satisfies UpdateDocumentReq,
	});

	return {
		success: true,
		message: "Privacy Policy updated successfully",
		lastUpdated: response.document.updatedAt || new Date().toISOString(),
	};
};

// Terms and Conditions operations (using slug-based retrieval)
const getTermsConditions = async (): Promise<LegalDocumentResponse> => {
	const response = await apiClient.get<DocumentDataResponse>({
		url: `${LegalApi.GetDocumentBySlug}/terms-conditions`,
	});

	return transformDocumentToLegacyFormat(response.document);
};

const updateTermsConditions = async (content: string): Promise<UpdateLegalDocumentResponse> => {
	// First get the document to get its ID and current title
	const currentDoc = await apiClient.get<DocumentDataResponse>({
		url: `${LegalApi.GetDocumentBySlug}/terms-conditions`,
	});

	// Update using the document ID
	const response = await apiClient.put<DocumentDataResponse>({
		url: `${LegalApi.UpdateDocumentById}/${currentDoc.document._id}`,
		data: {
			title: currentDoc.document.title, // Keep existing title
			content: content,
			isPublished: true, // Set as published when updating
		} satisfies UpdateDocumentReq,
	});

	return {
		success: true,
		message: "Terms and Conditions updated successfully",
		lastUpdated: response.document.updatedAt || new Date().toISOString(),
	};
};

export const legalService = {
	getPrivacyPolicy,
	updatePrivacyPolicy,
	getTermsConditions,
	updateTermsConditions,
};
