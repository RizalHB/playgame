"use client";

import { useState } from "react";

import {
  addGameMedia,
  deleteGameMedia,
  setPrimaryGameMedia,
  updateGameMedia,
  updateGameMediaOrder,
} from "./media-actions";

interface GameMedia {
  id: string;
  type: string;
  mediaType: string;
  title: string | null;
  altText: string | null;
  url: string;
  thumbnailUrl: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

interface MediaManagerProps {
  gameId: string;
  media: GameMedia[];
}

const MEDIA_TYPES = [
  "header",
  "capsule",
  "banner",
  "library",
  "screenshot",
  "trailer",
] as const;

const MEDIA_KINDS = [
  "image",
  "video",
] as const;

export function MediaManager({
  gameId,
  media,
}: MediaManagerProps) {
  const [items, setItems] =
    useState(media);

  const [type, setType] =
    useState("screenshot");

  const [mediaType, setMediaType] =
    useState("image");

  const [title, setTitle] =
    useState("");

  const [altText, setAltText] =
    useState("");

  const [url, setUrl] =
    useState("");

  const [thumbnailUrl, setThumbnailUrl] =
    useState("");

  const [displayOrder, setDisplayOrder] =
    useState("1");

  const [isPrimary, setIsPrimary] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const resetForm = () => {
    setEditingId(null);
    setType("screenshot");
    setMediaType("image");
    setTitle("");
    setAltText("");
    setUrl("");
    setThumbnailUrl("");
    setDisplayOrder("1");
    setIsPrimary(false);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const input = {
      type,
      mediaType,
      title,
      altText,
      url,
      thumbnailUrl,
      isPrimary,
      displayOrder: Number(
        displayOrder,
      ),
    };

    const result = editingId
      ? await updateGameMedia(
          gameId,
          editingId,
          input,
        )
      : await addGameMedia(
          gameId,
          input,
        );

    if (result.error) {
      setError(result.error);
      return;
    }

    setMessage(
      result.success ??
        "Media saved successfully.",
    );

    /*
     * Refresh the page after a successful
     * server mutation so the server-rendered
     * game data is authoritative.
     */
    window.location.reload();
  };

  const handleEdit = (
    item: GameMedia,
  ) => {
    setEditingId(item.id);
    setType(item.type);
    setMediaType(item.mediaType);
    setTitle(item.title ?? "");
    setAltText(item.altText ?? "");
    setUrl(item.url);
    setThumbnailUrl(
      item.thumbnailUrl ?? "",
    );
    setDisplayOrder(
      String(item.displayOrder),
    );
    setIsPrimary(item.isPrimary);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (
    mediaId: string,
  ) => {
    const confirmed =
      window.confirm(
        "Delete this media?",
      );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    const result =
      await deleteGameMedia(
        gameId,
        mediaId,
      );

    if (result.error) {
      setError(result.error);
      return;
    }

    setItems((current) =>
      current.filter(
        (item) =>
          item.id !== mediaId,
      ),
    );

    setMessage(
      result.success ??
        "Media deleted successfully.",
    );
  };

  const handlePrimary = async (
    mediaId: string,
  ) => {
    setMessage("");
    setError("");

    const result =
      await setPrimaryGameMedia(
        gameId,
        mediaId,
      );

    if (result.error) {
      setError(result.error);
      return;
    }

    setItems((current) =>
      current.map((item) => ({
        ...item,
        isPrimary:
          item.id === mediaId,
      })),
    );

    setMessage(
      result.success ??
        "Primary media updated.",
    );
  };

  const handleOrder = async (
    mediaId: string,
    value: string,
  ) => {
    const order = Number(value);

    if (
      !Number.isInteger(order) ||
      order < 1
    ) {
      setError(
        "Display order must be a positive integer.",
      );
      return;
    }

    setMessage("");
    setError("");

    const result =
      await updateGameMediaOrder(
        gameId,
        mediaId,
        order,
      );

    if (result.error) {
      setError(result.error);
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === mediaId
          ? {
              ...item,
              displayOrder: order,
            }
          : item,
      ),
    );

    setMessage(
      result.success ??
        "Media order updated.",
    );
  };

  return (
    <section className="space-y-6 rounded-xl border border-white/10 bg-[#1b2838] p-6">
      <div>
        <p className="text-sm font-medium text-blue-400">
          Game Media
        </p>

        <h3 className="mt-1 text-2xl font-bold">
          Media Management
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
          Manage store images, screenshots,
          and trailer URLs for this game.
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-white/10 bg-black/10 p-5"
      >
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-zinc-200">
            {editingId
              ? "Edit Media"
              : "Add Media"}
          </h4>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              Cancel edit
            </button>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-zinc-400">
              Media Type
            </span>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
              className="w-full rounded-lg border border-white/10 bg-[#171a21] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            >
              {MEDIA_TYPES.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm text-zinc-400">
              Media Kind
            </span>

            <select
              value={mediaType}
              onChange={(event) =>
                setMediaType(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-white/10 bg-[#171a21] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            >
              {MEDIA_KINDS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ),
              )}
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-400">
            Title
          </span>

          <input
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Enter Screenshot Title"
            className="w-full rounded-lg border border-white/10 bg-[#171a21] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-blue-500"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-400">
            Media URL
          </span>

          <input
            type="url"
            required
            value={url}
            onChange={(event) =>
              setUrl(event.target.value)
            }
            placeholder="https://..."
            className="w-full rounded-lg border border-white/10 bg-[#171a21] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-blue-500"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm text-zinc-400">
            Thumbnail URL
            <span className="ml-2 text-xs text-zinc-600">
              optional
            </span>
          </span>

          <input
            type="url"
            value={thumbnailUrl}
            onChange={(event) =>
              setThumbnailUrl(
                event.target.value,
              )
            }
            placeholder="https://..."
            className="w-full rounded-lg border border-white/10 bg-[#171a21] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-blue-500"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-zinc-400">
              Alt Text
            </span>

            <input
              value={altText}
              onChange={(event) =>
                setAltText(
                  event.target.value,
                )
              }
              placeholder="Game screenshot"
              className="w-full rounded-lg border border-white/10 bg-[#171a21] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-blue-500"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-zinc-400">
              Display Order
            </span>

            <input
              type="number"
              min="1"
              value={displayOrder}
              onChange={(event) =>
                setDisplayOrder(
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-white/10 bg-[#171a21] px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500"
            />
          </label>
        </div>

        <label className="flex items-center gap-3 text-sm text-zinc-400">
          <input
            type="checkbox"
            checked={isPrimary}
            onChange={(event) =>
              setIsPrimary(
                event.target.checked,
              )
            }
            className="h-4 w-4 rounded border-white/20 bg-[#171a21]"
          />

          Set as primary media
        </label>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          {editingId
            ? "Update Media"
            : "Add Media"}
        </button>
      </form>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-zinc-200">
            Existing Media
          </h4>

          <span className="text-xs text-zinc-600">
            {items.length} item
            {items.length === 1
              ? ""
              : "s"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 px-5 py-10 text-center">
            <p className="text-sm text-zinc-500">
              No media has been added yet.
            </p>

            <p className="mt-1 text-xs text-zinc-700">
              Add a cover, header,
              screenshots, or trailer URL
              above.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items
              .slice()
              .sort(
                (a, b) =>
                  a.displayOrder -
                  b.displayOrder,
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-[#171a21] p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium uppercase text-blue-400">
                          {item.type}
                        </span>

                        <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-500">
                          {item.mediaType}
                        </span>

                        {item.isPrimary && (
                          <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
                            Primary
                          </span>
                        )}
                      </div>

                      <h5 className="mt-2 font-medium text-zinc-200">
                        {item.title ||
                          "Untitled media"}
                      </h5>

                      <p className="mt-1 truncate text-xs text-zinc-600">
                        {item.url}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <label className="flex items-center gap-2 text-xs text-zinc-500">
                        Order

                        <input
                          type="number"
                          min="1"
                          defaultValue={
                            item.displayOrder
                          }
                          onBlur={(event) =>
                            handleOrder(
                              item.id,
                              event.target
                                .value,
                            )
                          }
                          className="w-16 rounded-md border border-white/10 bg-black/20 px-2 py-1.5 text-center text-xs text-white outline-none focus:border-blue-500"
                        />
                      </label>

                      {!item.isPrimary && (
                        <button
                          type="button"
                          onClick={() =>
                            handlePrimary(
                              item.id,
                            )
                          }
                          className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
                        >
                          Primary
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(item)
                        }
                        className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition hover:bg-white/5 hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            item.id,
                          )
                        }
                        className="rounded-md border border-red-500/20 px-3 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}