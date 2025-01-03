import type { Editor } from "@tiptap/react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ImageEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  editor: Editor;
  close: () => void;
}

const ImageEditBlock = ({ editor, className, close, ...props }: ImageEditBlockProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [link, setLink] = React.useState<string>("");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleLink = () => {
    editor.chain().focus().setImage({ src: link }).run();
    close();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      editor.chain().setImage({ src }).focus().run();
    };

    reader.readAsDataURL(files[0]);

    close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log(e.currentTarget);
    e.preventDefault();
    e.stopPropagation();
    handleLink();
  };

  return (
    <div className={cn("space-y-6", className)} {...props}>
      <div className="space-y-1">
        <Label>Url de l'image</Label>
        <div className="flex">
          <Input
            type="url"
            required
            placeholder="https://example.com"
            value={link}
            className="grow"
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                editor.chain().focus().setImage({ src: link }).run();
                close();
              }
            }}
          />
          <Button type="button" onClick={handleLink} className="ml-2 inline-block">
            Valider
          </Button>
        </div>
      </div>
      {/* <Button className="w-full" onClick={handleClick}>
          Upload from your computer
        </Button>
        <input type="file" accept="image/*" ref={fileInputRef} multiple className="hidden" onChange={handleFile} /> */}
    </div>
  );
};

export { ImageEditBlock };
