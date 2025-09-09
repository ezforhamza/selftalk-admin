import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { faker } from "@faker-js/faker";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Separator } from "@/ui/separator";
import { ArrowLeft, Calendar, Clock, CreditCard, User, Activity, Crown, Shield, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { generateConsistentUserData } from "./shared-user-data";

export default function UserDetailPage() {
	const { userId } = useParams();
	const navigate = useNavigate();
	const [user, setUser] = useState<any>(null);
	const [loadingToggle, setLoadingToggle] = useState(false);

	useEffect(() => {
		if (userId) {
			setUser(generateConsistentUserData(userId));
		}
	}, [userId]);

	const toggleUserStatus = async () => {
		if (!user) return;

		setLoadingToggle(true);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		const newStatus = user.status === "Active" ? "Suspended" : "Active";
		setUser((prev) => ({ ...prev, status: newStatus }));

		if (newStatus === "Suspended") {
			toast.error(`${user.name} has been suspended`);
		} else {
			toast.success(`${user.name} has been activated`);
		}

		setLoadingToggle(false);
	};

	const getPlanBadgeVariant = (plan: string) => {
		switch (plan) {
			case "Free":
				return "secondary" as const;
			case "Premium":
				return "default" as const;
			case "Super":
				return "destructive" as const;
			default:
				return "secondary" as const;
		}
	};

	const getStatusBadgeVariant = (status: string) => {
		switch (status) {
			case "Active":
				return "default" as const;
			case "Suspended":
				return "destructive" as const;
			default:
				return "secondary" as const;
		}
	};

	if (!user) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-6xl mx-auto p-6 space-y-8">
				{/* Header */}
				<div className="flex items-center justify-between">
					<Button
						variant="ghost"
						onClick={() => navigate("/users")}
						className="flex items-center gap-2 text-base hover:bg-muted/60"
					>
						<ArrowLeft className="h-5 w-5" />
						Back to Users
					</Button>
					<Button
						variant="outline"
						onClick={toggleUserStatus}
						disabled={loadingToggle}
						className={`flex items-center gap-2 px-6 py-2 font-medium ${
							user.status === "Active"
								? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
								: "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
						}`}
					>
						{loadingToggle ? (
							<>
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								{user.status === "Active" ? "Suspending..." : "Activating..."}
							</>
						) : user.status === "Active" ? (
							<>
								<ShieldOff className="h-4 w-4" />
								Suspend User
							</>
						) : (
							<>
								<Shield className="h-4 w-4" />
								Activate User
							</>
						)}
					</Button>
				</div>

				{/* User Profile Section */}
				<Card>
					<CardContent className="p-8">
						<div className="flex items-start gap-8">
							<div className="flex-shrink-0">
								<Avatar className="h-32 w-32 ring-4 ring-background shadow-lg">
									<AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
									<AvatarFallback className="text-3xl font-semibold bg-primary/10">
										{user.name
											.split(" ")
											.map((n: string) => n[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
							</div>

							<div className="flex-1 space-y-6">
								<div>
									<h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
									<p className="text-lg text-muted-foreground mb-4">{user.email}</p>
									<div className="flex items-center gap-3">
										<Badge variant={getPlanBadgeVariant(user.plan)} className="px-3 py-1 text-sm font-medium">
											{user.plan} Plan
										</Badge>
										<Badge variant={getStatusBadgeVariant(user.status)} className="px-3 py-1 text-sm font-medium">
											{user.status}
										</Badge>
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div className="space-y-3">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Calendar className="h-4 w-4" />
											<span className="text-sm font-medium">Member Since</span>
										</div>
										<p className="text-xl font-semibold">
											{new Date(user.joinDate).toLocaleDateString("en-US", {
												month: "short",
												year: "numeric",
											})}
										</p>
									</div>

									<div className="space-y-3">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Clock className="h-4 w-4" />
											<span className="text-sm font-medium">Last Active</span>
										</div>
										<p className="text-xl font-semibold">
											{new Date(user.lastActive).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
											})}
										</p>
									</div>

									<div className="space-y-3">
										<div className="flex items-center gap-2 text-muted-foreground">
											<Activity className="h-4 w-4" />
											<span className="text-sm font-medium">Voice Usage</span>
										</div>
										<div className="space-y-2">
											<p className="text-xl font-semibold">
												{user.minutesUsed} / {user.minutesTotal} min
											</p>
											<div className="w-full bg-muted rounded-full h-2">
												<div
													className="bg-primary h-2 rounded-full transition-all duration-300"
													style={{ width: `${Math.min((user.minutesUsed / user.minutesTotal) * 100, 100)}%` }}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Subscription Details - Always visible for all users */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="flex items-center gap-2 text-xl">
							<Crown className="h-5 w-5 text-primary" />
							Subscription Details
						</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<div className="space-y-3">
								<p className="text-sm font-medium text-muted-foreground">Plan</p>
								<p className="text-lg font-semibold">
									{user.subscription.packageSnapshot.name === "Free" ? "FREE" : user.subscription.packageSnapshot.name}
								</p>
							</div>

							<div className="space-y-3">
								<p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
								<p className="text-lg font-semibold">
									{user.subscription.packageSnapshot.price === 0
										? "€0,00"
										: `€${user.subscription.packageSnapshot.price.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
								</p>
							</div>

							<div className="space-y-3">
								<p className="text-sm font-medium text-muted-foreground">Next Billing</p>
								<p className="text-lg font-semibold">
									{user.subscription.nextBillingDate
										? new Date(user.subscription.nextBillingDate).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
											})
										: "N/A"}
								</p>
							</div>

							<div className="space-y-3">
								<p className="text-sm font-medium text-muted-foreground">Payment Method</p>
								<div className="space-y-1">
									<p className="text-lg font-semibold">
										{user.subscription.paymentMethod
											? `${user.subscription.paymentMethod.brand.charAt(0).toUpperCase() + user.subscription.paymentMethod.brand.slice(1)} •••• ${user.subscription.paymentMethod.last4}`
											: "N/A"}
									</p>
									<p className="text-xs text-muted-foreground">
										{user.subscription.packageSnapshot.name === "Free"
											? "No billing required"
											: user.subscription.autoRenew
												? "Auto-renew enabled"
												: "Auto-renew disabled"}
									</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
