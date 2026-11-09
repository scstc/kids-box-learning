export type GrammarQuestion = {
  id: string;
  unitId: number;
  prompt: string;
  options: [string, string, string];
  answerIndex: 0 | 1 | 2;
  explanation: string;
};

const q = (id: string, unitId: number, prompt: string, options: GrammarQuestion["options"], answerIndex: GrammarQuestion["answerIndex"], explanation: string): GrammarQuestion =>
  ({ id, unitId, prompt, options, answerIndex, explanation });

// Independent response practice following the book's Functions, Grammar and
// reference pages. Only one option answers the question; personal facts do not
// compete with another equally valid name, age, preference or yes/no answer.
export const grammarQuestions: GrammarQuestion[] = [
  // Unit 1: introductions and age, pp. 5–8.
  q("unit1-name", 1, "What's your name?", ["I'm Suzy.", "I'm three.", "It's blue."], 0,
    "A name answers What's your name?"),
  q("unit1-age", 1, "How old are you?", ["It's a pencil.", "I'm three.", "I'm Suzy."], 1,
    "An age answers How old are you?"),
  q("unit1-colour", 1, "What colour is it?", ["I'm seven.", "It's a book.", "It's blue."], 2,
    "Blue is a colour. Listen for What colour."),

  // Unit 2: people, classroom objects and greetings, pp. 10–14.
  q("unit2-person", 2, "Who's that?", ["He's Mr Star.", "It's a pencil.", "I'm three."], 0,
    "Who asks about a person. He's Mr Star tells us who."),
  q("unit2-greeting", 2, "How are you?", ["It's a book.", "I'm fine, thank you.", "It's blue."], 1,
    "I'm fine, thank you answers a friendly How are you?"),
  q("unit2-object", 2, "What's this?", ["She's eight.", "I'm Stella.", "It's a pencil."], 2,
    "It's a pencil names an object."),

  // Unit 3: locations with in, next to and under, pp. 20–22.
  q("unit3-ball", 3, "Where's the ball?", ["It's next to the chair.", "It's blue.", "I'm six."], 0,
    "Where asks for a place. Next to the chair tells us where."),
  q("unit3-bag", 3, "Is your ball in your bag?", ["I'm Suzy.", "No, it's next to your chair.", "They're long."], 1,
    "The answer starts with No and tells us where the ball is."),
  q("unit3-train", 3, "Where's the train?", ["He's Mr Star.", "I'm three.", "It's under the table."], 2,
    "Under the table tells us the train's place."),

  // Unit 4: family and descriptions, pp. 24–28; age reference p. 94.
  q("unit4-family", 4, "Who's that?", ["That's my grandfather.", "It's next to the chair.", "I'm three."], 0,
    "Who asks about a person. My grandfather names a family member."),
  q("unit4-age", 4, "How old is she?", ["It's in the kitchen.", "She's seven.", "She's Stella."], 1,
    "Use She's with her age: She's seven."),
  q("unit4-description", 4, "Is your grandfather old or young?", ["It's blue.", "It's a pencil.", "He's old."], 2,
    "Old describes your grandfather. Use He's to talk about him."),

  // Unit 5: singular/plural descriptions, pp. 35–38.
  q("unit5-animals", 5, "What are they?", ["They're cats.", "It's a book.", "She's eight."], 0,
    "Use They're to name more than one animal."),
  q("unit5-size", 5, "Is your dog big or small?", ["I'm seven.", "It's big.", "I'm Suzy."], 1,
    "Big answers the question about your dog's size."),
  q("unit5-length", 5, "Are the fish long or short?", ["She's seven.", "I'm Suzy.", "They're long."], 2,
    "Long answers the question about the fish. Use They're for more than one."),

  // Unit 6: have got and short answers, pp. 42–44.
  q("unit6-have", 6, "Have you got a brown dog?", ["Yes, I have.", "Yes, I can.", "Yes, I do."], 0,
    "Have you got pairs with Yes, I have."),
  q("unit6-havent", 6, "Have you got a small mouth?", ["No, I can't.", "No, I haven't.", "No, I don't."], 1,
    "Have you got pairs with No, I haven't."),
  q("unit6-description", 6, "What have you got?", ["It's under the table.", "I'm six.", "I've got a yellow face."], 2,
    "I've got tells us what you have."),

  // Unit 7: animal guessing and they've got, pp. 50–52.
  q("unit7-guess", 7, "What am I?", ["You're an elephant.", "I'm seven.", "It's next to the chair."], 0,
    "Answer the speaker with You're and an animal name."),
  q("unit7-havent", 7, "Have they got small ears?", ["No, I can't.", "No, they haven't.", "No, I don't."], 1,
    "Have they got pairs with No, they haven't."),
  q("unit7-description", 7, "What have they got?", ["She's seven.", "It's blue.", "They've got big ears."], 2,
    "They've got tells us what the animals have."),

  // Unit 8: he/she has got and clothing, pp. 56–58.
  q("unit8-has", 8, "Has Simon got my red trousers?", ["Yes, he has.", "Yes, I can.", "Yes, I do."], 0,
    "Simon is he. Has Simon got pairs with Yes, he has."),
  q("unit8-clothes", 8, "What has she got?", ["I'm three.", "She's got your red trousers.", "They're long."], 1,
    "She's got tells us what she has."),
  q("unit8-person", 8, "Who's got a yellow jacket?", ["It's blue.", "They're eating fish.", "Meera!"], 2,
    "Who asks for the person's name. Meera answers who."),

  // Unit 9: ability and can/can't, pp. 66–68.
  q("unit9-can", 9, "Can you sing?", ["Yes, I can.", "Yes, I have.", "Yes, I do."], 0,
    "Can you pairs with Yes, I can."),
  q("unit9-cant", 9, "Can you swim?", ["No, I haven't.", "No, I can't.", "No, I don't."], 1,
    "Can you pairs with No, I can't."),
  q("unit9-person", 9, "Who can draw?", ["It's in the kitchen.", "It's blue.", "Grandma."], 2,
    "Who asks for a person. Grandma tells us who can draw."),

  // Unit 10: actions happening now, pp. 72–74; short-answer reference p. 95.
  q("unit10-action", 10, "What are you doing?", ["I'm flying my plane.", "I'm three.", "Yes, I have."], 0,
    "I'm flying tells us what you are doing now."),
  q("unit10-guess", 10, "What am I doing?", ["I'm three.", "You're driving a lorry.", "That's Meera."], 1,
    "Answer the speaker with You're and the action."),
  q("unit10-are", 10, "Are you flying your helicopter?", ["Yes, I can.", "Yes, I do.", "Yes, I am."], 2,
    "Are you pairs with Yes, I am when talking about an action now."),

  // Unit 11: people, actions and rooms, pp. 79–82; plural reference p. 95.
  q("unit11-action", 11, "What's Stella doing?", ["She's reading a book.", "She's seven.", "It's next to the chair."], 0,
    "She's reading tells us Stella's action now."),
  q("unit11-place", 11, "Where is she?", ["She's seven.", "She's in the bedroom.", "She's reading a book."], 1,
    "Where asks for a place. In the bedroom tells us where she is."),
  q("unit11-they", 11, "What are they doing?", ["They're long.", "They've got big mouths.", "They're sitting on the sofa."], 2,
    "They're sitting tells us what they are doing now."),

  // Unit 12: preferences and do/don't, pp. 86–88 and 95.
  q("unit12-do", 12, "Do you like apples?", ["Yes, I do.", "Yes, I can.", "Yes, I have."], 0,
    "Do you like pairs with Yes, I do."),
  q("unit12-dont", 12, "Do you like ice cream?", ["No, I can't.", "No, I don't.", "No, I haven't."], 1,
    "Do you like pairs with No, I don't."),
  q("unit12-preference", 12, "What do you like?", ["It's blue.", "I'm six.", "I like cake."], 2,
    "I like cake tells us what you like."),
];

export function grammarQuestionsForUnit(unitId: number): GrammarQuestion[] {
  return grammarQuestions.filter(question => question.unitId === unitId);
}
