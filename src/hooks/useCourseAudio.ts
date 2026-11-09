import { useCallback, useEffect, useRef, useState } from "react";
import type { CourseWord } from "../data/course";
import { wordAudioPath, soundAudioPath } from "../data/practiceAudio";
import { pauseOtherMedia } from "../data/media";
import appVersion from "../../app-version.json";

export function useCourseAudio() {
  const player = useRef<HTMLAudioElement | null>(null);
  const request = useRef(0);
  const lastRequest = useRef<{
    text: string;
    path: string;
    slow: boolean;
  } | null>(null);
  const [playingText, setPlayingText] = useState("");
  const [lastText, setLastText] = useState("");
  const [error, setError] = useState("");
  const [blending, setBlending] = useState(false);
  const stop = useCallback(() => {
    request.current++;
    player.current?.pause();
    setPlayingText("");
    setBlending(false);
  }, []);
  const playFile = useCallback(
    async (
      text: string,
      path: string,
      slow = false,
      sequence?: { id: number; onEnd: () => void },
    ) => {
      if (!sequence) stop();
      const current = request.current;
      if (sequence && sequence.id !== current) return;
      pauseOtherMedia();
      setError("");
      setLastText(text);
      lastRequest.current = { text, path, slow };
      const audio = new Audio(`${import.meta.env.BASE_URL}${path}?v=${appVersion.version}`);
      player.current = audio;
      audio.playbackRate = slow ? 0.75 : 1;
      audio.preservesPitch = true;
      const fail = () => {
        if (request.current !== current) return;
        setPlayingText("");
        setBlending(false);
        setError("Audio could not load. Check the volume or connection and try again.");
      };
      audio.onerror = fail;
      audio.onended = () => {
        if (request.current === current) {
          setPlayingText("");
          sequence?.onEnd();
        }
      };
      try {
        setPlayingText(text);
        await audio.play();
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError"))
          fail();
      }
    },
    [stop],
  );
  const play = useCallback(
    (text: string, slow = false) =>
      playFile(text, wordAudioPath(text), slow),
    [playFile],
  );
  const playSound = useCallback(
    (ipa: string, label: string) =>
      playFile(label, soundAudioPath(ipa)),
    [playFile],
  );
  const retry = useCallback(() => {
    const last = lastRequest.current;
    if (last) void playFile(last.text, last.path, last.slow);
  }, [playFile]);
  const blend = useCallback(
    (word: CourseWord) => {
      stop();
      const id = request.current;
      setBlending(true);
      const parts = word.sounds.flatMap((sound, index) =>
        sound
          ? [
              {
                text: `${word.id}:${index}`,
                path: soundAudioPath(sound),
              },
            ]
          : [],
      );
      const steps = [
        ...(parts.length > 1 ? parts : []),
        { text: word.en, path: wordAudioPath(word.en) },
      ];
      const next = (index: number) => {
        if (request.current !== id) return;
        if (index === steps.length) {
          setBlending(false);
          return;
        }
        const step = steps[index];
        void playFile(step.text, step.path, false, {
          id,
          onEnd: () => next(index + 1),
        });
      };
      next(0);
    },
    [playFile, stop],
  );
  useEffect(
    () => () => {
      request.current++;
      player.current?.pause();
    },
    [],
  );
  return {
    play,
    playSound,
    blend,
    blending,
    retry,
    stop,
    playingText,
    lastText,
    error,
  };
}

export type CourseAudio = ReturnType<typeof useCourseAudio>;
