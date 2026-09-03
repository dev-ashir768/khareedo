const API_URL = "https://oms.getorio.com/api/marketplace/getproducts";
const IMAGE_BASE = "https://oms.getorio.com/uploads";

export async function POST(request: Request) {
  const body = await request.json();
  const limit = body.limit ?? 10;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.MARKETPLACE_API_TOKEN
        ? { Authorization: `Bearer ${process.env.MARKETPLACE_API_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({
      limit,
      offset: body.offset ?? 0,
      search: body.search ?? "",
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  }

  const data = await res.json();
  const raw = Array.isArray(data.payload) ? data.payload : [];

  const products = raw.map(
    (p: { id: string; acno: string; product_name: string; price: string; image: string }) => ({
      id: p.id,
      acno: p.acno,
      product_name: p.product_name,
      price: p.price,
      image: p.image.startsWith("http")
        ? p.image
        : `${IMAGE_BASE}/${p.acno}/${p.image}`,
    }),
  );

  return Response.json({
    products,
    hasMore: raw.length >= limit,
  });
}
