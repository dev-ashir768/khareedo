import ProductDetailWrapper from "@/features/products/product-detail-wrapper";

interface PageProps {
  params: Promise<{ id: string; acno: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id, acno } = await params;

  try {
    const response = await fetch(
      "https://oms.getorio.com/api/marketplace/productdetail",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MARKETPLACE_API_TOKEN}`,
        },
        body: JSON.stringify({ acno, product_id: Number(id) }),
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) throw new Error();
    const data = await response.json();

    return {
      title: data?.payload?.product_name || "Product Detail",
    };
  } catch {
    return { title: "Product Detail" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id, acno } = await params;
  return <ProductDetailWrapper productId={Number(id)} acno={acno} />;
}
