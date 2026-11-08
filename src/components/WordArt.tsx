import {
  Apple,
  Armchair,
  Backpack,
  Bath,
  BedDouble,
  Bike,
  Bird,
  BookOpen,
  Bus,
  CakeSlice,
  Candy,
  Car,
  Cat,
  Circle,
  Citrus,
  CookingPot,
  DoorOpen,
  Eraser,
  Fish,
  Flower2,
  Footprints,
  Goal,
  Hand,
  House,
  IceCreamBowl,
  MessageCircle,
  Monitor,
  Music,
  Pencil,
  Pen,
  PersonStanding,
  Plane,
  Sailboat,
  School,
  Shirt,
  Smile,
  Sparkles,
  Table,
  TrainFront,
  Truck,
  Users,
  Waves,
  AppWindow,
  Baby,
  Dog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AnimalArt from "./AnimalArt";
import { animals } from "../data/animals";

const icons: Record<string, LucideIcon> = {
  hello: Hand,
  goodbye: Hand,
  book: BookOpen,
  chair: Armchair,
  table: Table,
  pen: Pen,
  pencil: Pencil,
  eraser: Eraser,
  bag: Backpack,
  school: School,
  ball: Circle,
  bike: Bike,
  car: Car,
  doll: Baby,
  train: TrainFront,
  computer: Monitor,
  mother: Users,
  father: Users,
  brother: PersonStanding,
  sister: PersonStanding,
  grandmother: Users,
  grandfather: Users,
  family: Users,
  baby: Baby,
  happy: Smile,
  sad: Smile,
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  horse: Footprints,
  mouse: Cat,
  big: Circle,
  small: Circle,
  long: Footprints,
  short: Footprints,
  face: Smile,
  eye: Smile,
  ear: Smile,
  nose: Smile,
  mouth: Smile,
  hair: Smile,
  head: Smile,
  tooth: Smile,
  hand: Hand,
  foot: Footprints,
  tail: Footprints,
  leg: Footprints,
  body: PersonStanding,
  shirt: Shirt,
  "t-shirt": Shirt,
  skirt: Shirt,
  dress: Shirt,
  trousers: Footprints,
  shoes: Footprints,
  socks: Footprints,
  jacket: Shirt,
  play: Sparkles,
  swim: Waves,
  run: PersonStanding,
  jump: PersonStanding,
  sing: Music,
  dance: Music,
  ride: Bike,
  football: Goal,
  tennis: Circle,
  basketball: Circle,
  bus: Bus,
  boat: Sailboat,
  plane: Plane,
  helicopter: Plane,
  lorry: Truck,
  motorbike: Bike,
  funny: Smile,
  hungry: Apple,
  house: House,
  "living-room": Armchair,
  bedroom: BedDouble,
  bathroom: Bath,
  kitchen: CookingPot,
  garden: Flower2,
  door: DoorOpen,
  window: AppWindow,
  apple: Apple,
  banana: Citrus,
  orange: Citrus,
  pear: Apple,
  cake: CakeSlice,
  chocolate: Candy,
  "ice-cream": IceCreamBowl,
  party: Sparkles,
};
const colors: Record<string, string> = {
  red: "#db6f63",
  yellow: "#eac665",
  pink: "#e4a0ba",
  green: "#8da970",
  orange: "#df9b54",
  purple: "#a58bbb",
  blue: "#7da8c4",
  black: "#4e5255",
  white: "#faf8ed",
  brown: "#a18165",
  grey: "#a4aaa8",
};
const numbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];
export const unitIcons: Record<string, LucideIcon> = {
  hello: MessageCircle,
  school: School,
  toys: TrainFront,
  family: Users,
  pets: Cat,
  face: Smile,
  animals: Footprints,
  clothes: Shirt,
  actions: Bike,
  transport: Bus,
  house: House,
  party: CakeSlice,
};

export default function WordArt({
  id,
  unitId,
  className = "",
}: {
  id: string;
  unitId: number;
  className?: string;
}) {
  const animal = animals.find((animal) => animal.id === id);
  if (animal) return <AnimalArt animal={animal.id} className={className} />;
  if (colors[id] && !(unitId === 12 && id === "orange"))
    return (
      <svg
        className={`word-art ${className}`}
        viewBox="0 0 160 160"
        aria-hidden="true"
      >
        <path
          d="M81 18C112 16 146 46 137 82S111 144 77 140 19 114 21 79 48 21 81 18"
          fill={colors[id]}
          stroke={id === "white" ? "#dddccf" : "none"}
          strokeWidth="2"
        />
        <ellipse
          cx="57"
          cy="49"
          rx="12"
          ry="7"
          fill="white"
          opacity=".25"
          transform="rotate(-40 57 49)"
        />
      </svg>
    );
  if (numbers.includes(id))
    return (
      <span className={`number-art ${className}`} aria-hidden="true">
        {numbers.indexOf(id) + 1}
        <span>
          {Array.from({ length: numbers.indexOf(id) + 1 }, (_, index) => (
            <i key={index} />
          ))}
        </span>
      </span>
    );
  if (id === "banana")
    return (
      <svg
        className={`word-art ${className}`}
        viewBox="0 0 160 160"
        aria-hidden="true"
      >
        <path
          d="M39 36q0 78 84 55-39 69-90 20Q7 83 31 35"
          fill="#edc460"
          stroke="#c59c49"
          strokeWidth="3"
        />
        <path
          d="M36 46q-2 76 75 55"
          stroke="#f9df8f"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path d="m31 35 6-13 8 4-6 15m82 50 9-2 3 5-12 6" fill="#86673c" />
      </svg>
    );
  if (id === "pear")
    return (
      <svg
        className={`word-art ${className}`}
        viewBox="0 0 160 160"
        aria-hidden="true"
      >
        <path
          d="M68 37q-16 9-17 29-3 12-20 31-16 36 27 44h45q43-8 25-43-19-21-20-34-2-29-23-29"
          fill="#bdc47b"
        />
        <path
          d="m78 38 6-21"
          stroke="#8a7045"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path d="M84 27q9-22 31-14-4 23-31 14" fill="#7f9b68" />
      </svg>
    );
  if (
    ["eye", "ear", "nose", "mouth", "hair", "head", "face", "tooth"].includes(
      id,
    )
  )
    return (
      <svg
        className={`word-art ${className}`}
        viewBox="0 0 160 160"
        aria-hidden="true"
      >
        <ellipse cx="80" cy="85" rx="47" ry="52" fill="#f4d5b0" />
        <ellipse
          cx="31"
          cy="88"
          rx="9"
          ry="15"
          fill={id === "ear" ? "#bf795c" : "#edc8a1"}
        />
        <ellipse
          cx="129"
          cy="88"
          rx="9"
          ry="15"
          fill={id === "ear" ? "#bf795c" : "#edc8a1"}
        />
        <path
          d="M34 64q-6-42 43-44 53-2 52 45-23-7-26-27-8 26-69 26"
          fill={id === "hair" ? "#bf795c" : "#85715c"}
        />
        <g fill={id === "eye" ? "#bf795c" : "#655541"}>
          <ellipse
            cx="62"
            cy="81"
            rx={id === "eye" ? 7 : 4}
            ry={id === "eye" ? 8 : 5}
          />
          <ellipse
            cx="99"
            cy="81"
            rx={id === "eye" ? 7 : 4}
            ry={id === "eye" ? 8 : 5}
          />
        </g>
        <path
          d="m80 86-5 15h10"
          stroke={id === "nose" ? "#b96d53" : "#ceaa83"}
          strokeWidth={id === "nose" ? 6 : 3}
          strokeLinecap="round"
        />
        <path
          d="M59 112q21 19 43 0"
          stroke={id === "mouth" ? "#bf795c" : "#b68c6b"}
          strokeWidth={id === "mouth" ? 7 : 3}
          strokeLinecap="round"
        />
        {id === "tooth" && (
          <rect x="73" y="114" width="14" height="10" rx="3" fill="white" />
        )}
      </svg>
    );
  const Icon = icons[id] ?? BookOpen;
  return (
    <span className={`icon-art ${className}`} aria-hidden="true">
      <span className="art-disc" />
      <Icon size={95} strokeWidth={1.5} />
      {["big", "small"].includes(id) && (
        <small>{id === "big" ? "BIG" : "small"}</small>
      )}
    </span>
  );
}
