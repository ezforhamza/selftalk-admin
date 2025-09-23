import { legalService } from "@/api/services/legalService";
import LegalDocumentEditor from "@/pages/legal-documents/components/legal-document-editor";

export default function PrivacyPolicyPage() {
	const handleSave = async (content: string) => {
		await legalService.updatePrivacyPolicy(content);
	};

	const handleLoad = async () => {
		const response = await legalService.getPrivacyPolicy();
		return response.content;
	};

	return (
		<LegalDocumentEditor title="Privacy Policy" documentType="privacy-policy" onSave={handleSave} onLoad={handleLoad} />
	);
}
