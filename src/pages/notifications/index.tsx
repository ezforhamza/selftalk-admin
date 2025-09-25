import { Bell, Calendar, CheckCircle, Eye, Send, Target, Trash2, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import notificationService from "@/api/services/notificationService";
import type { Notification } from "#/entity";

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

// Transform backend notification to frontend format
const transformNotificationToHistory = (notification: Notification): NotificationHistory => {
	return {
		id: notification._id,
		title: notification.title,
		message: notification.message,
		type: notification.type.toLowerCase() as "info" | "success" | "warning" | "error",
		targetAudience: notification.target_audience === "All Users" ? "all" :
		                notification.target_audience === "Active Users" ? "active" :
		                notification.target_audience === "Premium Users" ? "premium" : "free",
		sentAt: notification.createdAt,
		status: notification.is_active ? "sent" : "failed",
		// These fields don't exist in backend - using mock values for UI compatibility
		recipientCount: Math.floor(Math.random() * 5000) + 100,
		openRate: Math.random() * 0.8 + 0.1,
	};
};

// Transform frontend form data to backend format
const transformFormDataToBackend = (formData: {
	title: string;
	message: string;
	type: "info" | "success" | "warning" | "error";
	targetAudience: "all" | "active" | "premium" | "free";
}) => {
	return {
		title: formData.title,
		message: formData.message,
		type: (formData.type.charAt(0).toUpperCase() + formData.type.slice(1)) as "Info" | "Success" | "Warning" | "Error",
		target_audience: (formData.targetAudience === "all" ? "All Users" :
		                formData.targetAudience === "active" ? "Active Users" :
		                formData.targetAudience === "premium" ? "Premium Users" : "Free Users") as "All Users" | "Active Users" | "Premium Users" | "Free Users",
	};
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

	// Load notifications from API
	const loadNotifications = useCallback(async () => {
		try {
			const response = await notificationService.getNotifications({ limit: 50 });
			const transformedHistory = response.notifications.map(transformNotificationToHistory);
			setHistory(transformedHistory);
		} catch (error) {
			console.error("Failed to load notifications:", error);
			toast.error("Failed to load notifications");
		}
	}, []);

	useEffect(() => {
		loadNotifications();
	}, [loadNotifications]);

	const handleSendNotification = useCallback(async () => {
		setLoading(true);

		try {
			const backendData = transformFormDataToBackend(formData);
			const createdNotification = await notificationService.createNotification(backendData);

			const newNotificationHistory = transformNotificationToHistory(createdNotification);
			setHistory((prev) => [newNotificationHistory, ...prev]);

			// Reset form
			setFormData({
				title: "",
				message: "",
				type: "info",
				targetAudience: "all",
			});

			toast.success("Notification sent successfully!");
			setActiveTab("history");
		} catch (error) {
			console.error("Failed to send notification:", error);
			toast.error("Failed to send notification");
		} finally {
			setLoading(false);
		}
	}, [formData]);

	const handleDeleteNotification = useCallback(async (id: string) => {
		try {
			await notificationService.deleteNotification(id);
			setHistory((prev) => prev.filter(notification => notification.id !== id));
			toast.success("Notification deleted successfully!");
		} catch (error) {
			console.error("Failed to delete notification:", error);
			toast.error("Failed to delete notification");
		}
	}, []);

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

										<Button
											variant="ghost"
											size="sm"
											className="text-muted-foreground hover:text-red-500"
											onClick={() => handleDeleteNotification(notification.id)}
										>
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
