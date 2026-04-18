import { Wrench, Zap, Hammer, Armchair, Snowflake, Paintbrush, PenTool } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Plumbing" | "Electrical" | "Carpentry" | "General";
  serviceLink: string[]; // Services this product is relevant for
}

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Premium Chrome Tap Head",
    description: "High-quality, rust-resistant chrome finish tap head for kitchen and bathroom sinks.",
    price: 12500,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800",
    category: "Plumbing",
    serviceLink: ["Plumber"],
  },
  {
    id: "p2",
    name: "Modern Touch Switch (Single)",
    description: "Sleek glass-tempered touch switch with LED indicator. 220V standard.",
    price: 8500,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800",
    category: "Electrical",
    serviceLink: ["Electrician"],
  },
  {
    id: "p3",
    name: "Modern Touch Switch (Double)",
    description: "Dual-gang glass touch switch. Premium aesthetic for modern homes.",
    price: 14000,
    image: "https://images.unsplash.com/photo-1635048424329-a9bfb146d7aa?auto=format&fit=crop&q=80&w=800",
    category: "Electrical",
    serviceLink: ["Electrician"],
  },
  {
    id: "p4",
    name: "Flexible Sink Waste Pipe",
    description: "Expandable and flexible waste pipe for easy sink installations.",
    price: 4500,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800",
    category: "Plumbing",
    serviceLink: ["Plumber"],
  },
  {
    id: "p5",
    name: "Heavy-Duty Door Handle",
    description: "Brushed nickel finish door handle with secure locking mechanism.",
    price: 18500,
    image: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&q=80&w=800",
    category: "Carpentry",
    serviceLink: ["Carpenter", "Furniture Maker"],
  },
  {
    id: "p6",
    name: "LED Ceiling Spotlight",
    description: "Energy-efficient 12W warm white spotlight for recessed mounting.",
    price: 6500,
    image: "https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=800",
    category: "Electrical",
    serviceLink: ["Electrician", "General Handyman"],
  },
];
