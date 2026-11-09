import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { learningBooks } from "../data/books";
import { originalCover } from "../data/originalArt";
import { mediaUrl } from "../data/media";
import GlareHover from "./reactbits/GlareHover";
import "./bookShelf.css";

export default function BookShelf({ animated, onOpen }: { animated: boolean; onOpen: () => void }) {
  return <section className="kb-bookshelf" aria-labelledby="library-title">
    <div className="kb-small-section-heading"><h2 id="library-title">Your library</h2><span>A little adventure in every book.</span></div>
    <div className="kb-bookshelf-grid">
      {learningBooks.map(book => {
        const available = book.status === "available";
        const card = <button className="kb-book-choice" disabled={!available} onClick={available ? onOpen : undefined}
          aria-label={`Book ${book.number}: ${available ? "open Book 1" : "Coming soon"}`}>
          <span className="kb-book-choice-art" aria-hidden="true">
            {available ? <img src={mediaUrl(originalCover.file)} width={originalCover.width} height={originalCover.height} alt="" loading="lazy" /> : <><BookOpen size={30} /><b>{book.number}</b></>}
          </span>
          <strong>Book {book.number}</strong>
          <span className="kb-book-status">{available ? <><ArrowRight size={14} />Explore now</> : <><Clock3 size={14} />Coming soon</>}</span>
        </button>;
        return available && animated ? <GlareHover key={book.number} className="kb-book-glare" width="100%" height="100%" background="var(--surface)" borderColor="var(--primary-soft-border)" borderRadius="18px" glareColor="#b4d8ff" glareOpacity={0.25} variant="sheen" mode="click" intro playOnce>{card}</GlareHover>
          : <div key={book.number} className={`kb-book-static ${available ? "is-available" : ""}`}>{card}</div>;
      })}
    </div>
  </section>;
}
