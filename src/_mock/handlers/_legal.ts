import { http, HttpResponse } from "msw";

// Mock storage for legal documents
let privacyPolicyContent = `
<h2>Privacy Policy</h2>
<p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>

<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>

<h3>2. How We Use Your Information</h3>
<ul>
<li>To provide and maintain our services</li>
<li>To notify you about changes to our services</li>
<li>To provide customer support</li>
<li>To gather analysis or valuable information to improve our services</li>
</ul>

<h3>3. Information Security</h3>
<p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

<h3>4. Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us at privacy@selftalk.com</p>
`;

let termsConditionsContent = `
<h2>Terms and Conditions</h2>
<p><strong>Last updated:</strong> ${new Date().toLocaleDateString()}</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing and using SelfTalk, you accept and agree to be bound by the terms and provision of this agreement.</p>

<h3>2. Use License</h3>
<p>Permission is granted to temporarily use SelfTalk for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
<ul>
<li>modify or copy the materials</li>
<li>use the materials for any commercial purpose or for any public display</li>
<li>attempt to decompile or reverse engineer any software contained on SelfTalk</li>
<li>remove any copyright or other proprietary notations from the materials</li>
</ul>

<h3>3. Service Availability</h3>
<p>We strive to provide continuous service availability, but we do not guarantee that our services will be available at all times.</p>

<h3>4. Limitation of Liability</h3>
<p>In no event shall SelfTalk or its suppliers be liable for any damages arising out of the use or inability to use the materials on SelfTalk.</p>

<h3>5. Contact Information</h3>
<p>If you have any questions about these Terms and Conditions, please contact us at legal@selftalk.com</p>
`;

export const legalHandlers = [
	// Get Privacy Policy
	http.get("/api/legal/privacy-policy", () => {
		return HttpResponse.json({
			content: privacyPolicyContent,
			lastUpdated: new Date().toISOString(),
		});
	}),

	// Update Privacy Policy
	http.put("/api/legal/privacy-policy", async ({ request }) => {
		const { content } = (await request.json()) as { content: string };
		privacyPolicyContent = content;

		return HttpResponse.json({
			success: true,
			message: "Privacy Policy updated successfully",
			lastUpdated: new Date().toISOString(),
		});
	}),

	// Get Terms and Conditions
	http.get("/api/legal/terms-conditions", () => {
		return HttpResponse.json({
			content: termsConditionsContent,
			lastUpdated: new Date().toISOString(),
		});
	}),

	// Update Terms and Conditions
	http.put("/api/legal/terms-conditions", async ({ request }) => {
		const { content } = (await request.json()) as { content: string };
		termsConditionsContent = content;

		return HttpResponse.json({
			success: true,
			message: "Terms and Conditions updated successfully",
			lastUpdated: new Date().toISOString(),
		});
	}),
];
