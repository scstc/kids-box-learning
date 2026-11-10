import { learnerAvatar } from "../data/learnerAvatars";

export default function LearnerAvatar({ avatarId, className = "" }: { avatarId?: string; className?: string }) {
  const avatar = learnerAvatar(avatarId);
  return <img className={`kb-learner-avatar ${className}`.trim()} src={avatar.src} alt="" width={54} height={54} draggable={false} />;
}
