import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique file name so images don't overwrite each other
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    // Fire it to Cloudflare
    await s3Client.send(
      new PutObjectCommand({
        Bucket: "ssikamore-assets", // Make sure this matches your bucket name!
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Build the public URL using the domain from Step 1
    const publicUrl = `${process.env.CLOUDFLARE_PUBLIC_URL}/${fileName}`;

    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload to R2" }, { status: 500 });
  }
}
