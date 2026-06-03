import { headers } from "next/headers";
import { authClient } from "@/utils/auth-client";
import { NextResponse } from "next/server";
import { pool } from "@/utils/database"
import { Element, ListInfo } from "@/utils/utils"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listId } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers() 
    }
  });

  const userId = session?.data?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {

    const listQuery = `SELECT l.*, COALESCE(json_agg(json_build_object('id', e.id, 'name', e.name)), '[]') as elements
                       FROM list l
                       LEFT JOIN element e ON l.id = e.list_id
                       WHERE l.id = $1
                       AND (l.privacy = 'public' OR l.owner_id = $2)
                       GROUP BY l.id`;
    const listValues = [listId, userId];
    const listRes = await pool.query<ListInfo>(listQuery, listValues);

    if (listRes.rowCount == 0) {
      return NextResponse.json({ error: "List not found" }, { status: 404 });
    }

    return NextResponse.json(listRes.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(
    request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: listId } = await params;

  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers() 
    }
  });

  if (!session.data) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  var name = 'Untitled List'
  var elements: Element[] = []

  try {
    const body = await request.json();

    name = body.name ?? name;
    elements = body.elements ?? elements;
    
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
    const insertListRes = await client.query(insertListQuery, insertListValues);

    const deleteElementQuery = `DELETE FROM element
                                WHERE list_id = $1`;
    const deleteElementValues = [listId];
    const deleteElementRes = await client.query(deleteElementQuery, deleteElementValues);
    

    for (let element of elements) {
      const insertElementQuery = `INSERT INTO element (list_id, name, id)
                                  VALUES ($1, $2, $3)`;
      const insertElementValues = [listId, element.name, element.id]
      const insertElementRed = await client.query(insertElementQuery, insertElementValues);
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(`Database error: ${error.message}`);
    return NextResponse.json({ error: "Database Error:" }, { status: 500 });
  } finally {
    client.release();
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