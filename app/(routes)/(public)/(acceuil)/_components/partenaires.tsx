import { InfiniteMovingCards } from "@/components/animations/infinite-moving-cards";

export function PartenaireCards() {
  return (
    <div
      id="partenaires"
      className="relative flex flex-col  items-center justify-center overflow-hidden rounded-md pt-24  "
    >
      <h3 className="text-3xl">Nos Partenaires</h3>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
      <InfiniteMovingCards
        items={testimonials}
        direction="left"
        speed="normal"
      />
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const testimonials = [
  {
    message:
      "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, ",
    name: "Charles Dickens",
    company: "Charles Dickens",
    note: 4,
  },
  {
    message:
      "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
    name: "William Shakespeare",
    company: "William Shakespeare",
    note: 10,
  },
  {
    message: "All that we see or seem is but a dream within a dream.",
    name: "Edgar Allan Poe",
    note: 8,
  },
  {
    message:
      "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    name: "Jane Austen",
    note: 5,
  },
  {
    message:
      "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
    name: "Herman Melville",
    company: "Herman Melville",
    note: 6,
  },
];
