import { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PackageStats } from "./components/package-stats";
import { PackageCard } from "./components/package-card";
import { PackageForm } from "./components/package-form";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";
import type { PackageType, PackageFormData } from "./types";

const generateMockPackages = (count: number): PackageType[] => {
	const packages = [
		{
			name: "Free",
			description: "Perfect for trying out SelfTalk",
			price: 0,
			voiceMinutes: 2,
			features: ["2 voice minutes", "Basic AI companion", "Text conversations", "Standard voice quality"],
			isPopular: false,
		},
		{
			name: "Premium",
			description: "Great for regular users",
			price: 9.99,
			voiceMinutes: 50,
			features: [
				"50 voice minutes",
				"Advanced AI companion",
				"Voice & text conversations",
				"High-quality voice",
				"Priority support",
				"Custom voice settings",
			],
			isPopular: false,
		},
		{
			name: "Super",
			description: "Ultimate experience for power users",
			price: 29.99,
			voiceMinutes: 200,
			features: [
				"200 voice minutes",
				"Premium AI companion",
				"All conversation types",
				"Studio-quality voice",
				"24/7 priority support",
				"Advanced customization",
				"Early access to features",
			],
			isPopular: false,
		},
	];

	return Array.from({ length: Math.min(count, 3) }, (_, index) => {
		const packageTemplate = packages[index];
		const billingCycle = faker.helpers.arrayElement(["monthly", "yearly"] as const);
		const createdAt = faker.date.past({ years: 1 });

		return {
			id: faker.string.uuid(),
			name: packageTemplate.name,
			description: packageTemplate.description,
			price: billingCycle === "yearly" ? packageTemplate.price * 10 : packageTemplate.price,
			currency: "EUR",
			billingCycle,
			features: packageTemplate.features,
			voiceMinutes: packageTemplate.voiceMinutes,
			isActive: faker.datatype.boolean(0.8),
			isPopular: false,
			createdAt: createdAt.toISOString().split("T")[0],
			updatedAt: faker.date.between({ from: createdAt, to: new Date() }).toISOString().split("T")[0],
		};
	});
};

export default function PackagesPage() {
	const [packages, setPackages] = useState<PackageType[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
	const [deletingPackage, setDeletingPackage] = useState<PackageType | null>(null);
	const [loadingId, setLoadingId] = useState<string | null>(null);

	// Form state
	const [formData, setFormData] = useState<PackageFormData>({
		name: "",
		description: "",
		price: 0,
		billingCycle: "monthly",
		voiceMinutes: 0,
		features: [],
		isActive: true,
		isPopular: false,
	});

	useEffect(() => {
		setPackages(generateMockPackages(3));
	}, []);

	const filteredPackages = packages.filter(
		(pkg) =>
			pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			price: 0,
			billingCycle: "monthly",
			voiceMinutes: 0,
			features: [],
			isActive: true,
			isPopular: false,
		});
	};

	const handleCreate = async () => {
		setLoadingId("create");

		await new Promise((resolve) => setTimeout(resolve, 1000));

		const newPackage: PackageType = {
			id: faker.string.uuid(),
			...formData,
			currency: "EUR",
			features: formData.features.filter((f) => f.trim()),
			createdAt: new Date().toISOString().split("T")[0],
			updatedAt: new Date().toISOString().split("T")[0],
		};

		setPackages((prev) => [newPackage, ...prev]);
		setIsCreateOpen(false);
		resetForm();
		toast.success("Package created successfully");
		setLoadingId(null);
	};

	const handleEdit = async () => {
		if (!editingPackage) return;

		setLoadingId("edit");

		await new Promise((resolve) => setTimeout(resolve, 1000));

		setPackages((prev) =>
			prev.map((pkg) =>
				pkg.id === editingPackage.id ? { ...pkg, ...formData, updatedAt: new Date().toISOString().split("T")[0] } : pkg,
			),
		);

		setIsEditOpen(false);
		setEditingPackage(null);
		resetForm();
		toast.success("Package updated successfully");
		setLoadingId(null);
	};

	const handleDeleteClick = (pkg: PackageType) => {
		setDeletingPackage(pkg);
		setIsDeleteOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!deletingPackage) return;

		setLoadingId(deletingPackage.id);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		setPackages((prev) => prev.filter((pkg) => pkg.id !== deletingPackage.id));
		setIsDeleteOpen(false);
		setDeletingPackage(null);
		toast.success("Package deleted successfully");
		setLoadingId(null);
	};

	const toggleStatus = async (id: string, currentStatus: boolean) => {
		setLoadingId(id);

		await new Promise((resolve) => setTimeout(resolve, 1000));

		setPackages((prev) =>
			prev.map((pkg) =>
				pkg.id === id ? { ...pkg, isActive: !currentStatus, updatedAt: new Date().toISOString().split("T")[0] } : pkg,
			),
		);

		const action = currentStatus ? "disabled" : "enabled";
		toast.success(`Package ${action} successfully`);
		setLoadingId(null);
	};

	const openEditDialog = (pkg: PackageType) => {
		setEditingPackage(pkg);
		setFormData({
			name: pkg.name,
			description: pkg.description,
			price: pkg.price,
			billingCycle: pkg.billingCycle,
			voiceMinutes: pkg.voiceMinutes,
			features: pkg.features,
			isActive: pkg.isActive,
			isPopular: false,
		});
		setIsEditOpen(true);
	};

	return (
		<div className="min-h-screen overflow-y-auto">
			<PackageStats packages={packages} />

			{/* Packages Content */}
			<div className="px-6 pb-6">
				<div className="flex justify-between items-center mb-6 md:hidden">
					<h1 className="text-2xl font-bold">Packages</h1>
				</div>

				<div className="flex justify-between items-center mb-6">
					<div className="hidden md:block">
						<h2 className="text-lg font-medium">All Packages ({filteredPackages.length})</h2>
					</div>
					<div className="w-full md:w-auto">
						<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
							<DialogTrigger asChild>
								<Button
									onClick={() => {
										resetForm();
										setIsCreateOpen(true);
									}}
									className="w-full md:w-auto"
								>
									<Plus className="h-4 w-4 mr-2" />
									Add Package
								</Button>
							</DialogTrigger>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>Create New Package</DialogTitle>
									<DialogDescription>Add a new subscription package for SelfTalk users.</DialogDescription>
								</DialogHeader>
								<PackageForm
									formData={formData}
									setFormData={setFormData}
									onSubmit={handleCreate}
									loading={loadingId === "create"}
								/>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
					{filteredPackages.map((pkg) => (
						<PackageCard
							key={pkg.id}
							package={pkg}
							onEdit={() => openEditDialog(pkg)}
							onDelete={() => handleDeleteClick(pkg)}
							onToggleStatus={() => toggleStatus(pkg.id, pkg.isActive)}
							loading={loadingId === pkg.id}
						/>
					))}
				</div>
			</div>

			{/* Edit Dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Package</DialogTitle>
						<DialogDescription>Update the package details.</DialogDescription>
					</DialogHeader>
					<PackageForm
						formData={formData}
						setFormData={setFormData}
						onSubmit={handleEdit}
						loading={loadingId === "edit"}
						isEdit
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmationDialog
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onConfirm={handleDeleteConfirm}
				packageName={deletingPackage?.name || ""}
				loading={loadingId === deletingPackage?.id}
			/>
		</div>
	);
}
