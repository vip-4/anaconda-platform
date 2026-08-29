import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const result = await sql`
      SELECT id, name, version, metrics, status, created_at
      FROM model_registry
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
    const { name, version, artifact_path, metrics } = await req.json();
    const sql = getSql();

    const result = await sql`
      INSERT INTO model_registry (name, version, artifact_path, metrics)
      VALUES (${name}, ${version}, ${artifact_path}, ${JSON.stringify(metrics || {})})
      RETURNING id, name, version, metrics, status, created_at
    `;

    return NextResponse.json((result as any[])[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}