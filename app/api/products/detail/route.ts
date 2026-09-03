const API_URL = "https://oms.getorio.com/api/marketplace/productdetail";
const IMAGE_BASE = "https://oms.getorio.com/uploads";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.MARKETPLACE_API_TOKEN
        ? { Authorization: `Bearer ${process.env.MARKETPLACE_API_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({
      product_id: body.product_id,
      acno: body.acno,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  }

  const data = await res.json();
  const p = data.payload;

  function resolveImage(img: string, acno: string) {
    if (!img || img === "none") return "";
    if (img.startsWith("http")) return img;
    return `${IMAGE_BASE}/${acno}/${img}`;
  }

  const images = (p.images || []).map((img: { url: string; alt: string }) => ({
    url: img.url.startsWith("http") ? img.url : resolveImage(img.url, p.acno),
    alt: img.alt || "",
  }));

  if (images.length === 0 && p.default_image) {
    images.push({
      url: resolveImage(p.default_image, p.acno),
      alt: p.product_name || "",
    });
  }

  return Response.json({
    ...p,
    default_image: resolveImage(p.default_image, p.acno),
    images,
    variations: (p.variations || []).map((v: Record<string, unknown>) => ({
      ...v,
      variation_image: resolveImage(v.variation_image as string, p.acno),
    })),
  });
}
