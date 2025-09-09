import { http, HttpResponse } from "msw";

interface FAQ {
	id: number;
	question: string;
	answer: string;
	category: string;
	isActive: boolean;
	createdAt: string;
}

let faqData: FAQ[] = [
	{
		id: 1,
		question: "How do I create an account?",
		answer:
			"To create an account, click the 'Sign Up' button on our homepage and fill in the required information including your email address and password. You'll receive a confirmation email to verify your account.",
		category: "Account",
		isActive: true,
		createdAt: "2024-01-15T10:30:00Z",
	},
	{
		id: 2,
		question: "What subscription plans do you offer?",
		answer:
			"We offer three subscription plans:\n\n• Free Plan: Basic features with limited usage\n• Premium Plan: Advanced features with increased limits\n• Super Plan: All features with unlimited usage and priority support\n\nYou can upgrade or downgrade your plan at any time from your account settings.",
		category: "Billing",
		isActive: true,
		createdAt: "2024-01-16T14:20:00Z",
	},
	{
		id: 3,
		question: "How do I reset my password?",
		answer:
			"If you've forgotten your password, click the 'Forgot Password' link on the login page. Enter your email address and we'll send you instructions to reset your password. The reset link will be valid for 24 hours.",
		category: "Account",
		isActive: true,
		createdAt: "2024-01-17T09:15:00Z",
	},
	{
		id: 4,
		question: "What are the main features of the app?",
		answer:
			"Our app includes:\n\n• AI-powered conversation analysis\n• Voice recording and transcription\n• Personal insights and patterns\n• Progress tracking and analytics\n• Secure cloud storage\n• Multi-device synchronization\n\nPremium and Super users get access to additional features like advanced analytics and priority processing.",
		category: "Features",
		isActive: true,
		createdAt: "2024-01-18T16:45:00Z",
	},
	{
		id: 5,
		question: "Is my data secure and private?",
		answer:
			"Yes, we take your privacy very seriously. All your data is encrypted both in transit and at rest. We comply with GDPR and other privacy regulations. Your personal conversations and insights are never shared with third parties, and you have full control over your data including the ability to export or delete it at any time.",
		category: "General",
		isActive: true,
		createdAt: "2024-01-19T11:30:00Z",
	},
	{
		id: 6,
		question: "The app is not working properly, what should I do?",
		answer:
			"If you're experiencing technical issues:\n\n1. Try refreshing the page or restarting the app\n2. Clear your browser cache and cookies\n3. Make sure you have a stable internet connection\n4. Check if you're using the latest version of the app\n5. Try using a different browser or device\n\nIf the problem persists, please contact our support team with details about the issue and your device information.",
		category: "Technical",
		isActive: true,
		createdAt: "2024-01-20T13:25:00Z",
	},
];

let nextId = 7;

export const faqHandlers = [
	// Get all FAQs
	http.get("/api/faq", () => {
		return HttpResponse.json(faqData);
	}),

	// Get single FAQ
	http.get("/api/faq/:id", ({ params }) => {
		const id = parseInt(params.id as string);
		const faq = faqData.find((f) => f.id === id);

		if (!faq) {
			return HttpResponse.json({ error: "FAQ not found" }, { status: 404 });
		}

		return HttpResponse.json(faq);
	}),

	// Create FAQ
	http.post("/api/faq", async ({ request }) => {
		const data = (await request.json()) as Omit<FAQ, "id" | "isActive" | "createdAt">;

		const newFaq: FAQ = {
			id: nextId++,
			question: data.question,
			answer: data.answer,
			category: data.category,
			isActive: true,
			createdAt: new Date().toISOString(),
		};

		faqData.push(newFaq);
		return HttpResponse.json(newFaq);
	}),

	// Update FAQ
	http.put("/api/faq/:id", async ({ params, request }) => {
		const id = parseInt(params.id as string);
		const updates = (await request.json()) as Partial<FAQ>;

		const faqIndex = faqData.findIndex((f) => f.id === id);
		if (faqIndex === -1) {
			return HttpResponse.json({ error: "FAQ not found" }, { status: 404 });
		}

		faqData[faqIndex] = {
			...faqData[faqIndex],
			...updates,
			id: faqData[faqIndex].id, // Preserve original ID
			createdAt: faqData[faqIndex].createdAt, // Preserve original creation date
		};

		return HttpResponse.json(faqData[faqIndex]);
	}),

	// Delete FAQ (soft delete by setting isActive to false)
	http.delete("/api/faq/:id", ({ params }) => {
		const id = parseInt(params.id as string);
		const faqIndex = faqData.findIndex((f) => f.id === id);

		if (faqIndex === -1) {
			return HttpResponse.json({ error: "FAQ not found" }, { status: 404 });
		}

		faqData[faqIndex].isActive = false;
		return HttpResponse.json({ success: true });
	}),
];
