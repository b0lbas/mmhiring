import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../../lib/prisma';
import { defaultHomePageContent, isHomePageContent } from '../../../../lib/site-content';
import { isValidJWT } from '../../../../lib/jwt-auth';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError
} from '@prisma/client/runtime/library';

// Prisma requires Node.js runtime (not Edge)
export const runtime = 'nodejs';

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

    // Common production issues on Vercel: missing migrations/table, invalid DATABASE_URL.
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2021') {
        return NextResponse.json(
          {
            error:
              'Database is not migrated (SiteContent table missing). Run `prisma migrate deploy` against your production database.'
          },
          { status: 500 }
        );
      }
    }

    if (error instanceof PrismaClientInitializationError) {
      return NextResponse.json(
        {
          error:
            'Database connection failed. Check that `DATABASE_URL` is set correctly in Vercel Environment Variables.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save content' },
      { status: 500 }
    );
  }
}
