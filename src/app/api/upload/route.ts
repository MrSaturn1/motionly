export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ message: "File is required" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await (file as any).arrayBuffer());
    const fileStr = fileBuffer.toString();

    const data = parseFile(fileStr);

    return Response.json(
      {
        data,
      },
      { status: 200 }
    );
  } catch (err) {}
}

// TODO parse file
const parseFile = (inputFile: string): string => {
  return inputFile;
};
