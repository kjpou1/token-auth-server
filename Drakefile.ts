import {
  desc,
  run,
  sh,
  shCapture,
  task,
} from "https://deno.land/x/drake@v1.5.0/mod.ts";

desc("Help");
task("help", [], function () {
  const tasks = [
    ["start        ", "Run API"],
    ["denon        ", "Run API via denon for development"],
    ["cache        ", "Cache and lock dependencies"],
    [
      "mongodb      ",
      "Start mongodb server for development",
    ],
    ["mongodb-stop ", "Stop mongodb server for development"],
    [
      "denon-install",
      "Install denon for development",
    ],
    ["mongodb-install", "Install mongodb for development"],
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
    "PORT=8000 deno run --allow-env --allow-net --allow-read --unstable --import-map=import_map.json src/mod.ts",
  );
});

desc("Run API via denon for development");
task("denon", [], async function () {
  await sh(
    "PORT=8000 denon run --allow-env --allow-net --allow-read --unstable --import-map=import_map.json src/mod.ts",
  );
});

//"brew services start mongodb/brew/mongodb-community",
// "docker run -d -p 27017:27017 --dbpath /usr/local/var/mongodb --name deno-auth mongo",

desc("Start mongodb server for development");
task("mongodb", [], async function () {
  await sh(
    "brew services start mongodb/brew/mongodb-community",
  );
});

//"docker stop deno-auth",
desc("Stop mongodb server for development");
task("mongodb-stop", [], async function () {
  await sh(
    "brew services stop mongodb/brew/mongodb-community",
  );
});

desc("Cache and lock dependencies");
task("cache", [], async function () {
  await sh(
    "deno cache --lock=lock.json --lock-write --unstable --import-map=import_map.json src/mod.ts",
  );
});

desc("Cache reload and lock dependencies");
task("cache-reload", [], async function () {
  await sh(
    "deno cache --reload --lock=lock.json --lock-write --unstable --import-map=import_map.json src/mod.ts",
  );
});

desc("Install denon for development");
task("denon-install", [], async function () {
  await sh("deno install -Af --unstable https://deno.land/x/denon/denon.ts");
});

desc("Install mongodb for development");
task("mongodb-install", [], async function () {
  await sh("brew install mongodb-community@5.0");
});

desc("Generate secret key");
task("gen-secret", [], async function () {
  const { output } = await shCapture("openssl rand 256 | base64");
  console.log(`JWT_SECRET=${output}`);
});

run();
