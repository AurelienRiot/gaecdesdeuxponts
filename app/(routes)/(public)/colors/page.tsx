export const dynamic = "force-static";

const ColorsPage = () => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4 bg-black p-6 dark:bg-white">
        <div className="rounded-lg bg-background p-4">
          <h3 className="text-foreground">Background Color</h3>
        </div>
        <div className="rounded-lg bg-primary p-4">
          <h3 className="text-primary-foreground">Primary Color</h3>
        </div>
        <div className="rounded-lg bg-secondary p-4">
          <h3 className="text-secondary-foreground">Secondary Color</h3>
        </div>
        <div className="rounded-lg bg-muted p-4">
          <h3 className="text-muted-foreground">Muted Color</h3>
        </div>
        <div className="rounded-lg bg-accent p-4">
          <h3 className="text-accent-foreground">Accent Color</h3>
        </div>
        <div className="rounded-lg bg-destructive p-4">
          <h3 className="text-destructive-foreground">Destructive Color</h3>
        </div>
        <div className="rounded-lg bg-card p-4">
          <h3 className="text-card-foreground">Card Color</h3>
        </div>
        <div className="rounded-lg bg-popover p-4">
          <h3 className="text-popover-foreground">Popover Color</h3>
        </div>
        <div className="rounded-lg bg-border p-4">
          <h3 className="text-black dark:text-white">Border Color</h3>
        </div>
        <div className="rounded-lg bg-input p-4">
          <h3 className="text-black dark:text-white">Input Color</h3>
        </div>
        <div className="rounded-lg bg-ring p-4">
          <h3 className="text-white">Ring Color</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 bg-black p-6 dark:bg-white">
        <div className="rounded-lg bg-foreground p-4">
          <h3 className="text-background">Foreground Color</h3>
        </div>
        <div className="rounded-lg bg-primary-foreground p-4">
          <h3 className="text-primary">Foreground Primary Color</h3>
        </div>
        <div className="rounded-lg bg-secondary-foreground p-4">
          <h3 className="text-secondary">Foreground Secondary Color</h3>
        </div>
        <div className="rounded-lg bg-muted-foreground p-4">
          <h3 className="text-muted">Foreground Muted Color</h3>
        </div>
        <div className="rounded-lg bg-accent-foreground p-4">
          <h3 className="text-accent">Foreground Accent Color</h3>
        </div>
        <div className="rounded-lg bg-destructive-foreground p-4">
          <h3 className="text-destructive">Foreground Destructive Color</h3>
        </div>
        <div className="rounded-lg bg-card-foreground p-4">
          <h3 className="text-card">Foreground Card Color</h3>
        </div>
        <div className="rounded-lg bg-popover-foreground p-4">
          <h3 className="text-popover"> Foreground Popover Color</h3>
        </div>
      </div>
    </>
  );
};

export default ColorsPage;
