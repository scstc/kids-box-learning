import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimalId } from "../data/animals";
import { wordAudioPath } from "../data/practiceAudio";
import appVersion from "../../app-version.json";

export function usePronunciation() {
  const player = useRef<HTMLAudioElement | null>(null);
  const sequence = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState("");

  const stop = useCallback(() => {
    sequence.current += 1;
    if (player.current) {
      player.current.pause();
      player.current.currentTime = 0;
    }
    setPlaying(false);
  }, []);

  const play = useCallback(
    async (id: AnimalId, slow = false) => {
      stop();
      const request = sequence.current;
      setAudioError("");
      const audio = new Audio(`${import.meta.env.BASE_URL}${wordAudioPath(id)}?v=${appVersion.version}`);
      player.current = audio;
      audio.playbackRate = slow ? 0.75 : 1;
      audio.preservesPitch = true;
      audio.onended = () => {
        if (request === sequence.current) setPlaying(false);
      };
      audio.onerror = () => {
        if (request !== sequence.current) return;
        setPlaying(false);
        setAudioError("Audio could not load. Tap the speaker to try again.");
      };
      try {
        setPlaying(true);
        await audio.play();
      } catch (error) {
        if (
          request !== sequence.current ||
          (error instanceof DOMException && error.name === "AbortError")
        )
          return;
        setPlaying(false);
        setAudioError("Audio could not play. Check the device volume and try again.");
      }
    },
    [stop],
  );

  useEffect(
    () => () => {
      sequence.current += 1;
      player.current?.pause();
    },
    [],
  );
  return { play, stop, playing, audioError };
}
