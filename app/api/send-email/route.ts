import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function parseBoolean(value: string | undefined): boolean | undefined {
  if (value == null) return undefined;
  const normalized = value.trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(normalized)) return false;
  return undefined;
}

function createTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number.parseInt(process.env.SMTP_PORT || '587', 10);
  const secureFromEnv = parseBoolean(process.env.SMTP_SECURE);
  const secure = secureFromEnv ?? port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
}

function formatSmtpError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  // Gmail commonly rejects basic username/password logins; App Password is required.
  if (/^Invalid login: 535\b/.test(message) || /535-5\.7\.8/.test(message)) {
    if ((process.env.SMTP_HOST || '').includes('gmail') || (process.env.SMTP_HOST || '') === 'smtp.gmail.com') {
      return 'Gmail rejected the login (535). Use a Google App Password (not your normal password) or configure a different SMTP provider.';
    }
    return 'SMTP rejected the login (535). Check SMTP username/password and provider requirements.';
  }
  return message;
}

export async function POST(req: Request) {
  try {
    const { companyName, email, request } = await req.json();

    if (!companyName || !email || !request) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Проверяем наличие SMTP настроек
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: email,
      subject: `Request from company ${companyName}`,
      text: `
        Company: ${companyName}
        Email: ${email}
        
        Request:
        ${request}
      `,
      html: `
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Request:</strong></p>
        <p>${request.replace(/\n/g, '<br>')}</p>
      `
    };

    // Отправляем сообщение
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: formatSmtpError(error) || 'An error occurred while sending the message' },
      { status: 500 }
    );
  }
}
