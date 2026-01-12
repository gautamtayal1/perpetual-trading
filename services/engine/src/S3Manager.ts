import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

let s3: S3Client | null = null;

function isS3Configured(): boolean {
  return !!(process.env.AWS_REGION && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.S3_BUCKET_NAME);
}

function getS3Client(): S3Client | null {
  if (!isS3Configured()) {
    return null;
  }
  if (!s3) {
    s3 = new S3Client({
      region: process.env.AWS_REGION,
      endpoint: process.env.S3_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
      }
    });
  }
  return s3;
}

export const S3Manager = {
  async uploadSnapshot(snapshot: object, key: string) {
    const client = getS3Client();
    if (!client) {
      console.log("S3 not configured, skipping snapshot upload");
      return;
    }
    const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
    const body = JSON.stringify(snapshot);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: "application/json",
    });
    await client.send(command);
  },

  async downloadSnapshot(key: string): Promise<any | null> {
    const client = getS3Client();
    if (!client) {
      console.log("S3 not configured, skipping snapshot download");
      return null;
    }
    const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      const data = await client.send(command);
      const stream = data.Body as Readable;
      const body = await streamToString(stream);
      return JSON.parse(body);
    } catch (err) {
      console.error("Snapshot not found:", err);
      return null;
    }
  },
};

const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });
