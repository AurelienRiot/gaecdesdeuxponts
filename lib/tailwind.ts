import { svgToDataUri } from "./utils";
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

function addGlobalUtilities({ addUtilities }: any) {
  const newUtilities = {
    ".hide-scrollbar": {
      "scrollbar-width": "none",
      "-ms-overflow-style": "-ms-autohiding-scrollbar",
      "-webkit-overflow-scrolling": "touch",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    ".thin-scrollbar": {
      "scrollbar-width": "thin",
    },
  };
  addUtilities(newUtilities, ["responsive"]);
}

function addVariablesForColors({ addBase, theme }: any) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );

  addBase({
    ":root": newVars,
  });
}

function addBackgroundGrid({ matchUtilities, theme }: any) {
  matchUtilities(
    {
      "bg-grid": (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none"  stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
        )}")`,
      }),
      "bg-grid-big": (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" strokeWidth="6" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
        )}")`,
      }),
      "bg-grid-small": (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
        )}")`,
      }),
      "bg-dot": (value: any) => ({
        backgroundImage: `url("${svgToDataUri(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
        )}")`,
      }),
    },
    {
      values: flattenColorPalette(theme("backgroundColor")),
      type: "color",
    },
  );
}

function ListStyleCheck({ matchUtilities, theme }: any) {
  matchUtilities(
    {
      "list-check": (value: any) => ({
        listStyle: "none",
        paddingLeft: "0",
        "& li::before": {
          content: `url("${svgToDataUri(
            `<svg width="14" height="12" viewBox="0 0 14 12" xmlns="http://www.w3.org/2000/svg" fill="${value}">
            <path fillRule="evenodd" d="M13.685.153a.752.752 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" />
            </svg>`,
          )}")`,

          display: "inline-block",
          marginRight: "8px",
          verticalAlign: "middle",
        },
      }),
    },
    {
      values: flattenColorPalette(theme("colors")),
      type: "color",
    },
  );
}

export {
  addGlobalUtilities,
  addVariablesForColors,
  addBackgroundGrid,
  ListStyleCheck,
};
