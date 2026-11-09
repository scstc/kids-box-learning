type Rect = [x: number, y: number, width: number, height: number];
export type SceneQuestion = { id: string; text: string; rect: Rect; correct?: string };
export type SceneAnswer = { id: string; label: string; rect: Rect; replies: Record<string, string> };
export type BookScene = { questions: SceneQuestion[]; answers: SceneAnswer[] };
const q = (id: string, text: string, rect: Rect, correct?: string): SceneQuestion => ({ id, text, rect, correct });
const a = (id: string, label: string, rect: Rect, replies: Record<string, string>): SceneAnswer => ({ id, label, rect, replies });

// Read against the original pictures; responses describe the selected person/object, not a generic recording.
export const bookScenes: Record<number, BookScene> = {
  8: {
    questions: [q("name", "What's your name?", [724,836,343,71]), q("age", "How old are you?", [868,929,310,71])],
    answers: [
      a("stella", "Stella, age 7", [160,925,310,310], { name: "I'm Stella.", age: "I'm seven." }),
      a("simon", "Simon, age 6", [630,987,300,250], { name: "I'm Simon.", age: "I'm six." }),
      a("suzy", "Suzy, age 3", [408,1210,255,250], { name: "I'm Suzy.", age: "I'm three." }),
      a("meera", "Meera, age 8", [915,1207,245,255], { name: "I'm Meera.", age: "I'm eight." }),
    ],
  },
  14: {
    questions: [q("who", "Who's that?", [669,855,243,71])],
    answers: [
      a("mr-star", "Mr Star", [110,947,253,260], { who: "He's Mr Star." }),
      a("maskman", "Maskman", [388,947,225,260], { who: "He's Maskman." }),
      a("stella", "Stella", [670,948,214,255], { who: "She's Stella." }),
      a("monty", "Monty", [935,948,207,260], { who: "He's Monty." }),
      a("marie", "Marie", [145,1222,175,270], { who: "She's Marie." }),
      a("simon", "Simon", [382,1222,235,270], { who: "He's Simon." }),
      a("suzy", "Suzy", [683,1222,175,265], { who: "She's Suzy." }),
      a("mrs-star", "Mrs Star", [925,1222,240,275], { who: "She's Mrs Star." }),
    ],
  },
  22: {
    questions: [q("object", "Hide and play.", [310,808,350,70])],
    answers: [a("book","Book",[145,915,270,235],{object:"It's a book."}), a("pen","Pen",[180,1135,240,85],{object:"It's a pen."}), a("eraser","Eraser",[145,1220,150,120],{object:"It's an eraser."}), a("pencil","Pencil",[240,1300,230,150],{object:"It's a pencil."}), a("chair","Chair",[850,1280,230,180],{object:"It's a chair."})],
  },
  28: {
    questions: [q("correct", "Look at my mother. She's ugly.",[701,853,500,70],"mother")],
    answers: [a("mother","Mother in the picture",[70,930,220,270],{correct:"No, she isn't. She's beautiful."})],
  },
  38: {
    questions: [q("guess","They're long and ugly.",[315,864,379,70],"six")],
    answers: [
      a("one","Group 1: cats",[110,940,260,260],{guess:"Number one. The cats."}), a("two","Group 2: fish",[385,940,210,260],{guess:"Number two. The fish."}),
      a("three","Group 3: dogs",[650,940,220,260],{guess:"Number three. The dogs."}), a("four","Group 4: mice",[930,940,240,260],{guess:"Number four. The mice."}),
      a("five","Group 5: horses",[110,1210,250,260],{guess:"Number five. The horses."}), a("six","Group 6: fish",[385,1210,250,260],{guess:"Number six. The fish."}),
      a("seven","Group 7: dogs",[670,1210,240,260],{guess:"Number seven. The dogs."}), a("eight","Group 8: birds",[935,1210,240,260],{guess:"Number eight. The birds."}),
    ],
  },
  44: {
    questions: [q("dog","Have you got a brown dog?",[269,878,464,71])],
    answers: [a("one","Row 1",[190,974,1000,120],{dog:"Yes, I have."}), a("two","Row 2",[190,1100,1000,120],{dog:"Yes, I have."}), a("three","Row 3",[190,1230,1000,120],{dog:"Yes, I have."}), a("four","Row 4",[190,1370,1000,120],{dog:"No, I haven't."})],
  },
  51: {
    questions: [q("animal","What am I?",[178,1429,241,71])],
    answers: [a("hippo","Hippo",[280,385,600,225],{animal:"You're a hippo."}), a("elephant","Elephant",[330,615,455,200],{animal:"You're an elephant."}), a("snake","Snake",[350,825,230,155],{animal:"You're a snake."}), a("crocodile","Crocodile",[595,830,395,200],{animal:"You're a crocodile."}), a("giraffe","Giraffe",[280,1010,610,310],{animal:"You're a giraffe."})],
  },
  52: {
    questions: [q("ears","Have they got small ears?",[212,905,440,88])],
    answers: [a("reply","Child on the right",[700,1030,340,260],{ears:"No, they haven't."})],
  },
  58: {
    questions: [q("guess","She's got a yellow jacket.",[277,878,416,70],"meera")],
    answers: [
      a("mrs-star","Mrs Star",[115,970,180,480],{guess:"Mrs Star."}), a("alex","Alex",[315,980,165,470],{guess:"Alex."}), a("meera","Meera",[485,1000,170,450],{guess:"Meera!"}),
      a("stella","Stella",[670,970,170,480],{guess:"Stella."}), a("lenny","Lenny",[845,1000,170,450],{guess:"Lenny."}), a("mr-star","Mr Star",[1020,930,165,520],{guess:"Mr Star."}),
    ],
  },
  68: {
    questions: [q("sing","Can you sing?",[440,977,265,83]), q("swim","Can you swim?",[353,1416,283,84])],
    answers: [a("boy","Child on the right",[765,1070,340,340],{sing:"Yes, I can.",swim:"No, I can't."})],
  },
  74: {
    questions: [q("action","I'm driving my car.",[326,866,326,71],"car")],
    answers: [a("walk","Suzy walking",[140,965,190,235],{action:"She's walking."}), a("plane","Maskman flying a helicopter",[420,965,340,235],{action:"He's flying a helicopter."}), a("bike","Monty riding a bike",[855,965,320,235],{action:"He's riding a bike."}), a("lorry","Trevor driving a lorry",[130,1220,255,240],{action:"He's driving a lorry."}), a("car","Mrs Star driving her car",[430,1220,330,240],{action:"She's driving her car."}), a("cycle","Maskman riding a bike",[870,1220,270,240],{action:"He's riding a bike."})],
  },
  82: {
    questions: [q("guess","They're eating fish.",[783,810,333,71],"four")],
    answers: [a("one","Picture 1: playing tennis",[140,1030,230,195],{guess:"Number one. They're playing tennis."}), a("two","Picture 2: driving a lorry",[420,1030,220,195],{guess:"Number two. They're driving a lorry."}), a("three","Picture 3: flying a plane",[665,1030,230,195],{guess:"Number three. They're flying a plane."}), a("four","Picture 4: eating fish",[925,1030,260,195],{guess:"Number four. They're eating fish."}), a("five","Picture 5: reading a book",[130,1250,220,240],{guess:"Number five. He's reading a book."}), a("six","Picture 6: playing the guitar",[400,1250,230,240],{guess:"Number six. He's playing the guitar."}), a("seven","Picture 7: swimming",[660,1250,260,240],{guess:"Number seven. They're swimming."}), a("eight","Picture 8: watching television",[935,1250,240,240],{guess:"Number eight. They're watching television."})],
  },
  88: {
    questions: [q("likes","Read. Listen and say the name.",[315,822,875,65])],
    answers: [a("sam","Sam",[120,895,1080,160],{likes:"Sam. I like basketball and football, but I don't like swimming or tennis."}), a("sue","Sue",[120,1057,1080,150],{likes:"Sue. I don't like dogs or horses, but I like cats and birds."}), a("may","May",[120,1210,1080,150],{likes:"May. I like skirts and jackets, but I don't like trousers or T-shirts."}), a("ben","Ben",[120,1360,1080,145],{likes:"Ben. I don't like burgers or chocolate, but I like ice cream and cake."})],
  },
};

export function sceneReply(page: number, questionId: string, answerId: string) {
  const scene = bookScenes[page];
  const question = scene?.questions.find(q => q.id === questionId);
  const answer = scene?.answers.find(a => a.id === answerId);
  if (!question || !answer || !answer.replies[questionId]) return null;
  return { text: answer.replies[questionId], correct: !question.correct || question.correct === answerId };
}
