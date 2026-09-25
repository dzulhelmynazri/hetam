import { S3Client } from "@aws-sdk/client-s3";
import { middleware } from "@/trpc/init";
import { env } from "@hetam/utilities";

export const awsS3Middleware = middleware(async function awsS3Middleware(options) {
  const s3 = new S3Client({
    region: "auto",
    endpoint: env.CF_R2_ENDPOINT,
    credentials: {
      accessKeyId: env.CF_R2_ACCESS_KEY_ID,
      secretAccessKey: env.CF_R2_SECRET_ACCESS_KEY,
    },
  });

  return options.next({
    ctx: {
      s3: s3,
      // getPresignedUrl: getSignedUrl,   <---- Dont ever use this shit again
    },
  });
});
