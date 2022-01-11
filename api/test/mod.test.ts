// mod.test.ts
import { getBannerText } from "../src/utils/utils.ts";
import { expect, IResponse, superoak } from "./deps.test.ts";
/**
 * Test that the server returns the "Banner" JSON object when make a
 * GET request to "/".
 */
Deno.test("it should return Banner text with status code 200", async () => {
  const authText = `${await getBannerText()}
    Authentication server`;
  const request = await superoak("http://localhost:3001/");
  await request.get("api/v1/")
    .set("Accept", "application/text")
    .expect("Content-Type", /text/)
    .expect(200, authText);
});

Deno.test("it should return 401", async () => {
  const request = await superoak("http://localhost:3001/");

  let done: () => void;
  const donePromise = new Promise<void>((resolve) => done = resolve);

  request.post("api/v1/login")
    .set("Content-Type", "application/json")
    .send('{"email":"superoak"}')
    .expect(401).end((err: any, response: IResponse) => {
      if (err) {
        throw err;
      }
      expect(response.body.message).toEqual("User or password not valid.");
      done();
    });
  await donePromise;
});
