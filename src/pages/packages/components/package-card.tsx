import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Edit, Trash2, Gift, Zap, Crown, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PackageType {
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

interface PackageCardProps {
	package: PackageType;
	onEdit: () => void;
	onDelete: () => void;
	onToggleStatus: () => void;
	loading: boolean;
}

export function PackageCard({ package: pkg, onEdit, onDelete, onToggleStatus, loading }: PackageCardProps) {
	const [showAllFeatures, setShowAllFeatures] = useState(false);

	const getPackageIcon = (name: string) => {
		if (name.toLowerCase().includes("free")) return <Gift className="h-5 w-5" />;
		if (name.toLowerCase().includes("super")) return <Zap className="h-5 w-5" />;
		return <Crown className="h-5 w-5" />;
	};

	const displayFeatures = showAllFeatures ? pkg.features : pkg.features.slice(0, 3);

	return (
		<Card className={`relative transition-all duration-200 hover:shadow-md ${!pkg.isActive ? "opacity-60" : ""}`}>
			<CardContent className="p-6">
				<div className="space-y-4">
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-2">
							{getPackageIcon(pkg.name)}
							<h3 className="text-lg font-semibold">{pkg.name}</h3>
						</div>
						<Badge variant={pkg.isActive ? "default" : "secondary"}>{pkg.isActive ? "Active" : "Inactive"}</Badge>
					</div>

					<p className="text-sm text-muted-foreground">{pkg.description}</p>

					<div className="space-y-2">
						<div className="flex items-baseline gap-1">
							<span className="text-2xl font-bold">
								€{pkg.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
							</span>
							<span className="text-sm text-muted-foreground">/{pkg.billingCycle}</span>
						</div>
						<p className="text-sm font-medium text-primary">{pkg.voiceMinutes} voice minutes</p>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<p className="text-xs font-medium text-muted-foreground">Features:</p>
							{pkg.features.length > 3 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setShowAllFeatures(!showAllFeatures)}
									className="h-6 px-2 text-xs"
								>
									{showAllFeatures ? (
										<>
											<ChevronUp className="h-3 w-3 mr-1" />
											Show Less
										</>
									) : (
										<>
											<ChevronDown className="h-3 w-3 mr-1" />
											Show All ({pkg.features.length})
										</>
									)}
								</Button>
							)}
						</div>
						<div className="space-y-1 max-h-32 overflow-y-auto">
							{displayFeatures.map((feature, index) => (
								<div key={index} className="flex items-start gap-2">
									<div className="h-1 w-1 bg-primary rounded-full flex-shrink-0 mt-2" />
									<span className="text-xs leading-relaxed">{feature}</span>
								</div>
							))}
							{!showAllFeatures && pkg.features.length > 3 && (
								<div className="text-xs text-muted-foreground">+{pkg.features.length - 3} more features</div>
							)}
						</div>
					</div>

					<div className="flex items-center gap-2 pt-2">
						<Button variant="outline" size="sm" onClick={onEdit} disabled={loading} className="flex-1">
							<Edit className="h-3 w-3 mr-1" />
							Edit
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onToggleStatus}
							disabled={loading}
							className={`flex-1 ${pkg.isActive ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-green-50 hover:text-green-600"}`}
						>
							{loading ? (
								<div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-1" />
							) : null}
							{pkg.isActive ? "Disable" : "Enable"}
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onDelete}
							disabled={loading}
							className="hover:bg-red-50 hover:text-red-600"
						>
							<Trash2 className="h-3 w-3" />
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
