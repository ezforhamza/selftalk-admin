import LegalDocumentEditor from "@/pages/legal-documents/components/legal-document-editor";
import { legalService } from "@/api/services/legalService";

export default function TermsConditionsPage() {
	const handleSave = async (content: string) => {
		await legalService.updateTermsConditions(content);
	};

	const handleLoad = async () => {
		const response = await legalService.getTermsConditions();
		return response.content;
	};

	return (
		<LegalDocumentEditor
			title="Terms and Conditions"
			documentType="terms-conditions"
			onSave={handleSave}
			onLoad={handleLoad}
		/>
	);
}
