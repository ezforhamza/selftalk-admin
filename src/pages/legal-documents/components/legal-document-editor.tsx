import { useState, useEffect } from "react";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { toast } from "sonner";
import { Save, Eye, Edit } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";

interface LegalDocumentEditorProps {
	title: string;
	documentType: "privacy-policy" | "terms-conditions";
	initialContent?: string;
	onSave: (content: string) => Promise<void>;
	onLoad: () => Promise<string>;
}

export default function LegalDocumentEditor({
	title,
	documentType,
	initialContent = "",
	onSave,
	onLoad,
}: LegalDocumentEditorProps) {
	const [content, setContent] = useState(initialContent);
	const [isEditing, setIsEditing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingContent, setLoadingContent] = useState(true);

	useEffect(() => {
		loadContent();
	}, []);

	const loadContent = async () => {
		try {
			setLoadingContent(true);
			const loadedContent = await onLoad();
			setContent(loadedContent);
		} catch (error) {
			toast.error("Failed to load content");
		} finally {
			setLoadingContent(false);
		}
	};

	const handleSave = async () => {
		if (!content.trim()) {
			toast.error("Content cannot be empty");
			return;
		}

		try {
			setLoading(true);
			await onSave(content);
			setIsEditing(false);
			toast.success(`${title} updated successfully`);
		} catch (error) {
			toast.error("Failed to save content");
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		loadContent(); // Reset to original content
	};

	if (loadingContent) {
		return (
			<div className="min-h-screen overflow-y-auto">
				<div className="md:hidden p-4 border-b bg-background">
					<h1 className="text-xl font-semibold">{title}</h1>
				</div>
				<div className="p-6">
					<div className="flex justify-center items-center min-h-[400px]">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen overflow-y-auto">
			{/* Mobile Header */}
			<div className="md:hidden p-4 border-b bg-background">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold">{title}</h1>
				</div>
			</div>

			{/* Main Content */}
			<div className="p-6">
				<div className="flex justify-between items-center mb-6">
					<div className="hidden md:block">
						<h2 className="text-lg font-medium">{title}</h2>
					</div>
					<div className="w-full md:w-auto">
						<div className="flex items-center gap-2">
							{!isEditing ? (
								<Button variant="default" size="sm" onClick={() => setIsEditing(true)} className="w-full md:w-auto">
									<Edit className="h-4 w-4 mr-2" />
									Edit
								</Button>
							) : (
								<>
									<Button
										variant="outline"
										size="sm"
										onClick={handleCancel}
										disabled={loading}
										className="w-full md:w-auto"
									>
										Cancel
									</Button>
									<Button
										variant="default"
										size="sm"
										onClick={handleSave}
										disabled={loading || !content.trim()}
										className="w-full md:w-auto"
									>
										{loading ? (
											<>
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
												Saving...
											</>
										) : (
											<>
												<Save className="h-4 w-4 mr-2" />
												Save
											</>
										)}
									</Button>
								</>
							)}
						</div>
					</div>
				</div>

				{isEditing ? (
					<div className="space-y-4">
						<Card>
							<CardContent className="p-6">
								<div className="space-y-4">
									<div className="text-sm text-muted-foreground mb-4">
										Use the editor below to create and format your {title.toLowerCase()}. You can add headings, lists,
										links, and other formatting.
									</div>
									<RichTextEditor
										content={content}
										onChange={setContent}
										placeholder={`Start writing your ${title.toLowerCase()}...`}
									/>
								</div>
							</CardContent>
						</Card>
					</div>
				) : (
					<div className="space-y-4">
						<Card>
							<CardContent className="p-6">
								{content ? (
									<div className="prose prose-sm max-w-none">
										<div dangerouslySetInnerHTML={{ __html: content }} className="text-sm leading-relaxed" />
									</div>
								) : (
									<div className="text-center py-12 text-muted-foreground">
										<Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
										<p className="text-lg font-medium mb-2">No content yet</p>
										<p className="text-sm">Click "Edit" to start writing your {title.toLowerCase()}</p>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				)}

				{!isEditing && content && (
					<div className="mt-6 text-xs text-muted-foreground text-center">
						Last updated:{" "}
						{new Date().toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</div>
				)}
			</div>
		</div>
	);
}
