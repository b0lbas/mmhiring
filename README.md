docker compose up

npx prisma generate
npx prisma migrate deploy

npm run db:seed

## Vercel deploy

- Make sure Vercel project has env vars:
	- `DATABASE_URL`
	- `ADMIN_PASSWORD`
	- `JWT_SECRET`
	- (optional) `SMTP_*` + `CONTACT_EMAIL` for the contact form
- If you want migrations applied automatically on deploy, set **Build Command** to `npm run vercel-build`.
	- Recommendation: use a separate DB for Preview deployments, or keep migrations out of Preview builds.

## Windows / PowerShell note

If you see an error like “`npm.ps1` cannot be loaded because it is not digitally signed”, it's a PowerShell execution policy restriction.

Options:

- Run commands via `cmd.exe` (or Git Bash), where `npm`/`npx` work normally.
- From PowerShell, use the `.cmd` shims:
	- `"C:\Program Files\nodejs\npm.cmd" run build`
	- `"C:\Program Files\nodejs\npx.cmd" prisma generate`
- Or (recommended) relax policy for current user:
	- `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

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
