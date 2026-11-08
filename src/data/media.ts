export function mediaUrl(file: string) {
  return `${import.meta.env.BASE_URL}${file.split("/").map(encodeURIComponent).join("/")}`;
}

export function pauseOtherMedia(active?: HTMLMediaElement) {
  document.querySelectorAll<HTMLMediaElement>("audio, video").forEach((media) => {
    if (media !== active) media.pause();
  });
}
