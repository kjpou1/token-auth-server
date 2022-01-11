import { RouterContext } from "../utils/deps.ts";
import { getBannerText } from "../utils/utils.ts";

export const Banner = async (
  { response }: RouterContext<"/">,
) => {
  const authText = await getBannerText();
  response.body = `${authText}
    Authentication server`;
  // override the "Content-Type"
  response.headers.set("Content-Type", "application/text");
};
