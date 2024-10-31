export const calculateAgeAtDate = (
  birthDate: string | null,
  targetDate: string
): number | null => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const target = new Date(targetDate);
  let age = target.getFullYear() - birth.getFullYear();
  if (
    target.getMonth() < birth.getMonth() ||
    (target.getMonth() === birth.getMonth() &&
      target.getDate() < birth.getDate())
  ) {
    age--;
  }
  return age;
};
