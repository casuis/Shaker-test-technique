export function getGeneratedAvatarUrl(seed: string) {
  const normalizedSeed = seed.trim() || "participant";

  return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(normalizedSeed)}`;
}
