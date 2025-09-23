import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import plansService from "@/api/services/plansService";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { DeleteConfirmationDialog } from "./components/delete-confirmation-dialog";
import { PackageCard } from "./components/package-card";
import { PackageForm } from "./components/package-form";
import { PackageStats } from "./components/package-stats";
import type { PackageFormData, PackageType } from "./types";

// React Query keys
const QUERY_KEYS = {
	plans: ["plans"] as const,
	plan: (id: string) => ["plans", id] as const,
};

export default function PackagesPage() {
	const queryClient = useQueryClient();
	const [searchTerm] = useState("");
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
	const [deletingPackage, setDeletingPackage] = useState<PackageType | null>(null);
	const [updatingPackageId, setUpdatingPackageId] = useState<string | null>(null);

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

	// Fetch plans
	const {
		data: packages = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: QUERY_KEYS.plans,
		queryFn: () => plansService.getPlans(),
	});

	// Create plan mutation
	const createPlanMutation = useMutation({
		mutationFn: plansService.createPlan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
			setIsCreateOpen(false);
			resetForm();
			toast.success("Package created successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to create package");
		},
	});

	// Update plan mutation
	const updatePlanMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<PackageFormData> }) => plansService.updatePlan(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
			setIsEditOpen(false);
			setEditingPackage(null);
			resetForm();
			toast.success("Package updated successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update package");
		},
	});

	// Toggle status mutation (separate from update mutation)
	const toggleStatusMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<PackageFormData> }) => plansService.updatePlan(id, data),
		onMutate: ({ id }) => {
			// Set loading state for specific package
			setUpdatingPackageId(id);
		},
		onSuccess: (updatedPackage) => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
			const action = updatedPackage.isActive ? "enabled" : "disabled";
			toast.success(`Package ${action} successfully`);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to update package status");
		},
		onSettled: () => {
			// Clear loading state
			setUpdatingPackageId(null);
		},
	});

	// Delete plan mutation
	const deletePlanMutation = useMutation({
		mutationFn: plansService.deletePlan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans });
			setIsDeleteOpen(false);
			setDeletingPackage(null);
			toast.success("Package deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to delete package");
		},
	});

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

	const handleCreate = () => {
		const cleanedFormData = {
			...formData,
			features: formData.features.filter((f) => f.trim()),
		};
		createPlanMutation.mutate(cleanedFormData);
	};

	const handleEdit = () => {
		if (!editingPackage) return;
		const cleanedFormData = {
			...formData,
			features: formData.features.filter((f) => f.trim()),
		};
		updatePlanMutation.mutate({ id: editingPackage.id, data: cleanedFormData });
	};

	const handleDeleteClick = (pkg: PackageType) => {
		setDeletingPackage(pkg);
		setIsDeleteOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (!deletingPackage) return;
		deletePlanMutation.mutate(deletingPackage.id);
	};

	const toggleStatus = (id: string, currentStatus: boolean) => {
		toggleStatusMutation.mutate({
			id,
			data: { isActive: !currentStatus },
		});
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
			isPopular: pkg.isPopular,
		});
		setIsEditOpen(true);
	};

	// Show loading state
	if (isLoading) {
		return (
			<div className="min-h-screen overflow-y-auto flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
					<p>Loading packages...</p>
				</div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="min-h-screen overflow-y-auto flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-500 mb-4">Failed to load packages</p>
					<Button onClick={() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.plans })}>Try Again</Button>
				</div>
			</div>
		);
	}

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
									loading={createPlanMutation.isPending}
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
							loading={updatingPackageId === pkg.id}
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
						loading={updatePlanMutation.isPending}
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
				loading={deletePlanMutation.isPending}
			/>
		</div>
	);
}
