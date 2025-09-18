export const calculateAgeAtDate = (
  birthDate: string | null,
  targetDate: string | null
): number | null => {
  // Check for valid dates and handle null or invalid inputs
  if (
    !birthDate ||
    !targetDate ||
    isNaN(Date.parse(birthDate)) ||
    isNaN(Date.parse(targetDate))
  ) {
    return null;
  }

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
