import { useCallback, useEffect, useRef, useState } from "react";
import { audioKey } from "../data/course";

export function useCourseAudio() {
  const player = useRef<HTMLAudioElement | null>(null);
  const request = useRef(0);
  const [playingText, setPlayingText] = useState("");
  const [lastText, setLastText] = useState("");
  const [error, setError] = useState("");
  const stop = useCallback(() => {
    request.current++;
    player.current?.pause();
    setPlayingText("");
  }, []);
  const play = useCallback(
    async (text: string, slow = false) => {
      stop();
      const current = request.current;
      setError("");
      setLastText(text);
      const audio = new Audio(
        `${import.meta.env.BASE_URL}course-audio/${audioKey(text)}.mp3`,
      );
      player.current = audio;
      audio.playbackRate = slow ? 0.75 : 1;
      audio.preservesPitch = true;
      const fail = () => {
        if (request.current !== current) return;
        setPlayingText("");
        setError("声音没有加载成功，检查音量或网络后再试一次。");
      };
      audio.onerror = fail;
      audio.onended = () => {
        if (request.current === current) setPlayingText("");
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
  useEffect(
    () => () => {
      request.current++;
      player.current?.pause();
    },
    [],
  );
  return { play, stop, playingText, lastText, error };
}
