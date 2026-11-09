import { AudioLines, Volume2 } from "lucide-react";
import type { CourseWord } from "../data/course";
import type { RecordedWordGuide } from "../data/cambridgePronunciation";
import type { CourseAudio } from "../hooks/useCourseAudio";

export default function WordSounds({ word, guide, audio }: {
  word: CourseWord;
  guide: RecordedWordGuide;
  audio: CourseAudio;
}) {
  return <section className="kb-recorded-sounds" aria-label={`Sounds in ${word.en}`}>
    <div className="kb-chunk-heading"><AudioLines size={16} />Sound by sound</div>
    <div className="kb-recorded-sound-buttons">
      {guide.sounds.map((ipa, index) => <button
        key={`${word.id}:${index}`}
        aria-label={`Play sound ${index + 1} in ${word.en}: /${ipa}/`}
        aria-pressed={audio.playingText === `${word.id}:${index}`}
        onClick={() => void audio.playRecordedSound(ipa, `${word.id}:${index}`)}
      ><span>/{ipa}/</span><Volume2 size={16} aria-hidden="true" /></button>)}
    </div>
    <p className="kb-chunk-note">Tap each sound, then listen to the whole word.</p>
  </section>;
}
