// eSpeak's explicit phoneme notation, never spelling or letter-name speech.
const phonemes: Record<string, string> = {
  dʒ: "dZ", tʃ: "tS", ɑː: "A:", ɔː: "O:", ɜː: "3:", iː: "i:", uː: "u:",
  eɪ: "eI", aɪ: "aI", aʊ: "aU", ɔɪ: "OI", əʊ: "@U", eə: "e@", ɪə: "I@", ʊə: "U@",
  ɪ: "I", ʊ: "U", ə: "@", ɒ: "0", æ: "a", ʌ: "V", ŋ: "N", θ: "T", ð: "D",
  ʃ: "S", ʒ: "Z", ɡ: "g",
};
const tokens = Object.keys(phonemes).sort((a, b) => b.length - a.length);

export function phonicsInput(ipa: string): string {
  if (!ipa) throw new Error("Silent chunks must not produce audio");
  let value = "";
  for (let index = 0; index < ipa.length;) {
    const token = tokens.find(item => ipa.startsWith(item, index));
    if (token) {
      value += phonemes[token];
      index += token.length;
    } else {
      const character = ipa[index++];
      if (!/^[bdfhijklmnprstvwz e]$/.test(character))
        throw new Error(`Unmapped IPA: ${character} in ${ipa}`);
      value += character;
    }
  }
  return `[[${value}]]`;
}

// The synthesis callback reuses WASM memory. Copy before the next callback.
export function copyPhonicsSamples(samples: Int16Array): Buffer {
  return Buffer.from(new Uint8Array(samples.buffer, samples.byteOffset, samples.byteLength));
}
