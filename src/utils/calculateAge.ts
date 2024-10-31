export const calculateAgeAtDate = (
  birthDate: string | null,
  targetDate: string
): number | null => {
  console.log("calculateAgeAtDate called with:", { birthDate, targetDate });

  if (
    !birthDate ||
    isNaN(Date.parse(birthDate)) ||
    isNaN(Date.parse(targetDate))
  ) {
    console.log("Invalid date detected:", { birthDate, targetDate });
    return null;
  }

  const birth = new Date(birthDate);
  const target = new Date(targetDate);

  console.log("Parsed dates:", { birth, target });

  let age = target.getFullYear() - birth.getFullYear();
  if (
    target.getMonth() < birth.getMonth() ||
    (target.getMonth() === birth.getMonth() &&
      target.getDate() < birth.getDate())
  ) {
    age--;
  }

  console.log("Calculated age:", age);

  return age;
};
