export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "Plumbing" | "Electrical" | "Carpentry" | "General";
  serviceLink: string[];
  rating?: number;
  reviewCount?: number;
  badge?: "Best Seller" | "New" | "Hot Deal" | "Limited";
  stock?: number;
}

export const PRODUCTS: Product[] = [
  // ── Plumbing ──────────────────────────────────────────────
  {
    id: "p1",
    name: "Premium Chrome Tap Head",
    description: "High-quality, rust-resistant chrome finish tap head for kitchen and bathroom sinks.",
    price: 12500,
    image: "/products/tap-head.png",
    category: "Plumbing",
    serviceLink: ["Plumber"],
    rating: 4.8,
    reviewCount: 124,
    badge: "Best Seller",
    stock: 35,
  },
  {
    id: "p4",
    name: "Flexible Sink Waste Pipe",
    description: "Expandable and flexible waste pipe for easy sink installations. Universal fit.",
    price: 4500,
    image: "/products/waste-pipe.png",
    category: "Plumbing",
    serviceLink: ["Plumber"],
    rating: 4.5,
    reviewCount: 89,
    stock: 60,
  },
  {
    id: "p7",
    name: "Water Mixer Tap (Single Lever)",
    description: "Modern single-lever chrome mixer tap for kitchen. 360° swivel spout with ceramic cartridge.",
    price: 28000,
    image: "/products/water-mixer-tap.png",
    category: "Plumbing",
    serviceLink: ["Plumber"],
    rating: 4.9,
    reviewCount: 67,
    badge: "Hot Deal",
    stock: 18,
  },
  {
    id: "p8",
    name: "Chrome Rainfall Shower Head",
    description: "8-inch luxury rainfall shower head with adjustable arm. Easy install, anti-clog nozzles.",
    price: 22000,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800", // Chrome fixture
    category: "Plumbing",
    serviceLink: ["Plumber"],
    rating: 4.7,
    reviewCount: 53,
    badge: "New",
    stock: 25,
  },
  {
    id: "p9",
    name: "PVC Pipe Connector Set (6-Piece)",
    description: "Assorted PVC pipe connectors — elbows, tees, and couplings. Standard 1-inch fittings.",
    price: 3200,
    image: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=800", // Pipes
    category: "Plumbing",
    serviceLink: ["Plumber"],
    rating: 4.3,
    reviewCount: 41,
    stock: 100,
  },

  // ── Electrical ────────────────────────────────────────────
  {
    id: "p2",
    name: "Modern Touch Switch (Single)",
    description: "Sleek glass-tempered touch switch with LED indicator. 220V standard.",
    price: 8500,
    image: "/products/touch-switch-single.png",
    category: "Electrical",
    serviceLink: ["Electrician"],
    rating: 4.6,
    reviewCount: 98,
    stock: 45,
  },
  {
    id: "p3",
    name: "Modern Touch Switch (Double)",
    description: "Dual-gang glass touch switch. Premium aesthetic for modern homes.",
    price: 14000,
    image: "/products/touch-switch-double.png",
    category: "Electrical",
    serviceLink: ["Electrician"],
    rating: 4.7,
    reviewCount: 76,
    badge: "Best Seller",
    stock: 30,
  },
  {
    id: "p6",
    name: "LED Ceiling Spotlight",
    description: "Energy-efficient 12W warm white spotlight for recessed mounting.",
    price: 6500,
    image: "/products/led-spotlight.png",
    category: "Electrical",
    serviceLink: ["Electrician", "General Handyman"],
    rating: 4.4,
    reviewCount: 112,
    stock: 80,
  },
  {
    id: "p10",
    name: "Circuit Breaker (32A)",
    description: "Miniature circuit breaker for home distribution boards. DIN rail mount, 6kA breaking capacity.",
    price: 5500,
    image: "/products/circuit-breaker.png",
    category: "Electrical",
    serviceLink: ["Electrician"],
    rating: 4.8,
    reviewCount: 64,
    stock: 55,
  },
  {
    id: "p11",
    name: "4-Gang Extension Board",
    description: "Premium surge-protected extension board with individual switches and 2m cable. Fireproof casing.",
    price: 9800,
    image: "/products/extension-board.png",
    category: "Electrical",
    serviceLink: ["Electrician", "General Handyman"],
    rating: 4.6,
    reviewCount: 87,
    badge: "Hot Deal",
    stock: 40,
  },
  {
    id: "p12",
    name: "Smart WiFi Plug",
    description: "Control any appliance remotely via app. Compatible with Alexa & Google Home. Timer & schedule features.",
    price: 7500,
    image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80&w=800", // Plug
    category: "Electrical",
    serviceLink: ["Electrician"],
    rating: 4.5,
    reviewCount: 45,
    badge: "New",
    stock: 30,
  },
  {
    id: "p13",
    name: "LED Strip Light (5m, RGB)",
    description: "Flexible RGB LED strip with remote control. Self-adhesive, cuttable. Perfect for ambient lighting.",
    price: 11000,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800", // LEDs
    category: "Electrical",
    serviceLink: ["Electrician", "General Handyman"],
    rating: 4.3,
    reviewCount: 38,
    stock: 50,
  },

  // ── Carpentry ─────────────────────────────────────────────
  {
    id: "p5",
    name: "Heavy-Duty Door Handle",
    description: "Brushed nickel finish door handle with secure locking mechanism.",
    price: 18500,
    image: "/products/door-handle.png",
    category: "Carpentry",
    serviceLink: ["Carpenter", "Furniture Maker"],
    rating: 4.7,
    reviewCount: 56,
    stock: 22,
  },
  {
    id: "p14",
    name: "Soft-Close Cabinet Hinges (Pair)",
    description: "Heavy-duty stainless steel hinges with hydraulic soft-close. Universal 35mm cup bore.",
    price: 4200,
    image: "/products/cabinet-hinges.png", // Premium generated hinge image
    category: "Carpentry",
    serviceLink: ["Carpenter", "Furniture Maker"],
    rating: 4.4,
    reviewCount: 33,
    stock: 70,
  },
  {
    id: "p15",
    name: "Wood Screws Assorted Pack (200pc)",
    description: "High-tensile steel wood screws in assorted sizes. Phillips head, zinc-plated for corrosion resistance.",
    price: 3500,
    image: "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&q=80&w=800", // Screws
    category: "Carpentry",
    serviceLink: ["Carpenter", "Furniture Maker", "General Handyman"],
    rating: 4.6,
    reviewCount: 72,
    stock: 120,
  },
  {
    id: "p16",
    name: "Premium Door Lock Set",
    description: "Mortise door lock with 3 keys. Satin chrome finish. Suitable for wooden and metal doors.",
    price: 15000,
    image: "https://images.unsplash.com/photo-1555854817-105a308d3312?auto=format&fit=crop&q=80&w=800", // Door handle/lock set
    category: "Carpentry",
    serviceLink: ["Carpenter"],
    rating: 4.8,
    reviewCount: 91,
    badge: "Best Seller",
    stock: 28,
  },

  // ── General ───────────────────────────────────────────────
  {
    id: "p17",
    name: "Paint Roller Kit (9-inch)",
    description: "Professional paint roller with tray and 3 interchangeable covers: smooth, medium, and textured.",
    price: 8500,
    image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&q=80&w=800", // Paint Roller
    category: "General",
    serviceLink: ["Painter", "General Handyman"],
    rating: 4.5,
    reviewCount: 48,
    stock: 35,
  },
  {
    id: "p18",
    name: "Teflon Tape (Pack of 5)",
    description: "PTFE thread seal tape for leak-proof pipe connections. 12m per roll, professional grade.",
    price: 1500,
    image: "https://images.unsplash.com/photo-1584622781564-9d9254243547?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Plumbing tools
    category: "General",
    serviceLink: ["Plumber", "General Handyman"],
    rating: 4.2,
    reviewCount: 156,
    badge: "Hot Deal",
    stock: 200,
  },
];
