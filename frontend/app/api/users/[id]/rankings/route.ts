import { headers } from "next/headers";
import { authClient } from "@/utils/auth-client";
import { NextResponse } from "next/server";
import { pool } from "@/utils/database";
import { ListInfo, RankingInfo } from "@/utils/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: requestedUserId } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers() 
    }
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.data?.user.id;
  var text = `SELECT * FROM ranking WHERE owner_id = $1 AND privacy = 'public'`
  if (userId == requestedUserId) {
    text = `SELECT * FROM ranking WHERE owner_id = $1`
  }

  try {
    const values = [requestedUserId];
    const res = await pool.query<RankingInfo>(text, values);

    if (res.rowCount == null || res.rowCount == 0) {
        return NextResponse.json([]);
    }

    return NextResponse.json(res.rows);

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}