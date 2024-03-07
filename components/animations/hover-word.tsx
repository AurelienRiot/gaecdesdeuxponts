type HoverWordProps = {
  word: string;
};
const HoverWord = ({ word }: HoverWordProps) => {
  return (
    <>
      {" "}
      <span className="inline-block relative z-10 before:inset-0   before:absolute  before:bg-sky-400 dark:before:bg-sky-600 before:z-[-1] before:max-w-0 before:animate-max-w before:duration-300 before:ease-linear group-hover:before:max-w-full">
        {word}
      </span>{" "}
    </>
  );
};

export default HoverWord;
