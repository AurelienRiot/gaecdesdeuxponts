import { cn } from "@/lib/utils";

interface HeadingProps {
  title: string;
  titleClassName?: string;
  description: string;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description, className, titleClassName }) => {
  return (
    <div className={cn("lining-nums", className)}>
      <h2 className={cn("text-3xl font-bold tracking-tight", titleClassName)}> {title} </h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};
