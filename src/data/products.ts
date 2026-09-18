export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection: string;
  drop: string;
  fit: string;
  description: string;
  details: string[];
  fabric: string;
  gsm: string;
  care: string;
  image: string;
  sizes?: string[];
  isNew?: boolean;
  isPopular?: boolean;
  featured?: boolean;
}

export const productsData: Product[] = [
  {
    id: "kpd-01",
    name: "KAPDOLOGY® Drop 001 Graphic Tee",
    slug: "kapdology-drop-001-graphic-tee",
    price: 1299,
    compareAtPrice: 1599,
    category: "OVERSIZED T-SHIRTS",
    collection: "IDENTITY",
    drop: "DROP 001",
    fit: "Heavy / Structured Oversized Fit",
    description: "Kapdology Drop 001 signature graphic oversized tee. Graphic-driven DTF printing on luxury organic cotton canvas.",
    details: [
      "240 GSM 100% Organic Heavyweight Cotton",
      "Graphic-Driven DTF Artwork Front & Back",
      "Drop-Shoulder Streetwear Cut",
      "Shrink-Resistant Double-Stitch Neck Rib"
    ],
    fabric: "100% Organic Cotton",
    gsm: "240 GSM",
    care: "Machine wash cold inside out, iron on reverse",
    image: "/images/cyber-tee.jpg",
    isNew: true,
    isPopular: true,
    featured: true
  },
  {
    id: "kpd-02",
    name: "KAPDOLOGY® Minimal Boxy Tee",
    slug: "kapdology-minimal-boxy-tee",
    price: 1199,
    category: "OVERSIZED T-SHIRTS",
    collection: "MINIMAL",
    drop: "DROP 001",
    fit: "Structured Boxy Fit",
    description: "Pure minimal streetwear silhouette featuring high rib mock collar and clean box drape.",
    details: [
      "220 GSM Combed Cotton Canvas",
      "High Rib Mock Collar",
      "Structured Boxy Silhouette",
      "KAPDOLOGY Minimal Stencil Tagging"
    ],
    fabric: "100% Combed Cotton",
    gsm: "220 GSM",
    care: "Machine wash cold, lay flat to dry",
    image: "/images/slate-boxy.jpg",
    isPopular: true,
    featured: true
  },
  {
    id: "kpd-03",
    name: "KAPDOLOGY® Distressed Wash Tee",
    slug: "kapdology-distressed-wash-tee",
    price: 1399,
    category: "OVERSIZED T-SHIRTS",
    collection: "CHAOS",
    drop: "DROP 001",
    fit: "Signature Oversized Silhouette",
    description: "Individually washed heavy cotton tee offering a distressed vintage streetwear aesthetic.",
    details: [
      "240 GSM Heavyweight Terry Cotton",
      "Custom Vintage Acid Wash Finish",
      "Distressed Edge Detailing",
      "Wide Ribbed Collar"
    ],
    fabric: "100% Heavy Terry Cotton",
    gsm: "240 GSM",
    care: "Wash cold separately, line dry in shade",
    image: "/images/vintage-wash.jpg",
    isNew: true
  },
  {
    id: "kpd-04",
    name: "KAPDOLOGY® Utility Cropped Shirt",
    slug: "kapdology-utility-cropped-shirt",
    price: 1499,
    category: "OVERSIZED T-SHIRTS",
    collection: "TECHNICAL",
    drop: "DROP 001",
    fit: "Cropped Relaxed Cut",
    description: "Technical streetwear utility button-down featuring dual cargo chest pockets and square hemline.",
    details: [
      "200 GSM Durable Cotton Twill",
      "Metal Button Snap Closures",
      "Square-Cut Cropped Hemline",
      "Dual Chest Utility Pockets"
    ],
    fabric: "100% Cotton Twill",
    gsm: "200 GSM",
    care: "Machine wash cold with like colors",
    image: "/images/cropped-shirt.jpg",
    isNew: true,
    isPopular: true
  },
  {
    id: "kpd-05",
    name: "KAPDOLOGY® Subculture Graphic Tee",
    slug: "kapdology-subculture-graphic-tee",
    price: 1299,
    category: "OVERSIZED T-SHIRTS",
    collection: "IDENTITY",
    drop: "DROP 001",
    fit: "Oversized Fit",
    description: "Bold typographic graphic print celebrating identity, attitude, and clothing culture.",
    details: [
      "220 GSM Organic Cotton",
      "High-Density Screenprint Front",
      "Breathable Summer-Weight Drape",
      "Reinforced Shoulder Taping"
    ],
    fabric: "100% Organic Cotton",
    gsm: "220 GSM",
    care: "Machine wash cold inside out",
    image: "/images/puff-tee.jpg"
  },
  {
    id: "kpd-06",
    name: "KAPDOLOGY® Retro Graphic Tee",
    slug: "kapdology-retro-graphic-tee",
    price: 1299,
    category: "OVERSIZED T-SHIRTS",
    collection: "CHAOS",
    drop: "DROP 001",
    fit: "Boxy Oversized Fit",
    description: "Futuristic typographic graphic profile on stark black box-cut profile.",
    details: [
      "220 GSM Combed Cotton",
      "Futuristic Typography Print",
      "1.2 Inch Thick Neck Ribbing",
      "Wide Sleeve Opening"
    ],
    fabric: "100% Combed Cotton",
    gsm: "220 GSM",
    care: "Machine wash cold, do not bleach",
    image: "/images/retro-boxy.jpg"
  },
  {
    id: "kpd-07",
    name: "KAPDOLOGY® Liquid Chrome Graphic Tee",
    slug: "kapdology-liquid-chrome-graphic-tee",
    price: 1499,
    compareAtPrice: 1799,
    category: "OVERSIZED T-SHIRTS",
    collection: "RESTRICTED",
    drop: "DROP 001",
    fit: "Signature Oversized Fit",
    description: "Limited drop featuring liquid chrome mirror-finish KAPDOLOGY graphic artwork.",
    details: [
      "240 GSM Luxury Heavy Cotton",
      "Mirror-Effect Chrome Foil Print",
      "Limited Drop Edition",
      "KAPDOLOGY Drop Certificate Included"
    ],
    fabric: "100% Heavy Luxury Cotton",
    gsm: "240 GSM",
    care: "Hand wash cold inside out, lay flat to dry",
    image: "/images/chrome-tee.jpg",
    isNew: true,
    featured: true
  }
];
