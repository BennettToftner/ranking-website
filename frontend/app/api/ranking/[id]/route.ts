import { headers } from "next/headers";
import { authClient } from "@/utils/auth-client";
import { NextResponse } from "next/server";
import { pool } from "@/utils/database";
import { RankingInfo } from "@/utils/utils";

export async function GET (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: rankingId } = await params;

    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    const userId = session?.data?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    try {

        const rankingQuery = `SELECT *
                              FROM RANKING
                              WHERE id = $1
                              AND (l.privacy = 'public' OR l.owner_id = $2)`;
        const rankingValues = [rankingId, userId];
        const listRes = await pool.query<RankingInfo>(rankingQuery, rankingValues);

        if (listRes.rowCount == 0) {
            return NextResponse.json({ error: "List not found" }, { status: 404 });
        }

        return NextResponse.json(listRes.rows[0]);

    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: rankingId } = await params;

    const session = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    const userId = session?.data?.user?.id;
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    var listId = '';
    var name = 'Untitled Ranking';
    var privacy = "private";
    var rankData = '{}'

    try {
        const body = await request.json();

        listId = body.listId ?? listId;
        name = body.name ?? name;
        privacy = body.privacy ?? privacy;
        rankData = body.rank_data ?? rankData;

    } catch (error) {
        return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }

    try {

        const rankingQuery = `INSERT INTO ranking (id, list_id, owner_id, name, privacy, rank_data)
                              VALUES ($1, $2, $3, $4, $5, $6)
                              ON CONFLICT (id)
                              DO UPDATE SET
                              name = EXCLUDED.name
                              privacy = EXCLUDED.privacy
                              rank_data = EXCLUDED.rank_data
                              WHERE ranking.owner_id = $3`;
        const rankingValues = [rankingId, listId, userId, name, privacy, rankData];
        const listRes = await pool.query<RankingInfo>(rankingQuery, rankingValues);

        if (listRes.rowCount == 0) {
            return NextResponse.json({ error: "List not found" }, { status: 404 });
        }

        return NextResponse.json(listRes.rows[0]);

    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}