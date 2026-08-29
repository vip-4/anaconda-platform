import { NextRequest, NextResponse } from 'next/server';
import { getSql } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { action, email, password, name } = await req.json();
    const sql = getSql();

    switch (action) {
      case 'register': {
        const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
        if ((existing as any[]).length > 0) {
          return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
        }

        const passwordHash = await hashPassword(password);
        const result = await sql`
          INSERT INTO users (email, password_hash, name)
          VALUES (${email}, ${passwordHash}, ${name})
          RETURNING id, email, name
        `;
        const user = (result as any[])[0];
        const sessionToken = generateSessionToken();

        await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${sessionToken}, ${user.id}, NOW() + INTERVAL '7 days')`;

        const response = NextResponse.json({ user, sessionToken });
        response.cookies.set('session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7
        });
        return response;
      }

      case 'login': {
        const result = await sql`SELECT id, email, name, password_hash FROM users WHERE email = ${email}`;
        const users = result as any[];
        if (users.length === 0) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = users[0];
        const valid = await verifyPassword(password, user.password_hash);
        if (!valid) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const sessionToken = generateSessionToken();
        await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${sessionToken}, ${user.id}, NOW() + INTERVAL '7 days')`;

        const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
        response.cookies.set('session', sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7
        });
        return response;
      }

      case 'logout': {
        const sessionToken = req.cookies.get('session')?.value;
        if (sessionToken) {
          await sql`DELETE FROM sessions WHERE token = ${sessionToken}`;
        }
        const response = NextResponse.json({ success: true });
        response.cookies.delete('session');
        return response;
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function generateSessionToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}