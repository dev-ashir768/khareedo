export type Product = {
  id: string;
  acno: string;
  product_name: string;
  price: string;
  image: string;
};

export type ProductDetail = {
  id: string;
  acno: string;
  business_name: string;
  product_name: string;
  on_sale: string;
  default_price: string;
  default_sale_price: string;
  default_image: string;
  description: string;
  customer_delivery_ratio: number;
  product_delivery_ratio: number;
  images: { url: string; alt: string }[];
  attributes: { name: string; options: string[] }[];
  variations: {
    variation_id: string;
    price: string;
    sale_price: string;
    variation_image: string;
    attribute_values: string;
    combination: Record<string, string>;
  }[];
};

export type CartItem = {
  id: string;
  acno: string;
  product_name: string;
  price: number;
  image: string;
  quantity: number;
  variation_id?: string;
  selectedAttributes?: Record<string, string>;
};
