import { useState, useEffect, memo, useCallback } from "react";
import { useNavigate } from "react-router";
import { faker } from "@faker-js/faker";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import { toast } from "sonner";
import { Users, UserCheck, Crown, Euro, Search, Eye, UserX, UserCheck2, Shield, ShieldOff } from "lucide-react";
import { generateConsistentUsers } from "./shared-user-data";

// Mobile-optimized UserCard component
const UserCard = memo(
	({
		user,
		loadingUserId,
		onViewUser,
		onToggleStatus,
	}: {
		user: any;
		loadingUserId: string | null;
		onViewUser: (userId: string) => void;
		onToggleStatus: (userId: string, status: string) => void;
	}) => {
		return (
			<Card className="p-4 hover:shadow-sm transition-shadow border border-border/40">
				<div className="space-y-3">
					{/* Header with Avatar and Badges */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3 flex-1 min-w-0">
							<Avatar className="h-11 w-11 flex-shrink-0">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className="text-xs">
									{user.name
										.split(" ")
										.map((n: string) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							<div className="space-y-1 flex-1 min-w-0">
								<p className="font-medium text-sm leading-none truncate">{user.name}</p>
								<p className="text-xs text-muted-foreground truncate">{user.email}</p>
								<div className="flex items-center gap-1.5 mt-1">
									<Badge variant={getPlanBadgeVariant(user.plan)} className="text-[10px] px-1.5 py-0.5 h-auto">
										{user.plan}
									</Badge>
									<Badge variant={getStatusBadgeVariant(user.status)} className="text-[10px] px-1.5 py-0.5 h-auto">
										{user.status}
									</Badge>
								</div>
							</div>
						</div>
					</div>

					{/* Usage Progress */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-xs">
							<span className="text-muted-foreground">Usage</span>
							<span className="font-medium">
								{user.minutesUsed}/{user.minutesTotal} min
							</span>
						</div>
						<div className="w-full bg-muted rounded-full h-1.5">
							<div
								className="bg-primary h-1.5 rounded-full transition-all duration-300"
								style={{ width: `${Math.min((user.minutesUsed / user.minutesTotal) * 100, 100)}%` }}
							/>
						</div>
					</div>

					{/* Footer with Join Date and Actions */}
					<div className="flex items-center justify-between pt-1">
						<span className="text-xs text-muted-foreground">
							Joined{" "}
							{new Date(user.joinDate).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "2-digit",
							})}
						</span>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								className="h-8 px-3 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
								onClick={() => onViewUser(user.id)}
							>
								<Eye className="h-3 w-3 mr-1" />
								View
							</Button>
							<Button
								variant="outline"
								size="sm"
								className={`h-8 px-3 text-xs transition-colors ${
									user.status === "Active"
										? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
										: "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
								}`}
								onClick={() => onToggleStatus(user.id, user.status)}
								disabled={loadingUserId === user.id}
							>
								{loadingUserId === user.id ? (
									<div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
								) : user.status === "Active" ? (
									<ShieldOff className="h-3 w-3" />
								) : (
									<Shield className="h-3 w-3" />
								)}
							</Button>
						</div>
					</div>
				</div>
			</Card>
		);
	},
);

UserCard.displayName = "UserCard";

// Desktop UserRow component (unchanged but memoized)
const UserRow = memo(
	({
		user,
		index,
		loadingUserId,
		onViewUser,
		onToggleStatus,
	}: {
		user: any;
		index: number;
		loadingUserId: string | null;
		onViewUser: (userId: string) => void;
		onToggleStatus: (userId: string, status: string) => void;
	}) => {
		return (
			<tr className={`border-b hover:bg-muted/50 transition-colors ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
				<td className="py-6 px-6">
					<div className="flex items-center space-x-3">
						<Avatar className="h-11 w-11">
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className="text-xs">
								{user.name
									.split(" ")
									.map((n: string) => n[0])
									.join("")}
							</AvatarFallback>
						</Avatar>
						<div className="space-y-1">
							<p className="font-medium text-sm leading-none">{user.name}</p>
							<p className="text-xs text-muted-foreground">{user.email}</p>
						</div>
					</div>
				</td>
				<td className="py-6 px-6">
					<Badge variant={getPlanBadgeVariant(user.plan)} className="text-xs">
						{user.plan}
					</Badge>
				</td>
				<td className="py-6 px-6">
					<Badge variant={getStatusBadgeVariant(user.status)} className="text-xs">
						{user.status}
					</Badge>
				</td>
				<td className="py-6 px-6">
					<div className="space-y-2 min-w-24">
						<div className="text-xs font-medium">
							{user.minutesUsed}/{user.minutesTotal} min
						</div>
						<div className="w-full bg-muted rounded-full h-1.5">
							<div
								className="bg-primary h-1.5 rounded-full transition-all duration-300"
								style={{ width: `${Math.min((user.minutesUsed / user.minutesTotal) * 100, 100)}%` }}
							/>
						</div>
					</div>
				</td>
				<td className="py-6 px-6 text-xs text-muted-foreground">
					{new Date(user.joinDate).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</td>
				<td className="py-6 px-6">
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							className="h-9 px-3 text-xs hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
							title="View Details"
							onClick={() => onViewUser(user.id)}
						>
							<Eye className="h-4 w-4 mr-1.5" />
							View
						</Button>
						<Button
							variant="outline"
							size="sm"
							className={`h-9 px-3 text-xs transition-colors ${
								user.status === "Active"
									? "hover:bg-red-50 hover:text-red-600 hover:border-red-200"
									: "hover:bg-green-50 hover:text-green-600 hover:border-green-200"
							}`}
							onClick={() => onToggleStatus(user.id, user.status)}
							disabled={loadingUserId === user.id}
							title={user.status === "Active" ? "Suspend User" : "Activate User"}
						>
							{loadingUserId === user.id ? (
								<>
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-1.5" />
									{user.status === "Active" ? "Suspending..." : "Activating..."}
								</>
							) : user.status === "Active" ? (
								<>
									<ShieldOff className="h-4 w-4 mr-1.5" />
									Suspend
								</>
							) : (
								<>
									<Shield className="h-4 w-4 mr-1.5" />
									Activate
								</>
							)}
						</Button>
					</div>
				</td>
			</tr>
		);
	},
);

UserRow.displayName = "UserRow";

// Helper functions moved outside component to prevent re-creation
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

export default function UsersPage() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [users, setUsers] = useState<any[]>([]);
	const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

	useEffect(() => {
		// Generate users on component mount using shared data generator
		setUsers(generateConsistentUsers(50));
	}, []);

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Mock API call to toggle user status
	const toggleUserStatus = useCallback(
		async (userId: string, currentStatus: string) => {
			setLoadingUserId(userId);

			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setUsers((prevUsers) =>
				prevUsers.map((user) =>
					user.id === userId ? { ...user, status: currentStatus === "Active" ? "Suspended" : "Active" } : user,
				),
			);

			const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
			const user = users.find((u) => u.id === userId);

			if (newStatus === "Suspended") {
				toast.error(`${user?.name} has been suspended`);
			} else {
				toast.success(`${user?.name} has been activated`);
			}

			setLoadingUserId(null);
		},
		[users],
	);

	// Memoized callback functions to prevent unnecessary re-renders
	const handleViewUser = useCallback(
		(userId: string) => {
			navigate(`/users/${userId}`);
		},
		[navigate],
	);

	const handleToggleStatus = useCallback((userId: string, currentStatus: string) => {
		toggleUserStatus(userId, currentStatus);
	}, []);

	const totalRevenue = users
		.filter((u) => u.subscription && u.subscription.packageSnapshot.price > 0)
		.reduce((sum, u) => sum + u.subscription.packageSnapshot.price, 0);

	return (
		<div className="flex flex-col h-screen overflow-hidden">
			{/* Mobile Header - Show only on mobile */}
			<div className="md:hidden p-4 border-b bg-background">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold">Users</h1>
					<div className="text-sm text-muted-foreground">{filteredUsers.length} total</div>
				</div>
			</div>

			{/* Fixed Stats Cards - Hidden on mobile */}
			<div className="flex-shrink-0 p-6 hidden md:block">
				<div className="grid gap-4 md:grid-cols-4">
					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Total Users</p>
								<p className="text-2xl font-semibold">{users.length}</p>
							</div>
							<Users className="h-8 w-8 text-muted-foreground" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Active Users</p>
								<p className="text-2xl font-semibold">{users.filter((u) => u.status === "Active").length}</p>
							</div>
							<UserCheck className="h-8 w-8 text-muted-foreground" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Premium Users</p>
								<p className="text-2xl font-semibold">{users.filter((u) => u.plan !== "Free").length}</p>
							</div>
							<Crown className="h-8 w-8 text-muted-foreground" />
						</div>
					</Card>

					<Card className="p-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
								<p className="text-2xl font-semibold">
									€{totalRevenue.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
								</p>
							</div>
							<Euro className="h-8 w-8 text-muted-foreground" />
						</div>
					</Card>
				</div>
			</div>

			{/* Scrollable Users Content */}
			<div className="flex-1 flex flex-col min-h-0 mx-6 mb-6">
				<Card className="flex-1 flex flex-col min-h-0">
					<CardHeader className="flex-shrink-0 pb-4">
						<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
							<CardTitle className="text-lg font-medium">All Users ({filteredUsers.length})</CardTitle>
							<div className="relative w-full md:w-72">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input
									placeholder="Search users by name or email..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="pl-10"
								/>
							</div>
						</div>
					</CardHeader>
					<Separator />
					<CardContent className="flex-1 min-h-0 p-0">
						<ScrollArea className="h-full">
							{/* Mobile Card Layout */}
							<div className="md:hidden p-4 space-y-4">
								{filteredUsers.map((user) => (
									<UserCard
										key={user.id}
										user={user}
										loadingUserId={loadingUserId}
										onViewUser={handleViewUser}
										onToggleStatus={handleToggleStatus}
									/>
								))}
							</div>

							{/* Desktop Table Layout */}
							<div className="hidden md:block min-w-full">
								<table className="w-full">
									<thead className="sticky top-0 bg-background border-b">
										<tr>
											<th className="text-left py-5 px-6 font-medium text-sm">User</th>
											<th className="text-left py-5 px-6 font-medium text-sm">Plan</th>
											<th className="text-left py-5 px-6 font-medium text-sm">Status</th>
											<th className="text-left py-5 px-6 font-medium text-sm">Usage</th>
											<th className="text-left py-5 px-6 font-medium text-sm">Joined</th>
											<th className="text-left py-5 px-6 font-medium text-sm">Actions</th>
										</tr>
									</thead>
									<tbody>
										{filteredUsers.map((user, index) => (
											<UserRow
												key={user.id}
												user={user}
												index={index}
												loadingUserId={loadingUserId}
												onViewUser={handleViewUser}
												onToggleStatus={handleToggleStatus}
											/>
										))}
									</tbody>
								</table>
							</div>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
