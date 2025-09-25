import { useQuery } from "@tanstack/react-query";
import { Clock, Crown, Users } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import adminUsersService from "@/api/services/adminUsersService";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

const COLORS = ["#10b981", "#f59e0b", "#8b5cf6", "#3b82f6", "#e11d48"];

// Base URL for profile pictures
const PROFILE_PICTURE_BASE_URL = "https://selftalk-backend-yw3r.onrender.com";

// Avatar background colors for fallbacks
const AVATAR_COLORS = [
	"bg-red-500",
	"bg-orange-500",
	"bg-amber-500",
	"bg-yellow-500",
	"bg-lime-500",
	"bg-green-500",
	"bg-emerald-500",
	"bg-teal-500",
	"bg-cyan-500",
	"bg-sky-500",
	"bg-blue-500",
	"bg-indigo-500",
	"bg-violet-500",
	"bg-purple-500",
	"bg-fuchsia-500",
	"bg-pink-500",
	"bg-rose-500",
];

// Dashboard interfaces
interface DashboardStats {
	totalUsers: number;
	freeUsers: number;
	premiumUsers: number;
	superUsers: number;
	totalMinutes: number;
}

interface SubscriptionDistribution {
	name: string;
	value: number;
	count: number;
}

interface TopUser {
	id: string;
	name: string;
	email: string;
	avatar: string;
	plan: string;
	minutesUsed: number;
	minutesTotal: number;
}

export default function DashboardPage() {
	const navigate = useNavigate();

	// Fetch users data using React Query (same as users page)
	const {
		data: usersData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["dashboard-users"],
		queryFn: () => adminUsersService.getUsers(1, 1000), // Get first 1000 users for dashboard stats
	});

	const users = usersData?.users || [];

	// Calculate dashboard data from users
	const { stats, subscriptionData, topUsers } = useMemo(() => {
		if (users.length === 0) {
			return {
				stats: { totalUsers: 0, freeUsers: 0, premiumUsers: 0, superUsers: 0, totalMinutes: 0 },
				subscriptionData: [
					{ name: "Free Users", value: 0, count: 0 },
					{ name: "Premium Users", value: 0, count: 0 },
					{ name: "Super Users", value: 0, count: 0 },
				],
				topUsers: [],
			};
		}

		// Calculate plan distribution
		const planCounts = users.reduce((acc, user) => {
			const plan = user.plan || "Free";
			acc[plan] = (acc[plan] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const totalUsers = users.length;
		const freeUsers = planCounts.Free || 0;
		const premiumUsers = planCounts.Premium || 0;
		const superUsers = planCounts.Super || 0;

		// Calculate total minutes used
		const totalMinutes = users.reduce((sum, user) => sum + user.minutesUsed, 0);

		const calculatedStats: DashboardStats = {
			totalUsers,
			freeUsers,
			premiumUsers,
			superUsers,
			totalMinutes,
		};

		// Subscription distribution
		const distribution: SubscriptionDistribution[] = [
			{
				name: "Free Users",
				count: freeUsers,
				value: totalUsers > 0 ? Math.round((freeUsers / totalUsers) * 100) : 0,
			},
			{
				name: "Premium Users",
				count: premiumUsers,
				value: totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0,
			},
			{
				name: "Super Users",
				count: superUsers,
				value: totalUsers > 0 ? Math.round((superUsers / totalUsers) * 100) : 0,
			},
		];

		// Add any other plans
		Object.keys(planCounts).forEach(planName => {
			if (!["Free", "Premium", "Super"].includes(planName)) {
				distribution.push({
					name: `${planName} Users`,
					count: planCounts[planName],
					value: totalUsers > 0 ? Math.round((planCounts[planName] / totalUsers) * 100) : 0,
				});
			}
		});

		// Top 5 users by usage
		const sortedUsers = users
			.filter(user => user.minutesUsed > 0)
			.sort((a, b) => b.minutesUsed - a.minutesUsed)
			.slice(0, 5);

		// If less than 5 users with usage, fill with users who have minutes allocated
		const remainingSlots = 5 - sortedUsers.length;
		if (remainingSlots > 0) {
			const usersWithMinutes = users
				.filter(user => user.minutesUsed === 0 && user.minutesTotal > 0)
				.slice(0, remainingSlots);
			sortedUsers.push(...usersWithMinutes);
		}

		// If still less than 5, fill with any remaining users
		const finalRemainingSlots = 5 - sortedUsers.length;
		if (finalRemainingSlots > 0) {
			const existingIds = new Set(sortedUsers.map(u => u.id));
			const anyRemainingUsers = users
				.filter(user => !existingIds.has(user.id))
				.slice(0, finalRemainingSlots);
			sortedUsers.push(...anyRemainingUsers);
		}

		const topUsersFormatted: TopUser[] = sortedUsers.map(user => ({
			id: user.id,
			name: user.name,
			email: user.email,
			avatar: user.avatar,
			plan: user.plan,
			minutesUsed: user.minutesUsed,
			minutesTotal: user.minutesTotal,
		}));

		return {
			stats: calculatedStats,
			subscriptionData: distribution,
			topUsers: topUsersFormatted,
		};
	}, [users]);

	const handleUserClick = (userId: string) => {
		navigate(`/users/${userId}`);
	};

	const getRankColor = (rank: number) => {
		if (rank === 1) return "text-yellow-600";
		if (rank === 2) return "text-gray-500";
		if (rank === 3) return "text-amber-600";
		return "text-primary";
	};

	const formatMinutes = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		return `${hours.toLocaleString()}h`;
	};

	// Generate consistent avatar background color based on user ID
	const getAvatarBgColor = (userId: string) => {
		let hash = 0;
		for (let i = 0; i < userId.length; i++) {
			const char = userId.charCodeAt(i);
			hash = ((hash << 5) - hash) + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		const index = Math.abs(hash) % AVATAR_COLORS.length;
		return AVATAR_COLORS[index];
	};

	// Get complete profile picture URL
	const getProfilePictureUrl = (avatarPath: string | null | undefined) => {
		if (!avatarPath || avatarPath.trim() === '') {
			return '';
		}

		// If the path already includes the base URL, return as is
		if (avatarPath.startsWith('http')) {
			return avatarPath;
		}

		// Remove leading slash if present to avoid double slashes
		const cleanPath = avatarPath.startsWith('/') ? avatarPath.slice(1) : avatarPath;

		return `${PROFILE_PICTURE_BASE_URL}/${cleanPath}`;
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="min-h-screen overflow-y-auto">
				<div className="md:hidden p-4 border-b bg-background">
					<h1 className="text-xl font-semibold">Dashboard</h1>
				</div>
				<div className="p-6">
					<div className="flex items-center justify-center min-h-[400px]">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="min-h-screen overflow-y-auto">
				<div className="md:hidden p-4 border-b bg-background">
					<h1 className="text-xl font-semibold">Dashboard</h1>
				</div>
				<div className="p-6">
					<Card>
						<CardContent className="p-6">
							<div className="text-center">
								<p className="text-red-600 mb-4">Failed to load dashboard data. Please try again.</p>
								<button
									type="button"
									onClick={() => window.location.reload()}
									className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
								>
									Retry
								</button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen overflow-y-auto">
			{/* Mobile Header */}
			<div className="md:hidden p-4 border-b bg-background">
				<h1 className="text-xl font-semibold">Dashboard</h1>
			</div>

			{/* Main Content */}
			<div className="p-6">
				{/* Stats Cards */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Total Users</p>
									<p className="text-2xl font-semibold">{stats.totalUsers.toLocaleString()}</p>
								</div>
								<Users className="h-5 w-5 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Free Users</p>
									<p className="text-2xl font-semibold">{stats.freeUsers.toLocaleString()}</p>
								</div>
								<Users className="h-5 w-5 text-emerald-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Premium Users</p>
									<p className="text-2xl font-semibold">{stats.premiumUsers.toLocaleString()}</p>
								</div>
								<Crown className="h-5 w-5 text-amber-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Super Users</p>
									<p className="text-2xl font-semibold">{stats.superUsers.toLocaleString()}</p>
								</div>
								<Crown className="h-5 w-5 text-purple-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm text-muted-foreground">Minutes Used</p>
									<p className="text-2xl font-semibold">{formatMinutes(stats.totalMinutes)}</p>
								</div>
								<Clock className="h-5 w-5 text-muted-foreground" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Subscription Distribution Chart */}
				<div className="mb-6">
					<Card>
						<CardHeader>
							<CardTitle className="text-base">User Subscription Distribution</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-64 flex items-center justify-center">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={subscriptionData}
											cx="50%"
											cy="50%"
											innerRadius={40}
											outerRadius={80}
											paddingAngle={2}
											dataKey="value"
										>
											{subscriptionData.map((entry, index) => (
												<Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="flex justify-center flex-wrap gap-4 mt-4">
								{subscriptionData.map((entry, index) => (
									<div key={entry.name} className="flex items-center text-sm">
										<div
											className="w-3 h-3 rounded-full mr-2"
											style={{ backgroundColor: COLORS[index % COLORS.length] }}
										/>
										<span className="text-muted-foreground">{entry.name}</span>
										<span className="ml-1 font-medium">{entry.value}%</span>
										<span className="ml-1 text-xs text-muted-foreground">({entry.count})</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Top Users */}
				<Card>
					<CardHeader className="pb-4">
						<CardTitle className="text-base font-medium">Top Performers</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						{topUsers.length === 0 ? (
							<div className="p-8 text-center text-muted-foreground">
								<p>No users data available</p>
							</div>
						) : (
							<div className="grid gap-0 md:grid-cols-5">
								{topUsers.map((user, index) => {
									const usagePercentage = user.minutesTotal > 0
										? Math.round((user.minutesUsed / user.minutesTotal) * 100)
										: 0;

									return (
										<button
											key={user.id}
											type="button"
											onClick={() => handleUserClick(user.id)}
											className="group flex flex-col items-center p-5 text-center hover:bg-muted/30 transition-colors duration-200 border-r border-border/50 last:border-r-0 focus:outline-none focus:bg-muted/40"
										>
											{/* Rank */}
											<div className="mb-3">
												<span className={`text-lg font-bold ${getRankColor(index + 1)}`}>#{index + 1}</span>
											</div>

											{/* Avatar */}
											<div className="relative mb-3">
												<Avatar className="h-12 w-12">
													<AvatarImage
														src={getProfilePictureUrl(user.avatar)}
														alt={user.name}
														className="object-cover"
													/>
													<AvatarFallback className={`text-xs font-medium text-white ${getAvatarBgColor(user.id)}`}>
														{user.name
															.split(" ")
															.map((n: string) => n[0])
															.join("")
															.toUpperCase()
															.slice(0, 2)}
													</AvatarFallback>
												</Avatar>
											</div>

											{/* User Info */}
											<div className="mb-3 space-y-1">
												<p className="font-medium text-sm truncate w-full">{user.name}</p>
												<p className="text-xs text-muted-foreground truncate w-full">{user.email}</p>
											</div>

											{/* Plan Badge */}
											<Badge
												variant={user.plan === "Free" ? "secondary" : user.plan === "Premium" ? "default" : "destructive"}
												className="text-xs px-2 py-1 mb-3 font-medium"
											>
												{user.plan}
											</Badge>

											{/* Usage Stats */}
											<div className="space-y-1 w-full">
												<p className="text-sm font-semibold">
													{Math.floor(user.minutesUsed / 60)}h {user.minutesUsed % 60}m
												</p>
												<p className="text-xs text-muted-foreground">
													{usagePercentage}% used
												</p>

												{/* Clean Progress Bar */}
												<div className="w-full bg-muted/60 rounded-full h-1 mt-2">
													<div
														className="bg-primary h-1 rounded-full transition-all duration-300"
														style={{ width: `${Math.min(usagePercentage, 100)}%` }}
													/>
												</div>
											</div>
										</button>
									);
								})}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
