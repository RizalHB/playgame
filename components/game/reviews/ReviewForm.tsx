
"use client";

import { useState } from "react";

import {
  createReview,
  deleteReview,
  updateReview,
} from "@/lib/actions/reviews";

interface ReviewFormProps {
  gameId: string;

  existingReview: {
    id: string;
    recommended: boolean;
    title: string | null;
    review: string;
    hoursPlayed: number;
  } | null;
}

export function ReviewForm({
  gameId,
  existingReview,
}: ReviewFormProps) {
  const [
    recommended,
    setRecommended,
  ] = useState(
    existingReview?.recommended ??
      true,
  );

  const [title, setTitle] =
    useState(
      existingReview?.title ?? "",
    );

  const [review, setReview] =
    useState(
      existingReview?.review ?? "",
    );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    success,
    setSuccess,
  ] = useState<string | null>(
    null,
  );

  const isEditing =
    existingReview !== null;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      if (isEditing) {
        await updateReview({
          reviewId:
            existingReview.id,
          recommended,
          title,
          review,
        });

        setSuccess(
          "Your review has been updated.",
        );
      } else {
        await createReview({
          gameId,
          recommended,
          title,
          review,
        });

        setSuccess(
          "Your review has been posted.",
        );
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save your review.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!existingReview) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete your review? This action cannot be undone.",
      );

    if (!confirmed) {
      return;
    }

    setError(null);
    setSuccess(null);
    setDeleting(true);

    try {
      await deleteReview(
        existingReview.id,
      );

      setSuccess(
        "Your review has been deleted. Refresh the page to write a new review.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete your review.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section
      className="
        rounded-xl
        border
        border-zinc-800
        bg-zinc-900
        p-6
      "
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold">
          {isEditing
            ? "Edit Your Review"
            : "Write a Review"}
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          {isEditing
            ? "Update your experience with this game."
            : "Share your experience with this game."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <p className="mb-3 text-sm font-medium text-zinc-300">
            Would you recommend this
            game?
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setRecommended(true)
              }
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                recommended
                  ? "border-green-500 bg-green-500/20 text-green-400"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              👍 Recommended
            </button>

            <button
              type="button"
              onClick={() =>
                setRecommended(false)
              }
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                !recommended
                  ? "border-red-500 bg-red-500/20 text-red-400"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              👎 Not Recommended
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor={`review-title-${gameId}`}
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Review title
          </label>

          <input
            id={`review-title-${gameId}`}
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
            maxLength={120}
            placeholder="Summarize your experience"
            className="
              w-full
              rounded-lg
              border
              border-zinc-700
              bg-zinc-950
              px-4
              py-3
              text-white
              outline-none
              transition
              placeholder:text-zinc-600
              focus:border-sky-500
              focus:ring-1
              focus:ring-sky-500
            "
          />
        </div>

        <div>
          <label
            htmlFor={`review-content-${gameId}`}
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Your review
          </label>

          <textarea
            id={`review-content-${gameId}`}
            value={review}
            onChange={(event) =>
              setReview(
                event.target.value,
              )
            }
            rows={7}
            maxLength={5000}
            required
            placeholder="Tell other players what you think..."
            className="
              w-full
              resize-y
              rounded-lg
              border
              border-zinc-700
              bg-zinc-950
              px-4
              py-3
              text-white
              outline-none
              transition
              placeholder:text-zinc-600
              focus:border-sky-500
              focus:ring-1
              focus:ring-sky-500
            "
          />

          <p className="mt-2 text-right text-xs text-zinc-600">
            {review.length}/5000
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="
              rounded-lg
              border
              border-red-500/30
              bg-red-500/10
              p-3
              text-sm
              text-red-400
            "
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="
              rounded-lg
              border
              border-green-500/30
              bg-green-500/10
              p-3
              text-sm
              text-green-400
            "
          >
            {success}
          </div>
        )}

        <div
          className="
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {isEditing && (
            <button
              type="button"
              disabled={
                submitting ||
                deleting
              }
              onClick={
                handleDelete
              }
              className="
                rounded-lg
                border
                border-red-500/40
                px-5
                py-3
                font-semibold
                text-red-400
                transition
                hover:border-red-500
                hover:bg-red-500/10
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {deleting
                ? "Deleting..."
                : "Delete Review"}
            </button>
          )}

          <button
            type="submit"
            disabled={
              submitting ||
              deleting ||
              review.trim().length <
                10
            }
            className="
              rounded-lg
              bg-sky-600
              px-5
              py-3
              font-semibold
              text-white
              transition
              hover:bg-sky-500
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:ml-auto
            "
          >
            {submitting
              ? "Saving..."
              : isEditing
                ? "Update Review"
                : "Post Review"}
          </button>
        </div>
      </form>
    </section>
  );
}