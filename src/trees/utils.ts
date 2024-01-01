export const stringToColorCode = (str: string) => {
  // A simple hash function
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert the hash to a 6 character hexadecimal code
  let color = Math.abs(hash).toString(16).substring(0, 6);

  // Ensure it's 6 characters long
  while (color.length < 6) {
    color += "0";
  }

  return `#${color}`;
};
