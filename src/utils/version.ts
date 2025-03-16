// Get version from package.json or generate a timestamp-based one
export const getVersion = () => {
  try {
    // Try to get version from package.json
    const packageJson = require("../../package.json");
    return packageJson.version;
  } catch {
    // Fallback to timestamp if package.json is not available
    const date = new Date();
    return `${date.getFullYear()}.${
      date.getMonth() + 1
    }.${date.getDate()}-${date.getTime()}`;
  }
};
