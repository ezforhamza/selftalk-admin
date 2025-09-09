import { faker } from "@faker-js/faker";

// Mock packages data (shared reference)
const MOCK_PACKAGES = [
	{
		id: "pkg_free_001",
		name: "Free",
		price: 0,
		voiceMinutes: 2,
		billingCycle: "monthly" as const,
		isActive: true,
	},
	{
		id: "pkg_premium_001",
		name: "Premium",
		price: 9.99,
		voiceMinutes: 50,
		billingCycle: "monthly" as const,
		isActive: true,
	},
	{
		id: "pkg_super_001",
		name: "Super",
		price: 29.99,
		voiceMinutes: 200,
		billingCycle: "monthly" as const,
		isActive: true,
	},
];

// Use userId as seed for consistent data generation
export const generateConsistentUserData = (userId: string) => {
	// Set faker seed based on userId to ensure consistent data
	faker.seed(userId.charCodeAt(0) + userId.charCodeAt(1) + userId.length);

	const statuses = ["Active", "Suspended"];
	const status = faker.helpers.arrayElement(statuses);
	const packageRef = faker.helpers.arrayElement(MOCK_PACKAGES);
	const joinDate = faker.date.past({ years: 1 });
	const subscriptionStart = packageRef.name !== "Free" ? faker.date.between({ from: joinDate, to: new Date() }) : null;
	const subscriptionEnd = subscriptionStart ? new Date(subscriptionStart.getTime() + 30 * 24 * 60 * 60 * 1000) : null;
	const nextBilling = subscriptionStart ? new Date(subscriptionStart.getTime() + 30 * 24 * 60 * 60 * 1000) : null;

	// Create subscription data for all users (including free users)
	const subscriptionData = {
		id: faker.string.uuid(),
		userId: userId,
		packageId: packageRef.id,
		// Snapshot preserves package data at time of subscription
		packageSnapshot: {
			name: packageRef.name,
			price: packageRef.price,
			voiceMinutes: packageRef.voiceMinutes,
			billingCycle: packageRef.billingCycle,
		},
		// Current subscription details
		status: packageRef.name === "Free" ? "free" : status === "Active" ? "active" : "cancelled",
		startDate: subscriptionStart?.toISOString().split("T")[0] || joinDate.toISOString().split("T")[0],
		endDate: subscriptionEnd?.toISOString().split("T")[0] || null,
		nextBillingDate: packageRef.name === "Free" ? null : nextBilling?.toISOString().split("T")[0],
		paymentMethod:
			packageRef.name === "Free"
				? null
				: {
						type: "card",
						last4: faker.finance.creditCardNumber().slice(-4),
						brand: faker.helpers.arrayElement(["visa", "mastercard", "amex"]),
					},
		autoRenew: packageRef.name === "Free" ? false : status === "Active",
		createdAt: subscriptionStart?.toISOString() || joinDate.toISOString(),
		updatedAt: new Date().toISOString(),
	};

	const user = {
		id: userId,
		name: faker.person.fullName(),
		email: faker.internet.email(),
		avatar: faker.image.avatarGitHub(),
		// Reference current package (can change if user switches plans)
		currentPackageId: packageRef.id,
		// Derived fields for easy access (computed from active subscription)
		plan: packageRef.name,
		status,
		joinDate: joinDate.toISOString().split("T")[0],
		lastActive: faker.date.recent({ days: 30 }).toISOString().split("T")[0],
		minutesUsed: faker.number.int({ min: 0, max: packageRef.voiceMinutes }),
		minutesTotal: packageRef.voiceMinutes,
		subscription: subscriptionData,
	};

	return user;
};

// Generate multiple users with consistent IDs
export const generateConsistentUsers = (count: number) => {
	const userIds = Array.from({ length: count }, () => faker.string.uuid());
	return userIds.map(generateConsistentUserData);
};
