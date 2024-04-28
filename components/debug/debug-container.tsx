const DebugContainer = () => {
  return (
    <div className="absolute bottom-0 left-0 z-50 bg-foreground p-2 text-xs font-semibold text-background">
      <div className="block @xs:hidden">{" < 320px"}</div>
      <div className="hidden @xs:block @sm:hidden">{"xs > 320px "}</div>
      <div className="hidden @sm:block @md:hidden">{"sm > 384px "}</div>
      <div className="hidden @md:block @lg:hidden">{"md > 448px "}</div>
      <div className="hidden @lg:block @xl:hidden">{"lg > 512px "}</div>
      <div className="hidden @xl:block @2xl:hidden">{"xl > 576px"}</div>
      <div className="hidden @2xl:block @3xl:hidden">{"2xl > 672px"}</div>
      <div className="hidden @3xl:block @4xl:hidden">{"3xl > 768px"}</div>
      <div className="hidden @4xl:block @5xl:hidden">{"4xl > 896px"}</div>
      <div className="hidden @5xl:block @6xl:hidden">{"5xl > 1024px"}</div>
      <div className="hidden @6xl:block @7xl:hidden">{"6xl > 1152px"}</div>
      <div className="hidden @7xl:block">{"7xl > 1280px"}</div>
    </div>
  );
};

export default DebugContainer;
