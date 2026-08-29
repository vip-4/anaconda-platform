import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const result = await sql`
      SELECT id, name, params, metrics, status, created_at
      FROM experiments
      ORDER BY created_at DESC
      LIMIT 20
    `;
    return NextResponse.json((result as any[]) || []);
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, project_id, params } = await req.json();
    const sql = getSql();

    const result = await sql`
      INSERT INTO experiments (name, project_id, params)
      VALUES (${name}, ${project_id}, ${JSON.stringify(params || {})})
      RETURNING id, name, params, status, created_at
    `;

    return NextResponse.json((result as any[])[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}