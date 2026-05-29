import { headers } from "next/headers";
import { authClient } from "@/utils/auth-client";
import { NextResponse } from "next/server";
import { pool } from "@/utils/database"
import { Element } from "@/utils/utils"

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

    return NextResponse.json(res.rows[0]);
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

  var name = 'Untitled List'
  var elements: Element[] = []

  try {
    const body = await request.json();

    name = body.name ?? name;
    elements = body.elements ?? elements;
    console.log(name)
    console.log(elements)
    
  } catch (error) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const client = await pool.connect();

  try {

    await client.query('BEGIN');

    const insertListQuery = `INSERT INTO list (id, name, owner_id, privacy)
                             VALUES ($1, $2, $3, $4)
                             ON CONFLICT (id)
                             DO UPDATE SET
                             name = EXCLUDED.name,
                             privacy = EXCLUDED.privacy`;
    const insertListValues = [listId, name, session.data?.user.id, "private"];
    console.log(`i'm trying to access database`)
    const insertListRes = await client.query(insertListQuery, insertListValues);
    console.log(`the response was ${insertListRes}`)

    const deleteElementQuery = `DELETE FROM element
                                WHERE list_id = $1`;
    const deleteElementValues = [listId];
    const deleteElementRes = await client.query(deleteElementQuery, deleteElementValues);
    

    for (let element of elements) {
      const insertElementQuery = `INSERT INTO element (list_id, name, index)
                                  VALUES ($1, $2, $3)`;
      const insertElementValues = [listId, element.name, element.index]
      const insertElementRed = await client.query(insertElementQuery, insertElementValues);
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(`Database error: ${error.message}`);
    return NextResponse.json({ error: "Database Error:" }, { status: 500 });
  }
}

export async function DELETE(
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

  if (!session.data) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deleteListQuery = `DELETE FROM list
                             WHERE id = $1`;
    const deleteListValues = [listId];
    const insertListRes = await pool.query(deleteListQuery, deleteListValues);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Database error: ${error.message}`);
    return NextResponse.json({ error: "Database Error:" }, { status: 500 });
  }
}