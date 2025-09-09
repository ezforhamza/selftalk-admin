import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { DialogFooter } from "@/ui/dialog";
import { Card } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { useState } from "react";
import { Plus, X, Edit2 } from "lucide-react";

interface PackageFormData {
	name: string;
	description: string;
	price: number;
	billingCycle: "monthly" | "yearly";
	voiceMinutes: number;
	features: string[];
	isActive: boolean;
	isPopular: boolean;
}

interface PackageFormProps {
	formData: PackageFormData;
	setFormData: (data: PackageFormData) => void;
	onSubmit: () => void;
	loading: boolean;
	isEdit?: boolean;
}

export function PackageForm({ formData, setFormData, onSubmit, loading, isEdit = false }: PackageFormProps) {
	const [newFeature, setNewFeature] = useState("");
	const [editingFeatureIndex, setEditingFeatureIndex] = useState<number | null>(null);
	const [editingFeatureText, setEditingFeatureText] = useState("");

	const handleSubmit = () => {
		onSubmit();
	};

	const addFeature = () => {
		if (newFeature.trim()) {
			setFormData({
				...formData,
				features: [...formData.features, newFeature.trim()],
			});
			setNewFeature("");
		}
	};

	const removeFeature = (index: number) => {
		setFormData({
			...formData,
			features: formData.features.filter((_, i) => i !== index),
		});
	};

	const startEditingFeature = (index: number) => {
		setEditingFeatureIndex(index);
		setEditingFeatureText(formData.features[index]);
	};

	const saveFeatureEdit = () => {
		if (editingFeatureIndex !== null && editingFeatureText.trim()) {
			const newFeatures = [...formData.features];
			newFeatures[editingFeatureIndex] = editingFeatureText.trim();
			setFormData({
				...formData,
				features: newFeatures,
			});
			setEditingFeatureIndex(null);
			setEditingFeatureText("");
		}
	};

	const cancelFeatureEdit = () => {
		setEditingFeatureIndex(null);
		setEditingFeatureText("");
	};

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="name">Package Name</Label>
					<Input
						id="name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="e.g., Premium"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="price">Price</Label>
					<Input
						id="price"
						type="number"
						step="0.01"
						value={formData.price}
						onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
						placeholder="9.99"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					value={formData.description}
					onChange={(e) => setFormData({ ...formData, description: e.target.value })}
					placeholder="Brief description of the package"
					rows={2}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="billingCycle">Billing Cycle</Label>
					<Select
						value={formData.billingCycle}
						onValueChange={(value) => setFormData({ ...formData, billingCycle: value as "monthly" | "yearly" })}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="monthly">Monthly</SelectItem>
							<SelectItem value="yearly">Yearly</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="voiceMinutes">Voice Minutes</Label>
					<Input
						id="voiceMinutes"
						type="number"
						value={formData.voiceMinutes}
						onChange={(e) => setFormData({ ...formData, voiceMinutes: parseInt(e.target.value) || 0 })}
						placeholder="50"
					/>
				</div>
			</div>

			<div className="space-y-3">
				<Label>Features</Label>

				{/* Existing Features */}
				<Card className="p-4">
					<div className="space-y-2 max-h-48 overflow-y-auto">
						{formData.features.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								No features added yet. Add some features below.
							</p>
						) : (
							formData.features.map((feature, index) => (
								<div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
									{editingFeatureIndex === index ? (
										<>
											<Input
												value={editingFeatureText}
												onChange={(e) => setEditingFeatureText(e.target.value)}
												className="flex-1 h-8"
												autoFocus
												onKeyDown={(e) => {
													if (e.key === "Enter") saveFeatureEdit();
													if (e.key === "Escape") cancelFeatureEdit();
												}}
											/>
											<Button size="sm" onClick={saveFeatureEdit} className="h-8 px-2">
												Save
											</Button>
											<Button size="sm" variant="outline" onClick={cancelFeatureEdit} className="h-8 px-2">
												Cancel
											</Button>
										</>
									) : (
										<>
											<div className="h-1.5 w-1.5 bg-primary rounded-full flex-shrink-0" />
											<span className="flex-1 text-sm">{feature}</span>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => startEditingFeature(index)}
												className="h-8 w-8 p-0"
												type="button"
											>
												<Edit2 className="h-3 w-3" />
											</Button>
											<Button
												size="sm"
												variant="ghost"
												onClick={() => removeFeature(index)}
												className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
												type="button"
											>
												<X className="h-3 w-3" />
											</Button>
										</>
									)}
								</div>
							))
						)}
					</div>
				</Card>

				{/* Add New Feature */}
				<div className="flex gap-2">
					<Input
						value={newFeature}
						onChange={(e) => setNewFeature(e.target.value)}
						placeholder="Add a new feature..."
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addFeature();
							}
						}}
					/>
					<Button type="button" onClick={addFeature} disabled={!newFeature.trim()} className="whitespace-nowrap">
						<Plus className="h-4 w-4 mr-1" />
						Add Feature
					</Button>
				</div>
			</div>

			<div className="flex items-center space-x-4">
				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						id="isActive"
						checked={formData.isActive}
						onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
						className="rounded"
					/>
					<Label htmlFor="isActive">Active</Label>
				</div>
			</div>

			<DialogFooter>
				<Button onClick={handleSubmit} disabled={loading || !formData.name || formData.price < 0} className="w-full">
					{loading ? (
						<>
							<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
							{isEdit ? "Updating..." : "Creating..."}
						</>
					) : isEdit ? (
						"Update Package"
					) : (
						"Create Package"
					)}
				</Button>
			</DialogFooter>
		</div>
	);
}
