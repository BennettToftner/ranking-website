import { headers } from "next/headers";
import { authClient } from "@/utils/auth-client";
import { NextResponse } from "next/server";
import { pool } from "@/utils/database"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listId } = await params;

  const session = await authClient.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const text = 'SELECT * FROM list WHERE list.id = $1 AND ownerId = $2';
    const values = [listId, session.data?.user.id];
    const res = await pool.query(text, values);

    return NextResponse.json(res.rows);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(
    request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listId } = await params;

  console.log(`list id is ${listId}`)

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers() 
    }
  });

  console.log(`I got ${session.data?.user?.id}`)

  if (!session.data) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const text = "INSERT INTO list (id, name, owner_id, privacy) VALUES ($1, $2, $3, $4)";
    const values = [listId, "test name", session.data?.user.id, "private"];
    console.log(`i'm trying to access database`)
    const res = await pool.query(text, values);
    console.log(`the response was ${res}`)

    return NextResponse.json(res.rows);
  } catch (error) {
    console.log(`Database error: ${error}`)
    return NextResponse.json({ error: "Database Error:" }, { status: 500 });
  }
}