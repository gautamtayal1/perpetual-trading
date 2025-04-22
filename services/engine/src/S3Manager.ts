import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({
  region:           process.env.AWS_REGION,
  endpoint:         process.env.S3_ENDPOINT,
  // forcePathStyle:   process.env.S3_FORCE_PATH_STYLE === "true",
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export const S3Manager = {
  async uploadSnapshot(snapshot: object, key: string) {
    const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
    const body = JSON.stringify(snapshot);
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: "application/json",
    });
    await s3.send(command);
  },

  async downloadSnapshot(key: string): Promise<any | null> {
    const BUCKET_NAME = process.env.S3_BUCKET_NAME!;
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });
      const data = await s3.send(command);
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
