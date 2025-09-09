import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { TextAlign } from "@tiptap/extension-text-align";
import { FontFamily } from "@tiptap/extension-font-family";
import { Heading } from "@tiptap/extension-heading";
import { Bold } from "@tiptap/extension-bold";
import { Italic } from "@tiptap/extension-italic";
import { Underline } from "@tiptap/extension-underline";
import { Strike } from "@tiptap/extension-strike";
import { Link } from "@tiptap/extension-link";
import { Button } from "@/ui/button";
import { Separator } from "@/ui/separator";
import { cn } from "@/utils";
import {
	Bold as BoldIcon,
	Italic as ItalicIcon,
	Underline as UnderlineIcon,
	Strikethrough,
	Heading1,
	Heading2,
	Heading3,
	List,
	ListOrdered,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Link as LinkIcon,
	Undo,
	Redo,
} from "lucide-react";
import "./styles.css";

interface RichTextEditorProps {
	content: string;
	onChange: (content: string) => void;
	placeholder?: string;
	className?: string;
}

export default function RichTextEditor({
	content,
	onChange,
	placeholder = "Start writing...",
	className,
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			TextStyle,
			Color,
			TextAlign.configure({
				types: ["heading", "paragraph"],
			}),
			FontFamily,
			Heading.configure({
				levels: [1, 2, 3],
			}),
			Bold,
			Italic,
			Underline,
			Strike,
			Link.configure({
				openOnClick: false,
			}),
		],
		content,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML());
		},
		editorProps: {
			attributes: {
				class: cn(
					"prose prose-sm max-w-none min-h-[400px] px-4 py-3 focus:outline-none",
					"prose-headings:font-semibold prose-p:leading-relaxed",
					className,
				),
			},
		},
	});

	if (!editor) {
		return null;
	}

	const addLink = () => {
		const url = window.prompt("Enter URL:");
		if (url) {
			editor.chain().focus().setLink({ href: url }).run();
		}
	};

	const ToolbarButton = ({
		onClick,
		isActive,
		children,
		title,
	}: {
		onClick: () => void;
		isActive?: boolean;
		children: React.ReactNode;
		title: string;
	}) => (
		<Button
			variant={isActive ? "default" : "ghost"}
			size="sm"
			onClick={onClick}
			title={title}
			className="h-8 w-8 p-0"
			type="button"
		>
			{children}
		</Button>
	);

	return (
		<div className="border border-border rounded-lg overflow-hidden">
			{/* Toolbar */}
			<div className="border-b bg-muted/30 p-2">
				<div className="flex items-center gap-1 flex-wrap">
					{/* Text Formatting */}
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleBold().run()}
						isActive={editor.isActive("bold")}
						title="Bold"
					>
						<BoldIcon className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleItalic().run()}
						isActive={editor.isActive("italic")}
						title="Italic"
					>
						<ItalicIcon className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleUnderline().run()}
						isActive={editor.isActive("underline")}
						title="Underline"
					>
						<UnderlineIcon className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleStrike().run()}
						isActive={editor.isActive("strike")}
						title="Strikethrough"
					>
						<Strikethrough className="h-4 w-4" />
					</ToolbarButton>

					<Separator orientation="vertical" className="h-6 mx-1" />

					{/* Headings */}
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
						isActive={editor.isActive("heading", { level: 1 })}
						title="Heading 1"
					>
						<Heading1 className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
						isActive={editor.isActive("heading", { level: 2 })}
						title="Heading 2"
					>
						<Heading2 className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
						isActive={editor.isActive("heading", { level: 3 })}
						title="Heading 3"
					>
						<Heading3 className="h-4 w-4" />
					</ToolbarButton>

					<Separator orientation="vertical" className="h-6 mx-1" />

					{/* Lists */}
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleBulletList().run()}
						isActive={editor.isActive("bulletList")}
						title="Bullet List"
					>
						<List className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
						isActive={editor.isActive("orderedList")}
						title="Ordered List"
					>
						<ListOrdered className="h-4 w-4" />
					</ToolbarButton>

					<Separator orientation="vertical" className="h-6 mx-1" />

					{/* Text Alignment */}
					<ToolbarButton
						onClick={() => editor.chain().focus().setTextAlign("left").run()}
						isActive={editor.isActive({ textAlign: "left" })}
						title="Align Left"
					>
						<AlignLeft className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().setTextAlign("center").run()}
						isActive={editor.isActive({ textAlign: "center" })}
						title="Align Center"
					>
						<AlignCenter className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton
						onClick={() => editor.chain().focus().setTextAlign("right").run()}
						isActive={editor.isActive({ textAlign: "right" })}
						title="Align Right"
					>
						<AlignRight className="h-4 w-4" />
					</ToolbarButton>

					<Separator orientation="vertical" className="h-6 mx-1" />

					{/* Link */}
					<ToolbarButton onClick={addLink} isActive={editor.isActive("link")} title="Add Link">
						<LinkIcon className="h-4 w-4" />
					</ToolbarButton>

					<Separator orientation="vertical" className="h-6 mx-1" />

					{/* Undo/Redo */}
					<ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
						<Undo className="h-4 w-4" />
					</ToolbarButton>
					<ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
						<Redo className="h-4 w-4" />
					</ToolbarButton>
				</div>
			</div>

			{/* Editor */}
			<div className="min-h-[400px] bg-background">
				<EditorContent editor={editor} placeholder={placeholder} className="min-h-[400px]" />
			</div>
		</div>
	);
}
