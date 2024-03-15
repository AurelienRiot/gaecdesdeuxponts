"use client";

export const AdminColorSchema = () => (
  <style jsx global>{`
    :root {
      --background: 0 0% 100%;
      --foreground: 240 10% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 240 10% 3.9%;
      --popover: 0 0% 100%;
      --popover-foreground: 240 10% 3.9%;
      --primary: 240 5.9% 10%;
      --primary-foreground: 0 0% 98%;
      --secondary: 240 4.8% 95.9%;
      --secondary-foreground: 240 5.9% 10%;
      --muted: 240 4.8% 95.9%;
      --muted-foreground: 240 3.8% 46.1%;
      --accent: 240 4.8% 95.9%;
      --accent-foreground: 240 5.9% 10%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 5.9% 90%;
      --input: 240 5.9% 90%;
      --ring: 240 5.9% 10%;
      --radius: 0.5rem;
    }

    .dark {
      --background: 240 10% 3.9%;
      --foreground: 0 0% 98%;
      --card: 240 10% 3.9%;
      --card-foreground: 0 0% 98%;
      --popover: 240 10% 3.9%;
      --popover-foreground: 0 0% 98%;
      --primary: 0 0% 98%;
      --primary-foreground: 240 5.9% 10%;
      --secondary: 240 3.7% 15.9%;
      --secondary-foreground: 0 0% 98%;
      --muted: 240 3.7% 15.9%;
      --muted-foreground: 240 5% 64.9%;
      --accent: 240 3.7% 15.9%;
      --accent-foreground: 0 0% 98%;
      --destructive: 0 62.8% 30.6%;
      --destructive-foreground: 0 0% 98%;
      --border: 240 3.7% 15.9%;
      --input: 240 3.7% 15.9%;
      --ring: 240 4.9% 83.9%;
    }
  `}</style>
);

export const ProColorSchema = () => (
  <style jsx global>{`
    :root {
      --background: 0 0% 100%; /* white */
      --foreground: 19 27% 17%; /* dark brown for text, similar to neutral-950 but warmer */
      --card: 240 13% 98%; /* very light grey, for a subtle contrast against white */
      --card-foreground: 19 27% 17%; /* dark brown */
      --popover: 240 13% 98%; /* very light grey */
      --popover-foreground: 19 27% 17%; /* dark brown */
      --primary: 120 30% 49%; /* softer orange, for a less intense, more natural look */
      --primary-foreground: 0 0% 100%; /* white, for contrast on primary elements */
      --secondary: 34 80% 50%; /* soft green, for secondary buttons and accents */
      --secondary-foreground: 0 0% 20%; /* very dark green, for text on secondary elements */
      --muted: 35 16% 96%; /* off-white, for backgrounds of muted elements */
      --muted-foreground: 24 44% 26%; /* muted brown, for text on muted backgrounds */
      --accent: 28 76% 67%; /* warm yellow, as an accent color for highlights */
      --accent-foreground: 19 27% 17%; /* dark brown, for text on accent elements */
      --destructive: 0 85% 61%; /* red-500, kept for error states */
      --destructive-foreground: 0 0% 99%; /* neutral-50, for contrast on destructive elements */
      --border: 35 16% 90%; /* light grey, for borders and dividers */
      --input: 240 13% 95%; /* very light grey, for input fields */
      --ring: 34 80% 50%; /* softer orange, for focus rings */
      --radius: 0.5rem; /* keeping the border radius the same for consistency */
    }

    .dark {
      --background: 19 27% 15%; /* dark brown, for dark mode background */
      --foreground: 240 13% 98%; /* very light grey, for text in dark mode */
      --card: 19 27% 15%; /* dark brown, for cards in dark mode */
      --card-foreground: 240 13% 98%; /* very light grey, for card text in dark mode */
      --popover: 19 27% 15%; /* dark brown, for popovers in dark mode */
      --popover-foreground: 240 13% 98%; /* very light grey, for popover text in dark mode */
      --primary: 34 80% 50%; /* softer orange, consistent with light mode */
      --primary-foreground: 0 0% 100%; /* white, for contrast */
      --secondary: 120 30% 40%; /* darker green for dark mode, for secondary elements */
      --secondary-foreground: 240 13% 98%; /* very light grey, for text on secondary elements */
      --muted: 19 27% 20%; /* dark grey, for muted elements in dark mode */
      --muted-foreground: 240 13% 80%; /* lighter grey, for text on muted elements */
      --accent: 28 76% 60%; /* warm yellow, slightly darker for dark mode */
      --accent-foreground: 19 27% 15%; /* dark brown, for text on accent elements */
      --destructive: 0 63% 31%; /* red-900, for errors in dark mode */
      --destructive-foreground: 0 0% 99%; /* neutral-50, for contrast */
      --border: 19 27% 20%; /* dark grey, for borders in dark mode */
      --input: 19 27% 20%; /* dark grey, for input fields in dark mode */
      --ring: 34 80% 50%; /* softer orange, for focus rings in dark mode */
    }
  `}</style>
);
