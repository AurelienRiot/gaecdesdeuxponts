
const ColorsPage = () => {
  return (
    <>
    <div className="grid grid-cols-2 gap-4 p-6 bg-black dark:bg-white ">
      <div className="p-4 rounded-lg bg-background">
        <h3 className="text-foreground">Background Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-primary">
        <h3 className="text-primary-foreground">Primary Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-secondary">
        <h3 className="text-secondary-foreground">Secondary Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-muted">
        <h3 className="text-muted-foreground">Muted Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-accent">
        <h3 className="text-accent-foreground">Accent Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-destructive">
        <h3 className="text-destructive-foreground">Destructive Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-card">
        <h3 className="text-card-foreground">Card Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-popover">
        <h3 className="text-popover-foreground">Popover Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-border">
        <h3 className="text-black dark:text-white">Border Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-input">
        <h3 className="text-black dark:text-white">Input Color</h3>
      </div>
      <div className="p-4 rounded-lg bg-ring">
        <h3 className="text-white ">Ring Color</h3>
      </div>
      
    </div>
    <div className="grid grid-cols-2 gap-4 p-6 bg-black dark:bg-white ">
    <div className="p-4 rounded-lg bg-foreground">
      <h3 className="text-background">Foreground Color</h3>
    </div>
    <div className="p-4 rounded-lg bg-primary-foreground">
      <h3 className="text-primary">Foreground Primary Color</h3>
    </div>
    <div className="p-4 rounded-lg bg-secondary-foreground">
      <h3 className="text-secondary">Foreground Secondary Color</h3>
    </div>
    <div className="p-4 rounded-lg bg-muted-foreground">
      <h3 className="text-muted">Foreground Muted Color</h3>
    </div>
    <div className="p-4 rounded-lg bg-accent-foreground">
      <h3 className="text-accent">Foreground Accent Color</h3>
    </div>
    <div className="p-4 rounded-lg bg-destructive-foreground">
      <h3 className="text-destructive">Foreground Destructive Color</h3>
    </div>
    <div className="p-4 rounded-lg bg-card-foreground">
      <h3 className="text-card">Foreground Card Color</h3>
    </div>
    <div className="p-4 rounded-lg bg-popover-foreground">
      <h3 className="text-popover"> Foreground Popover Color</h3>
    </div>
   
    
  </div>
    </>
  );
};

export default ColorsPage