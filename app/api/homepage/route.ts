import { NextResponse } from "next/server";

const MOCK_PRODUCTS = [
  {
    id: 1,
    price: 3.50,
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop",
    title_en: "Croissant",
    title_tr: "Kruvasan",
    out_of_oven: true,
  },
  {
    id: 2,
    price: 2.00,
    image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=800&auto=format&fit=crop",
    title_en: "Simit",
    title_tr: "Simit",
    out_of_oven: true,
  },
  {
    id: 3,
    price: 4.00,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop",
    title_en: "Frappe",
    title_tr: "Frappe",
    out_of_oven: false,
  },
  {
    id: 4,
    price: 5.00,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=800&auto=format&fit=crop",
    title_en: "Baklava",
    title_tr: "Baklava",
    out_of_oven: false,
  },
  {
    id: 5,
    price: 4.50,
    image: "https://images.unsplash.com/photo-1601000938259-9e92002320b2?q=80&w=800&auto=format&fit=crop",
    title_en: "Halloumi Pie",
    title_tr: "Hellim Böreği",
    out_of_oven: false,
  },
  {
    id: 6,
    price: 3.00,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    title_en: "Cyprus Coffee",
    title_tr: "Kıbrıs Kahvesi",
    out_of_oven: false,
  },
];

export async function GET() {
  return NextResponse.json(MOCK_PRODUCTS);
}
