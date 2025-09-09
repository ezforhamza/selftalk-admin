export interface PackageType {
	id: string;
	name: string;
	description: string;
	price: number;
	currency: string;
	billingCycle: "monthly" | "yearly";
	features: string[];
	voiceMinutes: number;
	isActive: boolean;
	isPopular: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface PackageFormData {
	name: string;
	description: string;
	price: number;
	billingCycle: "monthly" | "yearly";
	voiceMinutes: number;
	features: string[];
	isActive: boolean;
	isPopular: boolean;
}
