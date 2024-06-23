import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

const CaracteristiqueCard = () => {
  return (
    <Card className="mt-6 max-w-[500px]">
      <CardHeader className="text-center text-2xl font-semibold ">
        Caracteristiques du lait cru
      </CardHeader>
      <CardDescription className="text-center">
        {
          "C'est un produit vivant, non altéré, contenant une flore lactique naturellement riche et diversifié (qualites nutritionnelles et immunitaires) qui n'existe plus dans les laits transformés"
        }
      </CardDescription>
      <CardContent className="flex  flex-col items-center justify-center">
        <div>
          <svg
            id="visual"
            viewBox="0 0 900 900"
            width="900"
            height="900"
            className="h-[300px] w-[300px]"
          >
            <rect
              x="0"
              y="0"
              width="900"
              height="900"
              className="fill-card"
            ></rect>
            <g transform="translate(428.34638204931923 455.9949126829369)">
              <path
                d="M277.2 -274.7C362.5 -191.9 437.3 -95.9 423.4 -13.9C409.5 68.1 306.9 136.2 221.6 229.1C136.2 321.9 68.1 439.5 0.9 438.5C-66.3 437.6 -132.6 318.3 -197.4 225.4C-262.3 132.6 -325.6 66.3 -358.8 -33.1C-391.9 -132.6 -394.8 -265.2 -330 -348C-265.2 -430.8 -132.6 -463.9 -18.3 -445.6C95.9 -427.3 191.9 -357.5 277.2 -274.7"
                fill="#BB004B"
              ></path>
            </g>
            <text y={300} fill="black" fontSize={60}>
              {`Un produit riche 
              sur le plan nutritif 
        (calcium, proteines, 
          vitamines,omega 3...) `
                .split("\n")
                .map((line, index) => (
                  <tspan x={140} dy={index > 0 ? 80 : 0} key={index}>
                    {line}
                  </tspan>
                ))}
            </text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export { CaracteristiqueCard };
