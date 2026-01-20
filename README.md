docker compose up

npx prisma generate
npx prisma db push

npm run db:seed

## Email (contact form)

The contact form sends email via SMTP using environment variables.

- For local development (`npm run dev`): copy `.env.example` to `.env.local` and fill SMTP vars.
- For Docker Compose (`docker compose up`): create a `.env` file next to `docker-compose.yml` (or export env vars in your shell) so `${SMTP_*}` values are not blank.

- Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, optional `SMTP_FROM`, `CONTACT_EMAIL`.
- If you use Gmail (`smtp.gmail.com`): Google does not accept normal passwords for SMTP in most cases.
	Create a Google **App Password** (requires 2FA) and put it into `SMTP_PASSWORD` (paste it **without spaces**).
- For port `465` set `SMTP_SECURE=true`. For port `587` keep `SMTP_SECURE=false`.

Troubleshooting Gmail 535:

- Redeploy on Vercel after changing env vars.
- Try switching to implicit TLS:
	- `SMTP_PORT=465`
	- `SMTP_SECURE=true`
- Try forcing auth method:
	- `SMTP_AUTH_METHOD=LOGIN`
- If it still fails, Google may be blocking SMTP for the account/environment (check Google Account security alerts, or use another SMTP provider).
