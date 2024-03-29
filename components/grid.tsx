"use client";
const BackgroundGrid = () => (
  <>
    <style jsx>
      {`
        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23f1f5f9'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }

        .dark\:bg-grid-slate-700\/25:is(.dark *) {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(51 65 85 / 0.9)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}
    </style>
    <div
      className="bg-grid-slate-100 dark:bg-grid-slate-700/25 absolute inset-0 -z-10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
      style={{ backgroundPosition: "10px 10px" }}
    ></div>
  </>
);

export default BackgroundGrid;
