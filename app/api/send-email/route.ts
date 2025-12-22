import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'ishaq1abu2halawa2017@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'lqfzpvqbmrnxaxkq'
  }
});

export async function POST(req: Request) {
  try {
    const { companyName, email, request } = await req.json();

    if (!companyName || !email || !request) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'ishaq1abu2halawa2017@gmail.com',
      to: 'ishaq1abu2halawa2017@gmail.com',
      replyTo: email,
      subject: `Запрос от компании ${companyName}`,
      text: `
        Компания: ${companyName}
        Электронная почта: ${email}
        
        Запрос:
        ${request}
      `,
      html: `
        <p><strong>Компания:</strong> ${companyName}</p>
        <p><strong>Электронная почта:</strong> ${email}</p>
        <p><strong>Запрос:</strong></p>
        <p>${request.replace(/\n/g, '<br>')}</p>
      `
    };

    // Отправляем сообщение
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Ошибка отправки email:', error);
    return NextResponse.json(
      { error: 'Произошла ошибка при отправке сообщения' },
      { status: 500 }
    );
  }
}
