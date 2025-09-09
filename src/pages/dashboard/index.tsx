import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Users, Crown, Clock, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { generateConsistentUsers } from "../users/shared-user-data";

const subscriptionData = [
	{ name: "Free Users", value: 55, count: 2310 },
	{ name: "Premium Users", value: 30, count: 1260 },
	{ name: "Super Users", value: 15, count: 630 },
];

const usageData = [
	{ month: "Jan", minutes: 145230 },
	{ month: "Feb", minutes: 158420 },
	{ month: "Mar", minutes: 172890 },
	{ month: "Apr", minutes: 185670 },
	{ month: "May", minutes: 198340 },
	{ month: "Jun", minutes: 212580 },
];

const COLORS = ["#10b981", "#f59e0b", "#8b5cf6"];

export default function DashboardPage() {
	const navigate = useNavigate();
	const [stats, setStats] = useState({
		totalUsers: 0,
		freeUsers: 0,
		premiumUsers: 0,
		superUsers: 0,
		totalMinutes: 0,
	});
	const [topUsers, setTopUsers] = useState<any[]>([]);

	useEffect(() => {
		const totalUsers = subscriptionData.reduce((sum, item) => sum + item.count, 0);
		const freeUsers = subscriptionData.find((item) => item.name === "Free Users")?.count || 0;
		const premiumUsers = subscriptionData.find((item) => item.name === "Premium Users")?.count || 0;
		const superUsers = subscriptionData.find((item) => item.name === "Super Users")?.count || 0;
		const totalMinutes = usageData[usageData.length - 1].minutes;

		setStats({
			totalUsers,
			freeUsers,
			premiumUsers,
			superUsers,
			totalMinutes,
		});

		// Generate top 5 users by usage
		const allUsers = generateConsistentUsers(50);
		const sortedUsers = allUsers.sort((a, b) => b.minutesUsed - a.minutesUsed).slice(0, 5);
		setTopUsers(sortedUsers);
	}, []);

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

				{/* Charts */}
				<div className="grid gap-6 md:grid-cols-2 mb-6">
					{/* Subscription Distribution */}
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
											{subscriptionData.map((entry) => (
												<Cell key={entry.name} fill={COLORS[subscriptionData.indexOf(entry) % COLORS.length]} />
											))}
										</Pie>
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="flex justify-center space-x-4 mt-4">
								{subscriptionData.map((entry) => (
									<div key={entry.name} className="flex items-center text-sm">
										<div
											className="w-3 h-3 rounded-full mr-2"
											style={{ backgroundColor: COLORS[subscriptionData.indexOf(entry)] }}
										/>
										<span className="text-muted-foreground">{entry.name}</span>
										<span className="ml-1 font-medium">{entry.value}%</span>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					{/* Usage Trend */}
					<Card>
						<CardHeader>
							<CardTitle className="text-base">Monthly Usage Trend</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart data={usageData}>
										<defs>
											<linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
												<stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
										<XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} fill="#64748b" />
										<YAxis
											axisLine={false}
											tickLine={false}
											fontSize={12}
											fill="#64748b"
											tickFormatter={(value) => `${Math.round(value / 1000)}k`}
										/>
										<Area
											type="monotone"
											dataKey="minutes"
											stroke="#3b82f6"
											fillOpacity={1}
											fill="url(#colorUsage)"
											strokeWidth={2}
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
							<div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
								<TrendingUp className="h-4 w-4 mr-2 text-emerald-600" />
								+12.5% from last month
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
						<div className="grid gap-0 md:grid-cols-5">
							{topUsers.map((user, index) => (
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
											<AvatarImage src={user.avatar} alt={user.name} />
											<AvatarFallback className="text-xs font-medium">
												{user.name
													.split(" ")
													.map((n: string) => n[0])
													.join("")}
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
											{Math.round((user.minutesUsed / user.minutesTotal) * 100)}% used
										</p>

										{/* Clean Progress Bar */}
										<div className="w-full bg-muted/60 rounded-full h-1 mt-2">
											<div
												className="bg-primary h-1 rounded-full transition-all duration-300"
												style={{ width: `${Math.min((user.minutesUsed / user.minutesTotal) * 100, 100)}%` }}
											/>
										</div>
									</div>
								</button>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
