import { GoogleGenerativeAI } from "@google/generative-ai";
import { createHash } from "crypto";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const pass = process.env.MONGO_PASS;
const user = process.env.MONGO_USER;
const GEMINI_KEY = process.env.GEMINI_KEY || "";

const uri = `mongodb+srv://${user}:${pass}@cluster0.u2jfb2m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const getCLient = () =>
  new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

const generateDescription = async (prompt: string) => {
  try {
    const systemInstruction =
      "create a short open graph description of up to 15 words based on the received messages and in the language of the provided text, the response format is plain text, do not use markdown";

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 50,
        responseMimeType: "text/plain",
      },
    });

    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
  } catch (e) {
    return prompt.length > 100 ? prompt.substring(0, 100) + "..." : prompt;
  }
};

export async function POST(request: Request) {
  const client = getCLient();

  try {
    client.connect();

    const share = client.db("shareDb").collection("share");
    const data = await request.json();
    const prompt =
      data.messages.find(({ role }) => role === "assistant").content || "";

    const description = await generateDescription(prompt);

    const uid = createHash("sha256")
      .update(JSON.stringify(data), "utf-8")
      .digest("hex");

    const findResult = await share.findOne({ uid });

    if (findResult) return Response.json({ id: findResult._id });

    const insertResult = await share.insertOne({ uid, description, data });

    return Response.json({ id: insertResult.insertedId });
  } catch (error) {
    return InvalidRequest();
  } finally {
    await client.close();
  }
}

export async function GET(request: Request) {
  const client = getCLient();

  try {
    client.connect();

    const share = client.db("shareDb").collection("share");
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return InvalidRequest();

    const findResult = await share.findOne({ _id: new ObjectId(id) });

    if (!findResult) return InvalidRequest();
    return Response.json(findResult.data);
  } catch (error) {
    return InvalidRequest();
  } finally {
    await client.close();
  }
}

function InvalidRequest() {
  return new Response("Invalid request body", { status: 400 });
}
