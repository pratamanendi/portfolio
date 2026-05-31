import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  const limit = 6;
  const totalPages = Math.ceil(sorted.length / limit);

  return Array.from({ length: totalPages }, (_, i) => ({
    params: { page: String(i + 1) },
    props: { totalPages, total: sorted.length },
  }));
}

export const GET: APIRoute = async ({ params, props }) => {
  const posts = await getCollection("blog");
  const sorted = posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  const limit = 6;
  const page = parseInt(params.page!);
  const start = (page - 1) * limit;
  const paginated = sorted.slice(start, start + limit);

  return new Response(
    JSON.stringify({
      posts: paginated.map((p) => ({
        id: p.id,
        title: p.data.title,
        description: p.data.description,
        pubDate: p.data.pubDate.toISOString().slice(0, 10),
      })),
      page,
      totalPages: props.totalPages,
      total: props.total,
      hasMore: page < props.totalPages,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
};
