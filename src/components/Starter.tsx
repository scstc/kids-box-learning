import { useState } from "react";
import { AudioLines, BookOpen, Volume2 } from "lucide-react";
import { starterLetters, starterSounds } from "../data/starter";
import type { CourseAudio } from "../hooks/useCourseAudio";
import "./starter.css";

export default function Starter({ audio }: { audio: CourseAudio }) {
  const [tab, setTab] = useState<"letters" | "sounds">("letters");
  return <section className="kb-starter" aria-labelledby="starter-heading">
    <span className="kb-eyebrow">SMALL SOUNDS, BIG DISCOVERIES</span>
    <h1 id="starter-heading">Starter</h1>
    <p className="kb-starter-subtitle">Alphabet &amp; Sounds</p>
    <p>Meet the alphabet. Explore the sounds of English, one little step at a time.</p>
    <div className="kb-starter-tabs" role="group" aria-label="Starter activities">
      <button aria-pressed={tab === "letters"} onClick={() => { audio.stop(); setTab("letters"); }}><BookOpen size={20} />A–Z Alphabet</button>
      <button aria-pressed={tab === "sounds"} onClick={() => { audio.stop(); setTab("sounds"); }}><AudioLines size={20} />English sounds · IPA</button>
    </div>
    {tab === "letters" ? <>
      <h2>Every letter has a name.</h2>
      <p>Tap a letter to hear its name. Uppercase and lowercase are the same letter.</p>
      <div className="kb-letter-chart">{starterLetters.map(({ letter, ipa }) => <button key={letter} aria-label={`Hear letter ${letter}`} aria-pressed={audio.playingText === `starter-letter-${letter}`}
        onClick={() => void audio.playSound(ipa, `starter-letter-${letter}`)}>
        <strong>{letter}<span>{letter.toLowerCase()}</span></strong><small>/{ipa}/</small><Volume2 size={18} />
      </button>)}</div>
      <aside className="kb-starter-note">Next, try English sounds. A letter can make different sounds in different words.</aside>
    </> : <>
      <h2>Listen to 44 English sounds.</h2>
      <p>Tap a symbol to hear the sound. Tap its example word to hear it in a word. British pronunciation.</p>
      {[...new Set(starterSounds.map(sound => sound.group))].map(name => <section key={name} className="kb-sound-group" aria-label={name}>
        <h3>{name}</h3><div className="kb-sound-chart">{starterSounds.filter(sound => sound.group === name).map(({ ipa, example }) => <article key={ipa}>
          <button className="kb-sound-symbol" aria-label={`Hear sound /${ipa}/`} aria-pressed={audio.playingText === `starter-sound-${ipa}`} onClick={() => void audio.playSound(ipa, `starter-sound-${ipa}`)}><strong>/{ipa}/</strong><Volume2 size={17} /></button>
          <button className="kb-sound-example" aria-label={`Hear example ${example}`} onClick={() => void audio.play(example)}>{example}<Volume2 size={14} /></button>
        </article>)}</div>
      </section>)}
      <aside className="kb-starter-note">Listen, then try it yourself. Short sound clips are synthesized demonstrations. Accents vary: some speakers say /ɔː/ in words with /ʊə/.</aside>
    </>}
  </section>;
}
