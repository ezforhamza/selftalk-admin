import { useState, useEffect } from "react";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Textarea } from "@/ui/textarea";

interface FAQ {
	id: number;
	question: string;
	answer: string;
	category: string;
	isActive: boolean;
	createdAt: string;
}

export default function FAQPage() {
	const [faqs, setFaqs] = useState<FAQ[]>([]);
	const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
	const [deletingFaq, setDeletingFaq] = useState<FAQ | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		question: "",
		answer: "",
		category: "General",
	});

	const categories = ["All", "General", "Account", "Billing", "Features", "Technical"];

	useEffect(() => {
		loadFAQs();
	}, []);

	useEffect(() => {
		filterFAQs();
	}, [faqs, searchQuery, selectedCategory]);

	const loadFAQs = async () => {
		try {
			const response = await fetch("/api/faq");
			if (response.ok) {
				const data = await response.json();
				setFaqs(data);
			}
		} catch (error) {
			toast.error("Failed to load FAQs");
		}
	};

	const filterFAQs = () => {
		let filtered = faqs.filter((faq) => faq.isActive);

		if (selectedCategory !== "All") {
			filtered = filtered.filter((faq) => faq.category === selectedCategory);
		}

		if (searchQuery) {
			filtered = filtered.filter(
				(faq) =>
					faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
					faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
			);
		}

		setFilteredFaqs(filtered);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.question.trim() || !formData.answer.trim()) {
			toast.error("Please fill in all fields");
			return;
		}

		try {
			const url = editingFaq ? `/api/faq/${editingFaq.id}` : "/api/faq";
			const method = editingFaq ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				toast.success(editingFaq ? "FAQ updated successfully" : "FAQ created successfully");
				setIsCreateDialogOpen(false);
				setEditingFaq(null);
				setFormData({ question: "", answer: "", category: "General" });
				loadFAQs();
			}
		} catch (error) {
			toast.error("Failed to save FAQ");
		}
	};

	const handleEdit = (faq: FAQ) => {
		setEditingFaq(faq);
		setFormData({
			question: faq.question,
			answer: faq.answer,
			category: faq.category,
		});
		setIsCreateDialogOpen(true);
	};

	const handleDeleteClick = (faq: FAQ) => {
		setDeletingFaq(faq);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!deletingFaq) return;

		try {
			const response = await fetch(`/api/faq/${deletingFaq.id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				toast.success("FAQ deleted successfully");
				setIsDeleteDialogOpen(false);
				setDeletingFaq(null);
				loadFAQs();
			}
		} catch (error) {
			toast.error("Failed to delete FAQ");
		}
	};

	const handleDeleteCancel = () => {
		setIsDeleteDialogOpen(false);
		setDeletingFaq(null);
	};

	const toggleExpanded = (id: number) => {
		const newExpanded = new Set(expandedItems);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedItems(newExpanded);
	};

	const handleDialogClose = () => {
		setIsCreateDialogOpen(false);
		setEditingFaq(null);
		setFormData({ question: "", answer: "", category: "General" });
	};

	return (
		<div className="min-h-screen overflow-y-auto">
			{/* Mobile Header */}
			<div className="md:hidden p-4 border-b bg-background">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold">FAQ Management</h1>
				</div>
			</div>

			{/* Main Content */}
			<div className="p-6">
				<div className="flex justify-between items-center mb-6">
					<div className="hidden md:block">
						<h2 className="text-lg font-medium">FAQ Management</h2>
						<p className="text-sm text-muted-foreground">Manage frequently asked questions and their answers</p>
					</div>
					<div className="w-full md:w-auto">
						<Button
							className="w-full md:w-auto"
							onClick={() => {
								console.log("Add FAQ button clicked");
								setIsCreateDialogOpen(true);
							}}
						>
							<Plus className="h-4 w-4 mr-2" />
							Add FAQ
						</Button>

						<Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
							<DialogContent className="max-w-2xl">
								<DialogHeader>
									<DialogTitle>{editingFaq ? "Edit FAQ" : "Create New FAQ"}</DialogTitle>
								</DialogHeader>
								<form onSubmit={handleSubmit} className="space-y-4">
									<div className="space-y-2">
										<Label htmlFor="category">Category</Label>
										<select
											id="category"
											value={formData.category}
											onChange={(e) => setFormData({ ...formData, category: e.target.value })}
											className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
										>
											{categories.slice(1).map((category) => (
												<option key={category} value={category}>
													{category}
												</option>
											))}
										</select>
									</div>
									<div className="space-y-2">
										<Label htmlFor="question">Question</Label>
										<Input
											id="question"
											value={formData.question}
											onChange={(e) => setFormData({ ...formData, question: e.target.value })}
											placeholder="Enter the question"
											required
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="answer">Answer</Label>
										<Textarea
											id="answer"
											value={formData.answer}
											onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
											placeholder="Enter the answer"
											rows={4}
											required
										/>
									</div>
									<div className="flex justify-end space-x-2">
										<Button type="button" variant="outline" onClick={handleDialogClose}>
											Cancel
										</Button>
										<Button type="submit">{editingFaq ? "Update FAQ" : "Create FAQ"}</Button>
									</div>
								</form>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-4 mb-6">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search FAQs..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<div className="w-full sm:w-48">
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
						>
							{categories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* FAQ List */}
				<div className="space-y-4">
					{filteredFaqs.length === 0 ? (
						<Card>
							<CardContent className="p-12 text-center">
								<p className="text-muted-foreground">No FAQs found</p>
								<p className="text-sm text-muted-foreground mt-1">
									{faqs.length === 0 ? "Create your first FAQ to get started" : "Try adjusting your search or filters"}
								</p>
							</CardContent>
						</Card>
					) : (
						filteredFaqs.map((faq) => (
							<Card key={faq.id}>
								<CardContent className="p-4">
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center cursor-pointer group" onClick={() => toggleExpanded(faq.id)}>
												{expandedItems.has(faq.id) ? (
													<ChevronDown className="h-4 w-4 mr-2 text-muted-foreground" />
												) : (
													<ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
												)}
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-1">
														<span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
															{faq.category}
														</span>
													</div>
													<h3 className="font-medium group-hover:text-primary transition-colors">{faq.question}</h3>
												</div>
											</div>

											{expandedItems.has(faq.id) && (
												<div className="mt-4 ml-6 pr-12">
													<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
														{faq.answer}
													</p>
													<p className="text-xs text-muted-foreground mt-3">
														Created: {new Date(faq.createdAt).toLocaleDateString()}
													</p>
												</div>
											)}
										</div>

										<div className="flex items-center gap-1 ml-4">
											<Button variant="ghost" size="sm" onClick={() => handleEdit(faq)} className="h-8 w-8 p-0">
												<Edit className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleDeleteClick(faq)}
												className="h-8 w-8 p-0 text-destructive hover:text-destructive"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					)}
				</div>

				{/* Delete Confirmation Dialog */}
				<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
					<DialogContent className="max-w-md">
						<DialogHeader>
							<DialogTitle>Delete FAQ</DialogTitle>
						</DialogHeader>
						<div className="py-4">
							<p className="text-sm text-muted-foreground mb-4">
								Are you sure you want to delete this FAQ? This action cannot be undone.
							</p>
							{deletingFaq && (
								<div className="p-3 bg-muted rounded-md">
									<p className="font-medium text-sm">{deletingFaq.question}</p>
									<p className="text-xs text-muted-foreground mt-1">Category: {deletingFaq.category}</p>
								</div>
							)}
						</div>
						<div className="flex justify-end space-x-2">
							<Button variant="outline" onClick={handleDeleteCancel}>
								Cancel
							</Button>
							<Button variant="destructive" onClick={handleDeleteConfirm}>
								Delete FAQ
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
