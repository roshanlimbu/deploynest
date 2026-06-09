import { router } from './routes';
import { db } from './db';

export { db };

const server = Bun.serve({
  port: 4000,
  async fetch(req) {
    const response = await router.handle(req);
    if (response) return response;

    return new Response("Not Found", { status: 404 });
  },
});
