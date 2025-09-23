import { AlertTriangle } from "lucide-react";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/ui/dialog";

interface DeleteConfirmationDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	packageName: string;
	loading: boolean;
}

export function DeleteConfirmationDialog({
	isOpen,
	onClose,
	onConfirm,
	packageName,
	loading,
}: DeleteConfirmationDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
							<AlertTriangle className="h-5 w-5 text-red-600" />
						</div>
						<div>
							<DialogTitle>Delete Package</DialogTitle>
							<DialogDescription className="mt-1">This action cannot be undone.</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="py-4">
					<p className="text-sm text-muted-foreground">
						Are you sure you want to delete the package{" "}
						<span className="font-medium text-foreground">"{packageName}"</span>?
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						This will permanently remove the package and cannot be recovered.
					</p>
				</div>

				<DialogFooter className="gap-2">
					<Button variant="outline" onClick={onClose} disabled={loading}>
						Cancel
					</Button>
					<Button variant="destructive" onClick={onConfirm} disabled={loading}>
						{loading ? (
							<>
								<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
								Deleting...
							</>
						) : (
							"Delete Package"
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
