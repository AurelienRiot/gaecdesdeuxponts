import dynamic from "next/dynamic";

const DisplayPDF = dynamic(() => import("./pdf"), {
  ssr: false,
});

const TestPage = () => {
  return (
    <div className="h-screen w-1/2">
      <DisplayPDF />
    </div>
  );
};

export default TestPage;
