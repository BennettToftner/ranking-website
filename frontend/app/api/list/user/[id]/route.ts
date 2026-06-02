import { headers } from "next/headers";
import { authClient } from "@/utils/auth-client";
import { NextResponse } from "next/server";
import { pool } from "@/utils/database";
import { ListInfo } from "@/utils/utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: requestedUserId } = await params;

  console.log('Received request');

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers() 
    }
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.data?.user.id;
  var text = `SELECT * FROM list WHERE owner_id = $1 AND privacy = 'public'`
  if (userId == requestedUserId) {
    text = `SELECT * FROM list WHERE owner_id = $1`
  }

  console.log(`User ${userId} requested to see lists of user ${requestedUserId}`)
  console.log(`Query is: ${text}`);

  try {
    const values = [requestedUserId];
    console.log(`Attempting to access database`);
    const res = await pool.query<ListInfo>(text, values);
    console.log(`Accessed`);

    if (res.rowCount != null && res.rowCount > 0) {
          return NextResponse.json(res.rows);
    }

    return NextResponse.json([]);

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}