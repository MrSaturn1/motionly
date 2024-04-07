import { data, motionDraft } from "@/lib/data";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  return Response.json({ motion: motionDraft });
}
