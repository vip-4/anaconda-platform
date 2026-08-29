import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const result = await sql`
      SELECT n.id, n.title, n.kernel, n.updated_at, p.name as project_name
      FROM notebooks n
      JOIN projects p ON n.project_id = p.id
      ORDER BY n.updated_at DESC
      LIMIT 20
    `;
    return NextResponse.json((result as any[]) || []);
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, project_id, kernel } = await req.json();
    const sql = getSql();

    const result = await sql`
      INSERT INTO notebooks (title, project_id, kernel)
      VALUES (${title || 'Untitled Notebook'}, ${project_id}, ${kernel || 'python3'})
      RETURNING id, title, kernel, updated_at
    `;

    return NextResponse.json((result as any[])[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}