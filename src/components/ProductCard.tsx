/* eslint-disable @next/next/no-img-element */

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
}

export default function ProductCard({ image, name, price }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-2">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <h3 className="text-sm font-medium text-black truncate">{name}</h3>
      <p className="text-sm font-bold text-black">Rs. {price}</p>
    </div>
  );
}
