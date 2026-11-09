export type PictureItem = { id: string; en: string };
export type PlacementQuestion = {
  id: string;
  unitId: number;
  prompt: string;
  items: [PictureItem, PictureItem, PictureItem];
  answerId: string;
  anchorId: "chair" | "table";
  relation: "on" | "under" | "next-to";
  explanation: string;
};
export type SentenceQuestion = {
  id: string;
  unitId: number;
  prompt: string;
  answer: string[];
  sentence: string;
  distractors?: string[];
  explanation: string;
};
export type PictureFixQuestion = {
  id: string;
  unitId: number;
  imageId: string;
  statement: string;
  isTrue: boolean;
  options: [string, string, string];
  answerIndex: 0 | 1 | 2;
  correctedStatement: string;
  explanation: string;
};

const picture = (en: string): PictureItem => ({ id: en.toLowerCase().replace(/[^a-z0-9]+/g, "-"), en });
const place = (unitId: number, number: number, words: [string, string, string], answer: string, anchorId: PlacementQuestion["anchorId"], relation: PlacementQuestion["relation"]): PlacementQuestion => {
  const position = relation === "next-to" ? "next to" : relation;
  const label = unitId === 1 ? `${answer} card` : `${answer} picture`;
  return { id: `place-${unitId}-${number}`, unitId,
    prompt: `Put the ${label} ${position} the ${anchorId}.`,
    items: words.map(picture) as PlacementQuestion["items"], answerId: picture(answer).id, anchorId, relation,
    explanation: `The ${label} is ${position} the ${anchorId}.` };
};

// The movable objects are picture cards, so room/family/body vocabulary never
// asks a child to put a real kitchen, person or body part on furniture.
export const placementQuestions: PlacementQuestion[] = [
  place(1, 1, ["red", "blue", "yellow"], "red", "table", "on"),
  place(1, 2, ["red", "blue", "yellow"], "blue", "chair", "under"),
  place(2, 1, ["pencil", "book", "eraser"], "pencil", "chair", "under"),
  place(2, 2, ["pencil", "book", "eraser"], "book", "table", "on"),
  place(3, 1, ["ball", "train", "doll"], "ball", "chair", "under"),
  place(3, 2, ["ball", "train", "doll"], "train", "chair", "next-to"),
  place(4, 1, ["mother", "father", "sister"], "mother", "table", "on"),
  place(4, 2, ["mother", "father", "sister"], "sister", "chair", "next-to"),
  place(5, 1, ["cat", "dog", "fish"], "cat", "table", "on"),
  place(5, 2, ["cat", "dog", "fish"], "fish", "chair", "next-to"),
  place(6, 1, ["eye", "ear", "mouth"], "ear", "chair", "under"),
  place(6, 2, ["eye", "ear", "mouth"], "mouth", "table", "on"),
  place(7, 1, ["monkey", "elephant", "tiger"], "monkey", "table", "on"),
  place(7, 2, ["monkey", "elephant", "tiger"], "elephant", "chair", "next-to"),
  place(8, 1, ["jacket", "T-shirt", "socks"], "jacket", "chair", "under"),
  place(8, 2, ["jacket", "T-shirt", "socks"], "socks", "table", "on"),
  place(9, 1, ["guitar", "piano", "football"], "guitar", "chair", "next-to"),
  place(9, 2, ["guitar", "piano", "football"], "football", "table", "under"),
  place(10, 1, ["bus", "boat", "plane"], "boat", "table", "on"),
  place(10, 2, ["bus", "boat", "plane"], "bus", "chair", "next-to"),
  place(11, 1, ["kitchen", "bedroom", "bathroom"], "kitchen", "chair", "next-to"),
  place(11, 2, ["kitchen", "bedroom", "bathroom"], "bathroom", "table", "on"),
  place(12, 1, ["apple", "banana", "cake"], "apple", "table", "on"),
  place(12, 2, ["apple", "banana", "cake"], "banana", "chair", "under"),
];

const sentence = (unitId: number, number: number, prompt: string, answer: string[], explanation: string, distractors?: string[]): SentenceQuestion =>
  ({ id: `sentence-${unitId}-${number}`, unitId, prompt, answer, sentence: answer.join(" "), explanation, ...(distractors ? { distractors } : {}) });

// Personal answers offer one name/age, not competing equally valid facts.
// Phrase tiles keep beginner answers short and make their normal word order clear.
export const sentenceQuestions: SentenceQuestion[] = [
  sentence(1, 1, "What's your name?", ["My name", "is", "Suzy."], "My name is comes before the name."),
  sentence(1, 2, "How old are you?", ["I'm", "three."], "I'm comes before your age."),
  sentence(2, 1, "What's this?", ["It's", "a", "pencil."], "Use a before pencil.", ["an"]),
  sentence(2, 2, "Who's that?", ["He's", "Mr Star."], "He's comes before the person's name."),
  sentence(3, 1, "Where's the ball?", ["It's", "under", "the table."], "Under tells us the ball's place."),
  sentence(3, 2, "Where's the train?", ["It's", "next to", "the chair."], "Keep next to together to describe the place."),
  sentence(4, 1, "Who's that?", ["That's", "my", "grandfather."], "My comes before the family word."),
  sentence(4, 2, "How old is she?", ["She's", "seven."], "She's comes before her age."),
  sentence(5, 1, "What are they?", ["They're", "cats."], "Use They're for more than one cat."),
  sentence(5, 2, "What is it?", ["It's", "a big", "dog."], "Big comes before dog."),
  sentence(6, 1, "Have you got a small mouth?", ["No,", "I", "haven't."], "Have you got pairs with I haven't.", ["hasn't."]),
  sentence(6, 2, "What have you got?", ["I've got", "a yellow", "face."], "Yellow comes before face."),
  sentence(7, 1, "What has the giraffe got?", ["It's got", "a long", "neck."], "Long describes the neck."),
  sentence(7, 2, "Have they got small ears?", ["No,", "they", "haven't."], "Have they got pairs with they haven't.", ["hasn't."]),
  sentence(8, 1, "What has he got?", ["He's got", "a yellow", "jacket."], "He's got comes before the clothes."),
  sentence(8, 2, "Has she got a skirt?", ["Yes,", "she", "has."], "Has she got pairs with she has.", ["have."]),
  sentence(9, 1, "Can you swim?", ["Yes,", "I", "can."], "Can you pairs with I can."),
  sentence(9, 2, "What can you do?", ["I can", "play", "football."], "Can comes before the action."),
  sentence(10, 1, "What are you doing?", ["I'm", "flying", "my plane."], "Use I'm and an action ending in ing."),
  sentence(10, 2, "What am I doing?", ["You're", "driving", "a lorry."], "Answer the speaker with You're and the action."),
  sentence(11, 1, "What's Stella doing?", ["She's", "reading", "a book."], "Use She's and an action ending in ing."),
  sentence(11, 2, "Where is she?", ["She's", "in", "the bedroom."], "In the bedroom tells us where she is."),
  sentence(12, 1, "Do you like apples?", ["Yes,", "I", "do."], "Do you like pairs with I do."),
  sentence(12, 2, "What do you like?", ["I like", "ice cream."], "I like comes before the food."),
];

const fix = (unitId: number, number: number, imageId: string, statement: string, isTrue: boolean, options: PictureFixQuestion["options"], answerIndex: PictureFixQuestion["answerIndex"], explanation: string): PictureFixQuestion =>
  ({ id: `picture-${unitId}-${number}`, unitId, imageId, statement, isTrue, options, answerIndex, correctedStatement: options[answerIndex], explanation });

// These exact original-art assets were visually checked. Corrections concern
// identity, a visible colour/expression, or clearly drawn ears/neck, not guessed ages.
export const pictureFixQuestions: PictureFixQuestion[] = [
  fix(1, 1, "red", "It's blue.", false, ["It's red.", "It's yellow.", "It's blue."], 0, "The colour splash is red."),
  fix(1, 2, "three", "It's three.", true, ["It's five.", "It's three.", "It's one."], 1, "The picture shows the number three."),
  fix(2, 1, "pencil", "It's a pen.", false, ["It's a book.", "It's a pencil.", "It's a pen."], 1, "The picture shows a pencil with a sharpened tip."),
  fix(2, 2, "table", "It's a table.", true, ["It's a chair.", "It's a book.", "It's a table."], 2, "The picture shows a table."),
  fix(3, 1, "train", "It's a car.", false, ["It's a car.", "It's a bike.", "It's a train."], 2, "The picture shows a toy train."),
  fix(3, 2, "doll", "It's a doll.", true, ["It's a doll.", "It's a ball.", "It's a train."], 0, "The picture shows a doll."),
  fix(4, 1, "happy", "She's sad.", false, ["She's happy.", "She's sad.", "She's angry."], 0, "Her smiling face looks happy."),
  fix(4, 2, "sad", "He's sad.", true, ["He's happy.", "He's sad.", "He's angry."], 1, "His downturned mouth and worried face look sad."),
  fix(5, 1, "cat", "It's a dog.", false, ["It's a mouse.", "It's a cat.", "It's a dog."], 1, "The picture shows a cat."),
  fix(5, 2, "fish", "It's a fish.", true, ["It's a cat.", "It's a bird.", "It's a fish."], 2, "The picture shows one fish."),
  fix(6, 1, "ear", "It's a nose.", false, ["It's a nose.", "It's a mouth.", "It's an ear."], 2, "The picture shows an ear."),
  fix(6, 2, "teeth", "These are teeth.", true, ["These are teeth.", "These are eyes.", "These are ears."], 0, "The open mouth shows several teeth."),
  fix(7, 1, "elephant", "It's got small ears.", false, ["It's got big ears.", "It's got small ears.", "It's got no ears."], 0, "The elephant's two ears are drawn very big."),
  fix(7, 2, "giraffe", "It's got a long neck.", true, ["It's got a short neck.", "It's got a long neck.", "It's got no neck."], 1, "The giraffe's neck is clearly long."),
  fix(8, 1, "socks", "These are shoes.", false, ["These are shoes.", "These are socks.", "These are trousers."], 1, "The picture shows a pair of socks."),
  fix(8, 2, "jacket", "It's a red jacket.", true, ["It's a blue jacket.", "It's a green jacket.", "It's a red jacket."], 2, "The jacket in the picture is red."),
  fix(9, 1, "guitar", "This is a piano.", false, ["This is a piano.", "This is a football.", "This is a guitar."], 2, "The musician is holding a guitar."),
  fix(9, 2, "piano", "This is a piano.", true, ["This is a piano.", "This is a guitar.", "This is a football."], 0, "The large instrument with keys is a piano."),
  fix(10, 1, "bus", "It's a plane.", false, ["It's a bus.", "It's a plane.", "It's a boat."], 0, "The picture shows a double-decker bus."),
  fix(10, 2, "boat", "It's a boat.", true, ["It's a lorry.", "It's a boat.", "It's a bus."], 1, "The picture shows a boat with a sail."),
  fix(11, 1, "bedroom", "This is a kitchen.", false, ["This is a kitchen.", "This is a bedroom.", "This is a bathroom."], 1, "The bed shows that this room is a bedroom."),
  fix(11, 2, "kitchen", "This is the kitchen.", true, ["This is the bedroom.", "This is the bathroom.", "This is the kitchen."], 2, "The cooker and kitchen counter show the kitchen."),
  fix(12, 1, "apple", "It's a banana.", false, ["It's a banana.", "It's a cake.", "It's an apple."], 2, "The round red fruit is an apple."),
  fix(12, 2, "banana", "It's yellow.", true, ["It's yellow.", "It's purple.", "It's blue."], 0, "The banana in the picture is yellow."),
];

export const placementQuestionsForUnit = (unitId: number) => placementQuestions.filter(question => question.unitId === unitId);
export const sentenceQuestionsForUnit = (unitId: number) => sentenceQuestions.filter(question => question.unitId === unitId);
export const pictureFixQuestionsForUnit = (unitId: number) => pictureFixQuestions.filter(question => question.unitId === unitId);
