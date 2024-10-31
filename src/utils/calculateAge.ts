export const calculateAgeAtDate = (
  birthDate: string | null,
  targetDate: string
): number | null => {
  // Log the initial input values for birthDate and targetDate
  console.log("calculateAgeAtDate called with:", { birthDate, targetDate });

  // Check if either date is invalid
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

  // Log parsed date objects for additional clarity
  console.log("Parsed dates:", { birth, target });

  let age = target.getFullYear() - birth.getFullYear();

  if (
    target.getMonth() < birth.getMonth() ||
    (target.getMonth() === birth.getMonth() &&
      target.getDate() < birth.getDate())
  ) {
    age--;
  }

  // Log the calculated age before returning
  console.log("Calculated age:", age);

  return age;
};
