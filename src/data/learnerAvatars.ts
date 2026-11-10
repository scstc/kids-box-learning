import { mediaUrl } from "./media";

export const learnerAvatars = [
  { id: "spider-man", name: "Spider-Man", src: mediaUrl("learner-avatars/spider-man.svg") },
  { id: "iron-man", name: "Iron Man", src: mediaUrl("learner-avatars/iron-man.svg") },
  { id: "captain-america", name: "Captain America", src: mediaUrl("learner-avatars/captain-america.svg") },
  { id: "hulk", name: "Hulk", src: mediaUrl("learner-avatars/hulk.svg") },
  { id: "thor", name: "Thor", src: mediaUrl("learner-avatars/thor.svg") },
  { id: "black-widow", name: "Black Widow", src: mediaUrl("learner-avatars/black-widow.svg") },
];

export const defaultLearnerAvatarId = "spider-man";

export function learnerAvatar(id: string | undefined) {
  return learnerAvatars.find((avatar) => avatar.id === id) ?? learnerAvatars[0];
}

export const getLearnerAvatar = learnerAvatar;
