import { decryptIpfsFile } from "~/modules/Files/utils/decryptIpfsFile";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { ReadableOptions } from "stream";

function streamFile(
  path: string,
  options?: ReadableOptions,
): ReadableStream<Uint8Array> {
  const downloadStream = fs.createReadStream(path, options);

  return new ReadableStream({
    start(controller) {
      downloadStream.on("data", (chunk: Buffer) =>
        controller.enqueue(new Uint8Array(chunk)),
      );
      downloadStream.on("end", () => controller.close());
      downloadStream.on("error", (error: NodeJS.ErrnoException) =>
        controller.error(error),
      );
    },
    cancel() {
      downloadStream.destroy();
    },
  });
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (!json?.metadata?.encodedData) {
      return new Response(
        JSON.stringify({
          message: "No data given",
        }),
        {
          status: 500,
        },
      );
    }

    const decodedData = Buffer.from(
      json.metadata.encodedData,
      "base64",
    ).toString("utf-8");
    const [cid, key] = decodedData.split("||");
    if (!cid || !key || !decodedData) {
      return new Response(
        JSON.stringify({
          message: "Incorrect data",
        }),
        {
          status: 500,
        },
      );
    }

    console.log({ cid, key });
    console.log({ cid, key });
    console.log({ cid, key });
    const decryptedFile = await decryptIpfsFile(cid!, key!);
    // var blob = new Blob([decryptedFile], {
    //   type: "application/octet-stream",
    // });
    // const body = routeContextSchema.parse(json) as {
    //   ipfs: string;
    //   theKey: string;
    // };
    // Define a temporary file path
    const tempFilePath = path.join("/tmp", cid!);

    // Write the file to disk
    fs.writeFileSync(tempFilePath, decryptedFile);

    // Read the file back from disk
    const data: ReadableStream<Uint8Array> = streamFile(tempFilePath);

    // Create a response with the file stream
    const response = new NextResponse(data, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${cid}"`,
      },
    });

    return response;
    //return new Response(data);
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        message: "There was an error downloading the file",
      }),
      {
        status: 500,
      },
    );
  }
}
