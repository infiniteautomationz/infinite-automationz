import { cookies } from 'next/headers';

type SessionPayload = { userId: string; role: string; exp: number };

const encodeSession = (payload: SessionPayload) =>
    Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');

const decodeSession = (token: string): SessionPayload | null => {
    try {
        const parsed = JSON.parse(Buffer.from(token, 'base64url').toString('utf8')) as SessionPayload;
        if (!parsed?.userId || !parsed?.role || !parsed?.exp) return null;
        if (Date.now() > parsed.exp) return null;
        return parsed;
    } catch {
        return null;
    }
};

export async function setSessionToken(userId: string, role: string) {
    const token = encodeSession({
        userId,
        role,
        exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    });

    const cookieStore = await cookies();
    cookieStore.set({
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        sameSite: 'lax',
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return null;

    const session = decodeSession(token);
    if (!session) return null;
    return { userId: session.userId, role: session.role };
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
}
