"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  Volume2,
  VolumeX,
} from "lucide-react";

interface GameMedia {
  id?: string;
  type: string;
  mediaType?: string | null;
  url: string;
  title?: string | null;
  thumbnailUrl?: string | null;
}

interface TrailerPlayerProps {
  media: GameMedia;
}

interface YouTubePlayerLike {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (
    seconds: number,
    allowSeekAhead: boolean,
  ) => void;
  setPlaybackRate: (
    rate: number,
  ) => void;
  getPlaybackRate: () => number;
  getAvailablePlaybackRates: () => number[];
  getPlayerState: () => number;
  destroy: () => void;
  setOption?: (
    module: string,
    option: string,
    value: unknown,
  ) => void;
  getIframe?: () => HTMLIFrameElement;
}

interface YouTubePlayerEvent {
  target: YouTubePlayerLike;
  data?: number;
}

interface YouTubeConstructor {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      playerVars?: Record<
        string,
        string | number
      >;
      events?: {
        onReady?: (
          event: YouTubePlayerEvent,
        ) => void;
        onStateChange?: (
          event: YouTubePlayerEvent,
        ) => void;
      };
    },
  ) => YouTubePlayerLike;
}

interface YouTubeWindow {
  YT?: YouTubeConstructor;
  onYouTubeIframeAPIReady?: () => void;
}

declare global {
  interface Window {
    __playGameYouTubePromise?: Promise<YouTubeConstructor>;
  }
}

const YOUTUBE_READY = 1;
const YOUTUBE_PLAYING = 1;
const YOUTUBE_PAUSED = 2;
const YOUTUBE_ENDED = 0;

function getYouTubeVideoId(
  url: string,
): string | null {
  try {
    const parsed = new URL(url);

    const host =
      parsed.hostname.toLowerCase();

    if (
      host === "youtube.com" ||
      host === "www.youtube.com"
    ) {
      if (
        parsed.pathname === "/watch"
      ) {
        return (
          parsed.searchParams.get(
            "v",
          ) || null
        );
      }

      if (
        parsed.pathname.startsWith(
          "/embed/",
        )
      ) {
        return (
          parsed.pathname
            .split("/")
            .filter(Boolean)[1] ??
          null
        );
      }

      if (
        parsed.pathname.startsWith(
          "/shorts/",
        )
      ) {
        return (
          parsed.pathname
            .split("/")
            .filter(Boolean)[1] ??
          null
        );
      }
    }

    if (
      host === "youtu.be"
    ) {
      return (
        parsed.pathname
          .split("/")
          .filter(Boolean)[0] ??
        null
      );
    }

    return null;
  } catch {
    return null;
  }
}

function loadYouTubeAPI(): Promise<YouTubeConstructor> {
  if (
    window.__playGameYouTubePromise
  ) {
    return window.__playGameYouTubePromise;
  }

  window.__playGameYouTubePromise =
    new Promise(
      (resolve, reject) => {
        const existing =
          (window as YouTubeWindow).YT;

        if (existing) {
          resolve(existing);
          return;
        }

        const previous =
          (window as YouTubeWindow)
            .onYouTubeIframeAPIReady;

        (
          window as YouTubeWindow
        ).onYouTubeIframeAPIReady =
          () => {
            const yt =
              (window as YouTubeWindow)
                .YT;

            if (yt) {
              resolve(yt);
            } else {
              reject(
                new Error(
                  "YouTube API failed to initialize.",
                ),
              );
            }

            previous?.();
          };

        const script =
          document.createElement(
            "script",
          );

        script.src =
          "https://www.youtube.com/iframe_api";
        script.async = true;

        script.onerror = () => {
          reject(
            new Error(
              "Unable to load YouTube API.",
            ),
          );
        };

        document.head.appendChild(
          script,
        );
      },
    );

  return window.__playGameYouTubePromise;
}

export function TrailerPlayer({
  media,
}: TrailerPlayerProps) {
  const containerRef =
    useRef<HTMLDivElement>(null);

  const playerHostRef =
    useRef<HTMLDivElement>(null);

  const playerRef =
    useRef<YouTubePlayerLike | null>(
      null,
    );

  const timerRef =
    useRef<ReturnType<
      typeof setInterval
    > | null>(null);

  const [ready, setReady] =
    useState(false);

  const [playing, setPlaying] =
    useState(false);

  const [started, setStarted] =
    useState(false);

  const [muted, setMuted] =
    useState(false);

  const [volume, setVolume] =
    useState(70);

  const [progress, setProgress] =
    useState(0);

  const [duration, setDuration] =
    useState(0);

  const [qualityOpen, setQualityOpen] =
    useState(false);

  const [speedOpen, setSpeedOpen] =
    useState(false);

  const [subtitleOn, setSubtitleOn] =
    useState(false);

  const [cinema, setCinema] =
    useState(false);

  const [fullscreen, setFullscreen] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [availableRates, setAvailableRates] =
    useState<number[]>([
      0.5,
      0.75,
      1,
      1.25,
      1.5,
      1.75,
      2,
    ]);

  const videoId =
    getYouTubeVideoId(media.url);

  const thumbnail =
    media.thumbnailUrl ??
    (videoId
      ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
      : null);

  const formatTime = (
    seconds: number,
  ) => {
    if (!Number.isFinite(seconds)) {
      return "0:00";
    }

    const total = Math.floor(
      seconds,
    );

    const minutes = Math.floor(
      total / 60,
    );

    const remaining =
      total % 60;

    return `${minutes}:${String(
      remaining,
    ).padStart(2, "0")}`;
  };

  const syncState =
    useCallback(() => {
      const player =
        playerRef.current;

      if (!player) return;

      const current =
        player.getCurrentTime();

      const total =
        player.getDuration();

      setProgress(
        Number.isFinite(current)
          ? current
          : 0,
      );

      setDuration(
        Number.isFinite(total)
          ? total
          : 0,
      );

      setVolume(
        Math.round(
          player.getVolume(),
        ),
      );

      setMuted(player.isMuted());

      const state =
        player.getPlayerState();

      setPlaying(
        state === YOUTUBE_PLAYING,
      );

      if (
        state === YOUTUBE_ENDED
      ) {
        setPlaying(false);
        setProgress(0);
      }
    }, []);

  useEffect(() => {
    if (!videoId || !playerHostRef.current) {
      return;
    }

    let cancelled = false;

    loadYouTubeAPI()
      .then((YT) => {
        if (
          cancelled ||
          !playerHostRef.current
        ) {
          return;
        }

        playerRef.current?.destroy();

        const player =
          new YT.Player(
            playerHostRef.current,
            {
              videoId,

              playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
                rel: 0,
                iv_load_policy: 3,
                cc_load_policy: 0,
              },

              events: {
                onReady: (
                  event,
                ) => {
                  if (cancelled) {
                    return;
                  }

                  playerRef.current =
                    event.target;

                  event.target.setVolume(
                    volume,
                  );

                  setReady(true);

                  const rates =
                    event.target.getAvailablePlaybackRates();

                  if (rates.length > 0) {
                    setAvailableRates(
                      rates,
                    );
                  }

                  syncState();
                },

                onStateChange: (
                  event,
                ) => {
                  if (cancelled) {
                    return;
                  }

                  const state =
                    event.data;

                  setPlaying(
                    state ===
                      YOUTUBE_PLAYING,
                  );

                  if (
                    state ===
                    YOUTUBE_PLAYING
                  ) {
                    setStarted(true);
                  }

                  syncState();
                },
              },
            },
          );

        playerRef.current =
          player;
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "Unable to load this trailer.",
          );
        }
      });

    return () => {
      cancelled = true;

      if (timerRef.current) {
        clearInterval(
          timerRef.current,
        );
      }

      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    timerRef.current =
      setInterval(
        syncState,
        250,
      );

    return () => {
      if (timerRef.current) {
        clearInterval(
          timerRef.current,
        );
      }
    };
  }, [syncState]);

  useEffect(() => {
    const handleFullscreen =
      () => {
        setFullscreen(
          Boolean(
            document.fullscreenElement,
          ),
        );
      };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreen,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreen,
      );
    };
  }, []);

  const play = () => {
    const player =
      playerRef.current;

    if (!player || !ready) return;

    player.playVideo();
    setStarted(true);
  };

  const pause = () => {
    playerRef.current?.pauseVideo();
  };

  const togglePlay = () => {
    if (playing) {
      pause();
    } else {
      play();
    }
  };

  const changeVolume = (
    value: number,
  ) => {
    const next = Math.max(
      0,
      Math.min(100, value),
    );

    setVolume(next);

    const player =
      playerRef.current;

    if (!player) return;

    if (next === 0) {
      player.mute();
      setMuted(true);
    } else {
      player.unMute();
      player.setVolume(next);
      setMuted(false);
    }
  };

  const toggleMute = () => {
    const player =
      playerRef.current;

    if (!player) return;

    if (player.isMuted()) {
      player.unMute();

      const restored =
        volume > 0 ? volume : 70;

      player.setVolume(
        restored,
      );

      setVolume(restored);
      setMuted(false);
    } else {
      player.mute();
      setMuted(true);
    }
  };

  const seek = (
    value: number,
  ) => {
    playerRef.current?.seekTo(
      value,
      true,
    );

    setProgress(value);
  };

  const changeRate = (
    rate: number,
  ) => {
    playerRef.current?.setPlaybackRate(
      rate,
    );

    setSpeedOpen(false);
  };

  const toggleSubtitles = () => {
    const player =
      playerRef.current;

    if (!player) return;

    try {
      if (subtitleOn) {
        player.setOption?.(
          "captions",
          "track",
          {},
        );
        setSubtitleOn(false);
      } else {
        player.setOption?.(
          "captions",
          "track",
          {
            languageCode: "en",
          },
        );
        setSubtitleOn(true);
      }
    } catch {
      setSubtitleOn(
        (value) => !value,
      );
    }
  };

  const toggleFullscreen =
    async () => {
      const element =
        containerRef.current;

      if (!element) return;

      try {
        if (
          !document.fullscreenElement
        ) {
          await element.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch {
        // Browser denied fullscreen.
      }
    };

  const toggleCinema = () => {
    setCinema(
      (value) => !value,
    );
  };

  if (!videoId) {
    return (
      <div className="flex aspect-video items-center justify-center bg-zinc-950 p-8 text-center text-zinc-400">
        Game Trailer is unavailable.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`
        relative
        overflow-hidden
        bg-[#07111f]
        ${
          cinema
            ? "fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
            : ""
        }
      `}
    >
      <div
        className={`
          relative
          aspect-video
          w-full
          ${
            cinema
              ? "max-h-screen max-w-[1600px]"
              : ""
          }
        `}
      >
        {/* Video */}
        <div
          ref={playerHostRef}
          className="
            absolute
            inset-0
            h-full
            w-full
            bg-black
          "
        />

        {/* Thumbnail / play overlay */}
        {!started && (
          <button
            type="button"
            onClick={play}
            disabled={!ready}
            aria-label="Play trailer"
            className="
              absolute
              inset-0
              z-10
              flex
              items-center
              justify-center
              bg-black/35
              transition
              hover:bg-black/20
              disabled:cursor-wait
            "
          >
            {thumbnail && (
              <img
                src={thumbnail}
                alt=""
                className="
                  absolute
                  inset-0
                  h-full
                  w-full
                  object-cover
                  opacity-70
                "
              />
            )}

            <span
              className="
                relative
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-sky-500
                text-white
                shadow-2xl
                shadow-sky-500/30
                transition
                hover:scale-110
                hover:bg-sky-400
              "
            >
              <Play
                size={32}
                fill="currentColor"
                className="ml-1"
              />
            </span>
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 p-6 text-center text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Custom controls */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            z-20
            bg-gradient-to-t
            from-[#02070e]
            via-[#02070e]/90
            to-transparent
            px-4
            pb-4
            pt-12
          "
        >
          {/* Progress */}
          <input
            type="range"
            min={0}
            max={
              duration || 100
            }
            step={0.1}
            value={Math.min(
              progress,
              duration || 100,
            )}
            onChange={(event) =>
              seek(
                Number(
                  event.target.value,
                ),
              )
            }
            aria-label="Video progress"
            className="
              mb-3
              h-1
              w-full
              cursor-pointer
              accent-sky-400
            "
          />

          <div className="flex items-center gap-2">
            {/* Play */}
            <button
              type="button"
              onClick={
                togglePlay
              }
              className="
                rounded-lg
                p-2
                text-white
                transition
                hover:bg-white/10
              "
              aria-label={
                playing
                  ? "Pause"
                  : "Play"
              }
            >
              {playing ? (
                <Pause
                  size={20}
                  fill="currentColor"
                />
              ) : (
                <Play
                  size={20}
                  fill="currentColor"
                />
              )}
            </button>

            {/* Volume */}
            <button
              type="button"
              onClick={
                toggleMute
              }
              className="
                rounded-lg
                p-2
                text-white
                transition
                hover:bg-white/10
              "
              aria-label={
                muted
                  ? "Unmute"
                  : "Mute"
              }
            >
              {muted ? (
                <VolumeX
                  size={20}
                />
              ) : (
                <Volume2
                  size={20}
                />
              )}
            </button>

            <input
              type="range"
              min={0}
              max={100}
              value={
                muted
                  ? 0
                  : volume
              }
              onChange={(event) =>
                changeVolume(
                  Number(
                    event.target.value,
                  ),
                )
              }
              aria-label="Volume"
              className="
                hidden
                h-1
                w-20
                cursor-pointer
                accent-sky-400
                sm:block
              "
            />

            {/* Time */}
            <span className="ml-1 text-xs tabular-nums text-zinc-300">
              {formatTime(
                progress,
              )}{" "}
              /{" "}
              {formatTime(
                duration,
              )}
            </span>

            <div className="ml-auto flex items-center gap-1">
              {/* Speed */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setSpeedOpen(
                      (value) =>
                        !value,
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    px-2
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    hover:bg-white/10
                  "
                  aria-label="Playback speed"
                >
                  <span>
                    {playerRef.current?.getPlaybackRate?.() ??
                      1}
                    x
                  </span>

                  <ChevronDown
                    size={14}
                  />
                </button>

                {speedOpen && (
                  <div className="absolute bottom-12 right-0 w-32 rounded-xl border border-zinc-700 bg-zinc-950 p-1 shadow-2xl">
                    {availableRates.map(
                      (rate) => (
                        <button
                          key={rate}
                          type="button"
                          onClick={() =>
                            changeRate(
                              rate,
                            )
                          }
                          className="
                            flex
                            w-full
                            rounded-lg
                            px-3
                            py-2
                            text-left
                            text-sm
                            text-zinc-300
                            hover:bg-sky-500
                            hover:text-white
                          "
                        >
                          {rate}x
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* Subtitles */}
              <button
                type="button"
                onClick={
                  toggleSubtitles
                }
                className={`
                  rounded-lg
                  px-2
                  py-2
                  text-xs
                  font-bold
                  transition
                  ${
                    subtitleOn
                      ? "bg-sky-500 text-white"
                      : "text-zinc-300 hover:bg-white/10"
                  }
                `}
                aria-label="Toggle subtitles"
                title="Subtitles"
              >
                CC
              </button>

              {/* Quality */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setQualityOpen(
                      (value) =>
                        !value,
                    )
                  }
                  className="
                    rounded-lg
                    p-2
                    text-zinc-300
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                  aria-label="Video quality"
                  title="Quality"
                >
                  <Settings
                    size={19}
                  />
                </button>

                {qualityOpen && (
                  <div className="absolute bottom-12 right-0 w-36 rounded-xl border border-zinc-700 bg-zinc-950 p-2 shadow-2xl">
                    <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Quality
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setQualityOpen(
                          false,
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-lg
                        bg-sky-500/10
                        px-3
                        py-2
                        text-sm
                        text-sky-300
                      "
                    >
                      Auto
                    </button>

                    <p className="mt-2 px-2 text-xs text-zinc-600">
                      Quality options are
                      controlled by
                      YouTube.
                    </p>
                  </div>
                )}
              </div>

              {/* Cinema */}
              <button
                type="button"
                onClick={
                  toggleCinema
                }
                className="
                  rounded-lg
                  p-2
                  text-zinc-300
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
                aria-label="Cinema mode"
                title="Cinema mode"
              >
                <span className="text-sm">
                  ▬
                </span>
              </button>

              {/* Fullscreen */}
              <button
                type="button"
                onClick={
                  toggleFullscreen
                }
                className="
                  rounded-lg
                  p-2
                  text-zinc-300
                  transition
                  hover:bg-white/10
                  hover:text-white
                "
                aria-label={
                  fullscreen
                    ? "Exit fullscreen"
                    : "Fullscreen"
                }
              >
                {fullscreen ? (
                  <Minimize
                    size={19}
                  />
                ) : (
                  <Maximize
                    size={19}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="border-t border-sky-900/30 bg-[#07111f] px-5 py-4">
        <h3 className="font-semibold text-white">
          {media.title ??
            "Official Trailer"}
        </h3>

        <p className="mt-1 text-xs text-zinc-500">
          YouTube trailer
        </p>
      </div>
    </div>
  );
}
