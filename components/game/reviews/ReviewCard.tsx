"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { RecommendationBadge } from "./RecommendationBadge";

interface ReviewCardProps {
  review: {
    id: string;
    recommended: boolean;
    title: string | null;
    review: string;
    hoursPlayed: number;
    createdAt: Date | string;
    username: string;
    avatarUrl: string | null;
    libraryId: string | null;
  };
}

export function ReviewCard({
  review,
}: ReviewCardProps) {
  const [expanded, setExpanded] =
    useState(false);

  const verifiedPurchase =
    review.libraryId !== null;

  const shouldCollapse =
    review.review.length > 260;

  const reviewText =
    useMemo(() => {
      if (
        expanded ||
        !shouldCollapse
      ) {
        return review.review;
      }

      return (
        review.review.slice(0, 260) +
        "..."
      );
    }, [
      expanded,
      shouldCollapse,
      review.review,
    ]);

  return (
    <article
      className="
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
        transition-all
        duration-300
        hover:border-sky-500
        hover:shadow-lg
        hover:shadow-sky-500/10
      "
    >
      {/* Recommendation + Date */}
      <div className="flex items-center justify-between gap-4">
        <RecommendationBadge
          recommended={
            review.recommended
          }
        />

        <span className="shrink-0 text-sm text-zinc-500">
          {new Date(
            review.createdAt,
          ).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            },
          )}
        </span>
      </div>

      {/* Review title */}
      {review.title && (
        <h3 className="mt-5 text-xl font-bold text-white">
          {review.title}
        </h3>
      )}

      {/* Review content */}
      <div className="mt-4 space-y-4">
        <p className="whitespace-pre-line leading-7 text-zinc-300">
          {reviewText}
        </p>

        {shouldCollapse && (
          <button
            type="button"
            onClick={() =>
              setExpanded(
                (value) => !value,
              )
            }
            className="
              text-sm
              font-medium
              text-sky-400
              transition
              hover:text-sky-300
              focus:outline-none
              focus:ring-2
              focus:ring-sky-500
              focus:ring-offset-2
              focus:ring-offset-zinc-900
            "
          >
            {expanded
              ? "Show less"
              : "Read more"}
          </button>
        )}
      </div>

      {/* Reviewer information */}
      <div
        className="
          mt-8
          border-t
          border-zinc-800
          pt-5
        "
      >
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {review.avatarUrl ? (
            <Image
              src={
                review.avatarUrl
              }
              alt={
                review.username
              }
              width={52}
              height={52}
              className="
                rounded-full
                border
                border-zinc-700
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-13
                w-13
                items-center
                justify-center
                rounded-full
                bg-sky-700
                text-lg
                font-bold
                text-white
              "
            >
              {review.username
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          {/* User information */}
          <div>
            <p className="font-semibold text-white">
              {review.username}
            </p>

            <p className="text-sm text-zinc-500">
              {review.hoursPlayed.toFixed(
                1,
              )}{" "}
              hrs on record
            </p>

            {/* Verified purchase */}
            {verifiedPurchase && (
              <span
                className="
                  mt-2
                  inline-block
                  rounded
                  bg-emerald-600/20
                  px-2
                  py-1
                  text-xs
                  font-medium
                  text-emerald-400
                "
              >
                ✔ Verified Purchase
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}