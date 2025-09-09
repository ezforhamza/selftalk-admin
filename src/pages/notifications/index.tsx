import { useState, useEffect, useCallback } from "react";
import { faker } from "@faker-js/faker";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import { toast } from "sonner";
import { Send, Users, Bell, Target, Calendar, CheckCircle, XCircle, Eye, Trash2, Plus } from "lucide-react";

interface NotificationHistory {
	id: string;
	title: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
	targetAudience: "all" | "active" | "premium" | "free";
	sentAt: string;
	status: "sent" | "pending" | "failed";
	recipientCount: number;
	openRate: number;
}

// Mock notification templates
const notificationTemplates = [
	{
		title: "Welcome to SelfTalk Premium!",
		message:
			"Thank you for upgrading to Premium! Enjoy 50 voice minutes and priority support. Your subscription is now active.",
		type: "success" as const,
	},
	{
		title: "New Feature: Custom Voice Settings",
		message:
			"We've added custom voice settings to enhance your SelfTalk experience. Update your preferences in the app settings.",
		type: "info" as const,
	},
	{
		title: "Subscription Payment Failed",
		message:
			"We couldn't process your payment for this month. Please update your payment method to continue enjoying SelfTalk.",
		type: "error" as const,
	},
	{
		title: "Voice Minutes Running Low",
		message:
			"You have used 90% of your voice minutes this month. Consider upgrading to Super plan for unlimited conversations.",
		type: "warning" as const,
	},
	{
		title: "Monthly Usage Report Available",
		message:
			"Your personalized usage report is ready! See how you've been using SelfTalk this month and discover new insights.",
		type: "info" as const,
	},
	{
		title: "Account Security Update",
		message:
			"We've enhanced our security measures. Please review your account settings and enable two-factor authentication.",
		type: "warning" as const,
	},
	{
		title: "Super Plan Upgrade Successful",
		message:
			"Welcome to SelfTalk Super! You now have 200 voice minutes and access to premium features. Enjoy the ultimate experience!",
		type: "success" as const,
	},
	{
		title: "Maintenance Scheduled",
		message:
			"SelfTalk will undergo scheduled maintenance on Sunday 2 AM - 4 AM EST. Service may be temporarily unavailable.",
		type: "info" as const,
	},
	{
		title: "Free Trial Ending Soon",
		message:
			"Your free trial ends in 3 days. Upgrade to Premium or Super to continue enjoying unlimited conversations with your AI companion.",
		type: "warning" as const,
	},
	{
		title: "New AI Model Released",
		message:
			"We've released a new AI model with improved conversation quality and better understanding. Update your app to access it.",
		type: "success" as const,
	},
];

// Mock data generator
const generateMockHistory = (count: number): NotificationHistory[] => {
	return Array.from({ length: count }, (_, index) => {
		const template = notificationTemplates[index % notificationTemplates.length];
		return {
			id: faker.string.uuid(),
			title: template.title,
			message: template.message,
			type: template.type,
			targetAudience: faker.helpers.arrayElement(["all", "active", "premium", "free"] as const),
			sentAt: faker.date.past().toISOString(),
			status: faker.helpers.arrayElement(["sent", "pending", "failed"] as const),
			recipientCount: faker.number.int({ min: 50, max: 5000 }),
			openRate: faker.number.float({ min: 0.1, max: 0.9 }),
		};
	});
};

export default function NotificationsPage() {
	const [activeTab, setActiveTab] = useState<"send" | "history">("send");
	const [history, setHistory] = useState<NotificationHistory[]>([]);
	const [loading, setLoading] = useState(false);

	// Form state
	const [formData, setFormData] = useState({
		title: "",
		message: "",
		type: "info" as const,
		targetAudience: "all" as const,
	});

	useEffect(() => {
		setHistory(generateMockHistory(15));
	}, []);

	const handleSendNotification = useCallback(async () => {
		setLoading(true);

		await new Promise((resolve) => setTimeout(resolve, 1500));

		const newNotification: NotificationHistory = {
			id: faker.string.uuid(),
			title: formData.title,
			message: formData.message,
			type: formData.type,
			targetAudience: formData.targetAudience,
			sentAt: new Date().toISOString(),
			status: "sent",
			recipientCount: faker.number.int({ min: 100, max: 2000 }),
			openRate: faker.number.float({ min: 0.2, max: 0.8 }),
		};

		setHistory((prev) => [newNotification, ...prev]);

		// Reset form
		setFormData({
			title: "",
			message: "",
			type: "info",
			targetAudience: "all",
		});

		toast.success("Notification sent successfully!");
		setActiveTab("history");
		setLoading(false);
	}, [formData]);

	const getTypeVariant = (type: string) => {
		switch (type) {
			case "success":
				return "default" as const;
			case "warning":
				return "secondary" as const;
			case "error":
				return "destructive" as const;
			default:
				return "outline" as const;
		}
	};

	const getStatusVariant = (status: string) => {
		switch (status) {
			case "sent":
				return "default" as const;
			case "pending":
				return "secondary" as const;
			case "failed":
				return "destructive" as const;
			default:
				return "outline" as const;
		}
	};

	const getAudienceIcon = (audience: string) => {
		switch (audience) {
			case "all":
				return <Users className="h-4 w-4" />;
			case "active":
				return <CheckCircle className="h-4 w-4" />;
			case "premium":
				return <Target className="h-4 w-4" />;
			case "free":
				return <Bell className="h-4 w-4" />;
			default:
				return <Users className="h-4 w-4" />;
		}
	};

	const sentToday = history.filter((h) => {
		const today = new Date().toDateString();
		const sentDate = new Date(h.sentAt).toDateString();
		return today === sentDate && h.status === "sent";
	}).length;

	return (
		<div className="min-h-screen overflow-y-auto">
			{/* Mobile Header */}
			<div className="md:hidden p-4 border-b bg-background">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold">Notifications</h1>
				</div>
			</div>

			{/* Main Content */}
			<div className="p-6">
				<div className="flex justify-between items-center mb-6">
					<div className="hidden md:block">
						<h2 className="text-lg font-medium">
							{activeTab === "send" ? "Send Notification" : `Notification History (${history.length})`}
						</h2>
					</div>
					<div className="w-full md:w-auto">
						<div className="flex items-center gap-2">
							<Button
								variant={activeTab === "send" ? "default" : "outline"}
								size="sm"
								onClick={() => setActiveTab("send")}
								className="w-full md:w-auto"
							>
								<Send className="h-4 w-4 mr-2" />
								Send New
							</Button>
							<Button
								variant={activeTab === "history" ? "default" : "outline"}
								size="sm"
								onClick={() => setActiveTab("history")}
								className="w-full md:w-auto"
							>
								<Eye className="h-4 w-4 mr-2" />
								History
							</Button>
						</div>
					</div>
				</div>

				{activeTab === "send" ? (
					<div className="max-w-2xl mx-auto space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="title">Title</Label>
								<Input
									id="title"
									placeholder="Notification title..."
									value={formData.title}
									onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="type">Type</Label>
								<Select
									value={formData.type}
									onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value as any }))}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="info">Info</SelectItem>
										<SelectItem value="success">Success</SelectItem>
										<SelectItem value="warning">Warning</SelectItem>
										<SelectItem value="error">Error</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="message">Message</Label>
							<Textarea
								id="message"
								placeholder="Your notification message..."
								rows={4}
								value={formData.message}
								onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
								className="resize-none"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="audience">Target Audience</Label>
							<Select
								value={formData.targetAudience}
								onValueChange={(value) => setFormData((prev) => ({ ...prev, targetAudience: value as any }))}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Users</SelectItem>
									<SelectItem value="active">Active Users</SelectItem>
									<SelectItem value="premium">Premium Users</SelectItem>
									<SelectItem value="free">Free Users</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="pt-4">
							<Button
								onClick={handleSendNotification}
								disabled={loading || !formData.title || !formData.message}
								className="w-full"
								size="lg"
							>
								{loading ? (
									<>
										<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
										Sending...
									</>
								) : (
									<>
										<Send className="h-4 w-4 mr-2" />
										Send Notification
									</>
								)}
							</Button>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						{history.map((notification) => (
							<Card key={notification.id} className="hover:shadow-sm transition-shadow">
								<CardContent className="p-6">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-2">
												<h3 className="font-medium text-sm leading-none">{notification.title}</h3>
												<Badge variant={getTypeVariant(notification.type)} className="text-xs">
													{notification.type}
												</Badge>
												<Badge variant={getStatusVariant(notification.status)} className="text-xs">
													{notification.status}
												</Badge>
											</div>

											<p className="text-sm text-muted-foreground mb-3 line-clamp-2">{notification.message}</p>

											<div className="flex items-center gap-6 text-xs text-muted-foreground">
												<div className="flex items-center gap-1">
													{getAudienceIcon(notification.targetAudience)}
													<span className="capitalize">{notification.targetAudience} users</span>
												</div>
												<div className="flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													<span>{new Date(notification.sentAt).toLocaleDateString()}</span>
												</div>
											</div>
										</div>

										<Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
