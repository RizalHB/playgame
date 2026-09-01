"use client";

import { useMemo, useState } from "react";

import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { ReviewToolbar } from "./ReviewToolbar";

const REVIEWS_PER_PAGE = 5;

interface Review {
  id: string;
  recommended: boolean;
  title: string | null;
  review: string;
  hoursPlayed: number;
  createdAt: Date | string;
  username: string;
  avatarUrl: string | null;
  libraryId: string | null;
  isCurrentUser: boolean;
}

interface UserReview {
  id: string;
  recommended: boolean;
  title: string | null;
  review: string;
  hoursPlayed: number;
}

interface ReviewListProps {
  gameId: string;
  reviews: Review[];
  userReview: UserReview | null;
  owned: boolean;
}

export function ReviewList({
  gameId,
  reviews,
  userReview,
  owned,
}: ReviewListProps) {
  const [sortBy, setSortBy] =
    useState("recent");

  const [filterBy, setFilterBy] =
    useState("all");

  const [page, setPage] =
    useState(1);

  const filteredReviews =
    useMemo(() => {
      let result = [...reviews];

      if (filterBy === "positive") {
        result = result.filter(
          (review) =>
            review.recommended,
        );
      }

      if (filterBy === "negative") {
        result = result.filter(
          (review) =>
            !review.recommended,
        );
      }

      switch (sortBy) {
        case "oldest":
          result.sort(
            (a, b) =>
              new Date(
                a.createdAt,
              ).getTime() -
              new Date(
                b.createdAt,
              ).getTime(),
          );
          break;

        case "hours":
          result.sort(
            (a, b) =>
              b.hoursPlayed -
              a.hoursPlayed,
          );
          break;

        case "recent":
        default:
          result.sort(
            (a, b) =>
              new Date(
                b.createdAt,
              ).getTime() -
              new Date(
                a.createdAt,
              ).getTime(),
          );
          break;
      }

      return result;
    }, [
      reviews,
      sortBy,
      filterBy,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredReviews.length /
        REVIEWS_PER_PAGE,
    ),
  );

  const currentPage = Math.min(
    page,
    totalPages,
  );

  const paginatedReviews =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        REVIEWS_PER_PAGE;

      return filteredReviews.slice(
        start,
        start +
          REVIEWS_PER_PAGE,
      );
    }, [
      filteredReviews,
      currentPage,
    ]);

  function handleSortChange(
    value: string,
  ) {
    setSortBy(value);
    setPage(1);
  }

  function handleFilterChange(
    value: string,
  ) {
    setFilterBy(value);
    setPage(1);
  }

  return (
    <section className="mt-10 space-y-8">
      {owned && (
        <ReviewForm
          gameId={gameId}
          existingReview={userReview}
        />
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Reviews
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            {reviews.length === 0
              ? "No reviews yet."
              : `${reviews.length.toLocaleString()} review${
                  reviews.length === 1
                    ? ""
                    : "s"
                }`}
          </p>
        </div>

        {reviews.length > 0 && (
          <ReviewToolbar
            sortBy={sortBy}
            filterBy={filterBy}
            onSortChange={
              handleSortChange
            }
            onFilterChange={
              handleFilterChange
            }
          />
        )}

        {filteredReviews.length ===
        0 ? (
          <div
            className="
              rounded-xl
              border
              border-zinc-800
              bg-zinc-900
              p-10
              text-center
            "
          >
            <p className="text-zinc-400">
              No reviews match the
              selected filter.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {paginatedReviews.map(
                (review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                  />
                ),
              )}
            </div>

            {totalPages > 1 && (
              <div
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-zinc-800
                  bg-zinc-900
                  px-5
                  py-4
                "
              >
                <button
                  type="button"
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setPage(
                      (value) =>
                        Math.max(
                          1,
                          value - 1,
                        ),
                    )
                  }
                  className="
                    rounded-lg
                    border
                    border-zinc-700
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition
                    hover:border-zinc-500
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Previous
                </button>

                <span className="text-sm text-zinc-400">
                  Page{" "}
                  <span className="font-semibold text-white">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {totalPages}
                  </span>
                </span>

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setPage(
                      (value) =>
                        Math.min(
                          totalPages,
                          value + 1,
                        ),
                    )
                  }
                  className="
                    rounded-lg
                    border
                    border-zinc-700
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition
                    hover:border-zinc-500
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}