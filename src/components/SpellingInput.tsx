import { useLayoutEffect, useRef } from "react";
import { Delete, Space } from "lucide-react";

export default function SpellingInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (caret.current !== null) {
      input.current?.setSelectionRange(caret.current, caret.current);
      caret.current = null;
    }
  }, [value]);
  const edit = (text: string, remove: "back" | "forward" | null = null) => {
    if (disabled) return;
    const element = input.current;
    let start = element?.selectionStart ?? value.length;
    let end = element?.selectionEnd ?? value.length;
    if (remove && start === end) {
      if (remove === "back") start = Math.max(0, start - 1);
      else end = Math.min(value.length, end + 1);
    }
    const next = (value.slice(0, start) + text + value.slice(end)).slice(0, 64);
    caret.current = Math.min(start + text.length, next.length);
    onChange(next);
    element?.focus({ preventScroll: true });
  };
  return (
    <div className="kb-spelling-entry">
      <label className="kb-spelling-input">
        Write the word you hear
        <input
          ref={input}
          aria-label="Enter the word"
          type="text"
          value={value}
          readOnly
          inputMode="none"
          disabled={disabled}
          placeholder="Use the letter keyboard below"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          onKeyDown={(event) => {
            if (
              event.nativeEvent.isComposing ||
              event.ctrlKey ||
              event.metaKey ||
              event.altKey
            )
              return;
            if (event.key === "Enter") {
              event.preventDefault();
              if (value.trim() && !disabled) onSubmit();
            } else if (event.key === "Backspace" || event.key === "Delete") {
              event.preventDefault();
              edit("", event.key === "Backspace" ? "back" : "forward");
            } else if (event.key.length === 1) {
              event.preventDefault();
              edit(event.key);
            }
          }}
        />
      </label>
      <div
        className="kb-plain-keyboard"
        role="group"
        aria-label="Letter keyboard"
      >
        {Array.from("abcdefghijklmnopqrstuvwxyz").map((letter) => (
          <button
            key={letter}
            type="button"
            disabled={disabled}
            aria-label={`Type letter ${letter}`}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => edit(letter)}
          >
            {letter}
          </button>
        ))}
        <button
          type="button"
          className="kb-keyboard-space"
          disabled={disabled}
          aria-label="Type a space"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => edit(" ")}
        >
          <Space size={19} />
          Space
        </button>
        <button
          type="button"
          className="kb-keyboard-delete"
          disabled={disabled}
          aria-label="Delete one letter"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => edit("", "back")}
        >
          <Delete size={19} />
          Delete
        </button>
      </div>
      <p className="kb-spell-hint">
        Use the A–Z keyboard without word suggestions. A physical keyboard works too.
      </p>
    </div>
  );
}
