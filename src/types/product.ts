export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "electronics" | "food" | "clothing" | "rent" | "transport";
  image: string;
  inStock: boolean;
  placeId: string;  // Added place ID field
}
