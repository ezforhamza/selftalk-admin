import { Crown, Package, Zap } from "lucide-react";
import { Card } from "@/ui/card";

interface PackageStatsProps {
	packages: any[];
}

export function PackageStats({ packages }: PackageStatsProps) {
	const paidPackages = packages.filter((pkg) => pkg.price > 0);
	const averagePrice =
		paidPackages.length > 0 ? paidPackages.reduce((sum, pkg) => sum + pkg.price, 0) / paidPackages.length : 0;

	return (
		<div className="p-6 hidden md:block">
			<div className="grid gap-4 md:grid-cols-3 mb-6">
				<Card className="p-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">Total Packages</p>
							<p className="text-2xl font-semibold">{packages.length}</p>
						</div>
						<Package className="h-8 w-8 text-muted-foreground" />
					</div>
				</Card>

				<Card className="p-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">Active Plans</p>
							<p className="text-2xl font-semibold">{packages.filter((p) => p.isActive).length}</p>
						</div>
						<Zap className="h-8 w-8 text-muted-foreground" />
					</div>
				</Card>

				<Card className="p-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<p className="text-sm font-medium text-muted-foreground">Avg. Price</p>
							<p className="text-2xl font-semibold">${averagePrice.toFixed(0)}</p>
						</div>
						<Crown className="h-8 w-8 text-muted-foreground" />
					</div>
				</Card>
			</div>
		</div>
	);
}
