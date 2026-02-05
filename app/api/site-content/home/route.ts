import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../../lib/prisma';
import { defaultHomePageContent, isHomePageContent } from '../../../../lib/site-content';
import { isValidJWT } from '../../../../lib/jwt-auth';

const HOME_KEY = 'home';

export async function GET() {
  try {
    const row = await prisma.siteContent.findUnique({
      where: { key: HOME_KEY }
    });

    if (!row) {
      return NextResponse.json(defaultHomePageContent);
    }

    // If DB contains unexpected shape, fall back to defaults.
    const data = row.data as unknown;
    if (!isHomePageContent(data)) {
      return NextResponse.json(defaultHomePageContent);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to load home page content:', error);
    return NextResponse.json(defaultHomePageContent);
  }
}

export async function PUT(req: Request) {
  try {
    const sessionToken = cookies().get('admin_session')?.value;
    if (!sessionToken || !(await isValidJWT(sessionToken))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    if (!isHomePageContent(body)) {
      return NextResponse.json(
        { error: 'Invalid payload' },
        { status: 400 }
      );
    }

    await prisma.siteContent.upsert({
      where: { key: HOME_KEY },
      create: { key: HOME_KEY, data: body },
      update: { data: body }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save home page content:', error);
    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}
