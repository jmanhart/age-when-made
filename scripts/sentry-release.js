const SentryCli = require("@sentry/cli");
const { version } = require("../package.json");

async function createRelease() {
  const release = `movieapp@${version}`;
  const cli = new SentryCli();

  try {
    console.log("Creating Sentry release:", release);

    // Create a new release
    await cli.releases.new(release);

    // Upload source maps
    await cli.releases.uploadSourceMaps(release, {
      include: ["dist"],
      urlPrefix: "~/dist",
      rewrite: true,
    });

    // Finalize the release
    await cli.releases.finalize(release);

    console.log("Sentry release completed:", release);
  } catch (e) {
    console.error("Sentry release failed:", e);
    process.exit(1);
  }
}

createRelease();
