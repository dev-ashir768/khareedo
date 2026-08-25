import ProductCard from "./ProductCard";

const products = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  image: `/products/p${i + 1}.jpg`,
  name: "HP Laptop 15 FC0003AU",
  price: "149,999",
}));

export default function ProductGrid() {
  return (
    <section className="max-w-[1400px] mx-auto px-6 pb-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
}
