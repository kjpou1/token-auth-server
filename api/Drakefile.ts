import { desc, run, sh, task } from "https://deno.land/x/drake@v1.5.0/mod.ts";
import { databaseSeed } from "./src/utils/databaseSeed.ts";
import { jwtSecretGen } from "./src/utils/jwtSecretGen.ts";

const DENO_ALLOW = "--allow-env --allow-net --allow-read";
const DENO_RUN_OPTIONS = "--import-map=import_map.json --unstable";
const DENO_PROJECT_NAME = "token-auth-server";

desc("Help");
task("help", [], function () {
  const tasks = [
    ["start        ", "Run API"],
    ["denon        ", "Run API via denon for development"],
    ["test         ", "Run tests"],
    ["cache        ", "Cache and lock dependencies"],
    ["bundle         ", "Run bundle"],
    ["gen-secret", "Generate secret key"],
  ];
  console.log(`\n\n\n\n`);
  console.log(`Task          \t  Description`);
  console.log(`============= \t  ===========`);
  for (const task of tasks) {
    console.log(`${task[0]} \t  ${task[1]}`);
  }
  console.log(`\n\n\n\n`);
});

desc("Run API");
task("start", [], async function () {
  await sh(
    `deno run ${DENO_ALLOW} ${DENO_RUN_OPTIONS} src/mod.ts`,
  );
});

desc("Run API via denon for development");
task("denon", [], async function () {
  await sh(
    `denon run ${DENO_ALLOW} ${DENO_RUN_OPTIONS} src/mod.ts`,
  );
});

desc("Runt API Tests");
task("test", [], async function () {
  // await sh(
  //   "deno test ${DENO_ALLOW} ${DENO_RUN_OPTIONS} --unstable",
  // );
  await sh(
    "echo tests",
  );
});

desc("Start using bundle ");
task("start-bundle", [], async function () {
  await sh(
    `deno run ${DENO_ALLOW} ${DENO_RUN_OPTIONS} bundle/${DENO_PROJECT_NAME}.bundle.js `,
  );
});

desc("Cache and lock dependencies");
task("cache", [], async function () {
  await sh(
    `deno cache --lock=lock.json --lock-write ${DENO_RUN_OPTIONS} src/mod.ts`,
  );
});

desc("Cache reload and lock dependencies");
task("cache-reload", [], async function () {
  await sh(
    `echo ${DENO_RUN_OPTIONS} &&  deno cache --reload --lock=lock.json --lock-write ${DENO_RUN_OPTIONS} src/mod.ts`,
  );
});

desc("Bundle ");
task("bundle", [], async function () {
  await sh(
    `mkdir -p bundle && deno bundle ${DENO_RUN_OPTIONS} src/mod.ts bundle/${DENO_PROJECT_NAME}.bundle.js`,
  );
});

desc("Docker Image build");
task("build-image", [], async function () {
  await sh(`
    docker image rm ${DENO_PROJECT_NAME}
    docker image build -f Dockerfile.prod -t ${DENO_PROJECT_NAME} .
  `);
});

desc("Docker Image tags");
task("tag-image", [], async function () {
  await sh(`
    if [[ -z "$DOCKER_HUB_USERNAME" ]]; then
      echo "Docker Hub user name > DOCKER_HUB_USERNAME < must be set."
    else
      docker tag ${DENO_PROJECT_NAME} $DOCKER_HUB_USERNAME/${DENO_PROJECT_NAME}:latest
    fi
  `);
});

desc("Publish to docker hub");
task(
  "publish",
  ["cache-reload", "build-image", "tag-image"],
  async function () {
    await sh(`
  if [[ -z "$DOCKER_HUB_USERNAME" ]]; then
    echo "Docker Hub user name > DOCKER_HUB_USERNAME < must be set."
  else
    docker push $DOCKER_HUB_USERNAME/${DENO_PROJECT_NAME}:latest
  fi
  `);
  },
);

desc("Install denon for development");
task("denon-install", [], async function () {
  await sh("deno install -Af --unstable https://deno.land/x/denon/denon.ts");
});

desc("Generate secret key");
task("gen-secret", [], async function () {
  await jwtSecretGen();
});

desc("Seed database");
task("seed", [], async function () {
  await databaseSeed();
});

run();
