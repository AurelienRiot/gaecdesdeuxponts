import React from "react";
import { InfiniteMovingCards } from "@/components/animations/infinite-moving-cards";
import { Icons } from "@/components/icons";

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

      {/* <div className="relative  w-[350px] max-w-full flex-shrink-0 rounded-2xl border  border-slate-700 bg-background py-4 pl-6 pr-12 text-foreground ">
        <blockquote>
          <div className="flex w-full place-items-start justify-between ">
            <p className="flex flex-col text-sm">
              <span>{testimonials[0].name}</span>{" "}
              <span>{testimonials[0].company}</span>
            </p>
            <StarRating rating={testimonials[0].note} />
          </div>
          <span className=" relative  text-xs font-normal ">
            {testimonials[0].message}
          </span>
        </blockquote>
      </div> */}
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

const StarRating = ({ rating }: { rating: number }) => {
  const normalizedRating = (rating / 10) * 5;

  const fullStars = Math.floor(normalizedRating);
  const halfStar = normalizedRating % 1 !== 0 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  return (
    <div aria-label={`Note: ${rating} sur 10`} className="star-rating">
      {[...Array(fullStars)].map((_, i) => (
        <Icons.star
          key={`full-${i}`}
          className="inline size-4 fill-yellow-500 text-yellow-500"
        />
      ))}
      {[...Array(halfStar)].map((_, i) => (
        <Icons.HalfFilledStar
          key={`half-filled-${i}`}
          className="inline size-4"
        />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Icons.star
          key={`full-${i}`}
          className="inline size-4 fill-gray-400 text-gray-400"
        />
      ))}
    </div>
  );
};
