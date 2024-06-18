import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

import { ChatCompletionContentPartImage } from "openai/resources/index.mjs";

type Message = { role: string; content: string; title: string };

const pass = process.env.MONGO_PASS;
const user = process.env.MONGO_USER;

const uri = `mongodb+srv://${user}:${pass}@cluster0.u2jfb2m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const getCLient = () =>
  new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

const getDescription = (m: Message[]) => {
  const content = m.find((item) => item.role === "assistant")?.content || "";

  return (
    content.length > 100 ? content.slice(0, 100) + "..." : content
  ).replace(/\n+/g, " ");
};

const getPreviewURL = (m: Message[]) => {
  try {
    const content = (m.find((item) => item.role === "user")?.content ??
      []) as ChatCompletionContentPartImage[];

    return content[0].image_url.url;
  } catch (e) {
    return "/preview.png";
  }
};

const getID = (url: string) =>
  new URL(url).pathname.match(/^\/share\/([a-zA-Z0-9]+)$/)?.[1];

export async function GET(request: Request) {
  const html = fs.readFileSync(
    path.join(process.cwd(), "dist/index.html"),
    "utf8",
  );

  const $ = cheerio.load(html);
  const client = getCLient();

  try {
    await client.connect();
    const share = client.db("shareDb").collection("share");

    const id = getID(request.url);

    const findResult = await share.findOne({ _id: new ObjectId(id!) });
    const description = getDescription(findResult!.data.messages);
    const preview = getPreviewURL(findResult!.data.messages);

    $(`meta[property="og:title"]`).attr("content", findResult!.data.title);
    $(`meta[property="og:description"]`).attr("content", description);
    $(`meta[property="og:image"]`).attr("content", preview);

    return new Response($.html(), {
      headers: { "Content-Type": "text/html" },
    });
  } catch (e) {
    $(`meta[property="og:image"]`).attr("content", "/preview.png");
    return new Response($.html(), {
      headers: { "Content-Type": "text/html" },
    });
  } finally {
    await client.close();
  }
}
