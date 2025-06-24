import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { COOKIE_NAME, verifyPassword } from "../../../../lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password, a, b, captcha } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "用户名和密码必填" }, { status: 400 });
    }
    if (Number(captcha) !== Number(a) + Number(b)) {
      return NextResponse.json({ error: "验证码错误" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: username } });
    if (!user || !(await verifyPassword(password, (user as any).passwordHash))) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, user.id, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
    return res;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
} 