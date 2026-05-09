# Inkwell Frontend Web

React/Vite frontend for the Inkwell blogging platform. This app provides the public blog experience, reader account pages, author studio, and admin console. It talks to the backend through the API Gateway.

## Tech Stack

- React 18
- Vite 5
- React Router
- Axios
- Tailwind CSS
- Lucide React icons
- React Quill editor
- Vitest and Testing Library
- Nginx for production Docker serving

## Main Features

- Public home, post detail, category, tag, author, search, login, register, forgot password, newsletter, and OAuth success pages
- Reader pages for profile, notifications, bookmarks, and reading history
- Author dashboard for posts, editor, media, comments, analytics, and followers
- Admin dashboard for users, posts, categories, comments, author requests, feedback, newsletter, notifications, and audit logs
- JWT-based authenticated API requests
- Same-origin production API proxy through Nginx

## Project Structure

```text
frontend-web/
  public/                  Static public assets
  src/
    api/                   Axios API client
    components/            Shared layout, dashboard, forms, and UI components
    context/               Auth, notification, and theme context providers
    pages/                 Public, reader, author, and admin pages
    styles/                Component-specific CSS
    __tests__/             Unit and integration tests
    App.jsx                Route definitions
    main.jsx               React app entrypoint
    index.css              Global Tailwind styles
  Dockerfile               Production image build
  nginx.conf               Production Nginx config
  vite.config.js           Vite and Vitest config
  package.json             Scripts and dependencies
```

## Prerequisites

- Node.js 22 recommended
- npm
- Backend/API Gateway running locally or through Docker Compose

## Environment Variables

Create a local `.env` file if needed:

```env
VITE_API_BASE_URL=http://localhost:8080
```

For production Docker deployment, this project usually uses:

```env
VITE_API_BASE_URL=/
```

With `VITE_API_BASE_URL=/`, browser requests go to the same origin and Nginx forwards `/api`, `/oauth2`, and `/login` routes to `api-gateway:8080`.

## Local Development

Install dependencies:

```bash
npm ci
```

Start the dev server:

```bash
npm run dev
```

The app runs on:

```text
http://localhost:5173
```

If the backend is running on `localhost:8080`, keep:

```env
VITE_API_BASE_URL=http://localhost:8080
```

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the production static files into `dist/`.

```bash
npm run preview
```

Serves the production build locally for preview.

```bash
npm test
```

Runs Vitest in watch mode.

```bash
npm run test:coverage
```

Runs tests once and generates coverage output.

For CI/Jenkins, the pipeline uses:

```bash
npm ci
npm exec vitest run
```

## API Client

The Axios client is configured in:

```text
src/api/client.js
```

It reads:

```text
import.meta.env.VITE_API_BASE_URL
```

If no value is provided, it defaults to:

```text
http://localhost:8080
```

The client automatically attaches the JWT access token from local storage for protected requests:

```text
inkwell.accessToken
```

On unauthorized protected requests, it clears stale auth data and redirects the user to `/login`.

## Routing

Routes are defined in:

```text
src/App.jsx
```

Public routes are available without login. Reader, author, and admin routes are guarded with `ProtectedRoute` and role checks.

Role groups:

- `READER`
- `AUTHOR`
- `ADMIN`

## Production Build

Build locally:

```bash
npm run build
```

Preview locally:

```bash
npm run preview
```

## Docker

Build the Docker image:

```bash
docker build --build-arg VITE_API_BASE_URL=/ -t yourdockeruser/inkwell/frontend-web:latest .
```

Run it:

```bash
docker run --rm -p 80:80 yourdockeruser/inkwell/frontend-web:latest
```

The production container:

- Builds the Vite app with Node
- Serves static files with Nginx
- Exposes port `80`
- Provides `/health`
- Proxies `/api`, `/oauth2`, and `/login` to `api-gateway:8080`

## EC2 And Jenkins Deployment

This frontend is deployed as part of the root `docker-compose.prod.yml` stack.

The root `Jenkinsfile`:

1. Runs backend tests
2. Installs frontend dependencies
3. Runs frontend tests
4. Builds the frontend Docker image
5. Pushes it to Docker Hub or another registry
6. SSHes into EC2
7. Runs Docker Compose to update the stack

Important Jenkins parameter:

```text
VITE_API_BASE_URL=http://51.21.94.139.nip.io:8080
```

Important EC2 `.env` values:

```env
FRONTEND_URL=http://51.21.94.139.nip.io
PUBLIC_GATEWAY_URL=http://51.21.94.139.nip.io:8080
VITE_API_BASE_URL=http://51.21.94.139.nip.io:8080
```

Open the deployed frontend at:

```text
http://51.21.94.139.nip.io
```

## Troubleshooting

If frontend pages load but API calls fail:

- Check `VITE_API_BASE_URL`
- Check `frontend-web/nginx.conf`
- Check `api-gateway` container health
- Check browser Network tab for `/api/...` requests

If protected pages redirect to login:

- Confirm login returns tokens
- Check local storage for `inkwell.accessToken`
- Check backend JWT secret and gateway auth behavior

If Docker deployment works but local dev fails:

- Use `VITE_API_BASE_URL=http://localhost:8080` locally
- Make sure API Gateway is running on port `8080`

If React routes show 404 in production:

- Confirm Nginx has `try_files $uri $uri/ /index.html;`
- Rebuild and redeploy the frontend image

## Security Notes

- Do not commit `.env` files with real URLs or secrets.
- Do not store JWT secrets, OAuth secrets, SMTP passwords, or private keys in the frontend.
- Only `VITE_` variables are exposed to browser code.
- Keep production secrets in the backend/EC2 environment only.
