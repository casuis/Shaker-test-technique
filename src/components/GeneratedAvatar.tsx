import { getGeneratedAvatarUrl } from "../lib/avatar";

type GeneratedAvatarProps = {
  seed: string;
  label: string;
};

export function GeneratedAvatar({ seed, label }: GeneratedAvatarProps) {
  return (
    <img
      src={getGeneratedAvatarUrl(seed)}
      alt=""
      className="h-10 w-10 shrink-0 rounded-md bg-stone-100 object-cover"
      title={label}
    />
  );
}
