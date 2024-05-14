const BackgroundGrid = () => (
  <div
    className="absolute inset-0 -z-10 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-600/50 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
    style={{ backgroundPosition: "10px 10px" }}
  ></div>
);

export default BackgroundGrid;
