import { NextResponse } from "next/server";

const MOCK_PRODUCTS = [
  {
    id: 1,
    price: 3.50,
    price_b2b: 85.00,
    pack_b2b_en: "Box of 30 pcs",
    pack_b2b_tr: "30 adetlik kutu",
    image: "https://images.unsplash.com/photo-1555507036-ab1d4075c6f5?q=80&w=800&auto=format&fit=crop",
    title_en: "Croissant",
    title_tr: "Kruvasan",
    out_of_oven: true,
  },
  {
    id: 2,
    price: 2.00,
    price_b2b: 50.00,
    pack_b2b_en: "Box of 40 pcs",
    pack_b2b_tr: "40 adetlik kutu",
    image: "https://images.unsplash.com/photo-1627393437295-d1f5647568bd?q=80&w=800&auto=format&fit=crop",
    title_en: "Simit",
    title_tr: "Simit",
    out_of_oven: true,
  },
  {
    id: 3,
    price: 4.00,
    price_b2b: 90.00,
    pack_b2b_en: "Box of 25 pcs",
    pack_b2b_tr: "25 adetlik kutu",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop",
    title_en: "Frappe",
    title_tr: "Frappe",
    out_of_oven: false,
  },
  {
    id: 4,
    price: 5.00,
    price_b2b: 100.00,
    pack_b2b_en: "Tray of 2 kg",
    pack_b2b_tr: "2 kg tepsi",
    image: "https://images.unsplash.com/photo-1599824041132-fc20ba995b06?q=80&w=800&auto=format&fit=crop",
    title_en: "Baklava",
    title_tr: "Baklava",
    out_of_oven: false,
  },
  {
    id: 5,
    price: 4.50,
    price_b2b: 80.00,
    pack_b2b_en: "Tray of 20 pcs",
    pack_b2b_tr: "20 adetlik tepsi",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop",
    title_en: "Halloumi Pie",
    title_tr: "Hellim Böreği",
    out_of_oven: false,
  },
  {
    id: 6,
    price: 3.00,
    price_b2b: 70.00,
    pack_b2b_en: "Box of 50 pcs",
    pack_b2b_tr: "50 adetlik kutu",
    image: "https://images.unsplash.com/photo-1544378184-e918804961be?q=80&w=800&auto=format&fit=crop",
    title_en: "Cyprus Coffee",
    title_tr: "Kıbrıs Kahvesi",
    out_of_oven: false,
  },
];

export async function GET() {
  return NextResponse.json(MOCK_PRODUCTS);
}
