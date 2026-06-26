export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  fit: string;
  description: string;
  details: string[];
  image: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export const productsData: Product[] = [
  {
    id: "oc-01",
    name: "Cyber Culture Oversized Tee",
    price: 599,
    category: "graphic-tees",
    fit: "Oversized Fit (Drop Shoulder)",
    description: "Features high-density puff print subculture graphics on premium 240 GSM organic cotton.",
    details: ["100% Organic Heavyweight Cotton", "Drop-shoulder aesthetic", "Shrink-resistant double-stitch neck ribbon"],
    image: "/images/cyber-tee.jpg",
    isNew: true,
    isPopular: true
  },
  {
    id: "oc-02",
    name: "Minimalist Slate Boxy Tee",
    price: 599,
    category: "boxy-fits",
    fit: "Boxy Cropped Silhouette",
    description: "An ultra-clean structured boxy fit with slightly shorter body length, perfect for layering.",
    details: ["Structured 220 GSM combed yarn", "Clean seamless sleeves", "High rib mock neck collar"],
    image: "/images/slate-boxy.jpg",
    isPopular: true
  },
  {
    id: "oc-03",
    name: "Vintage Acid Wash Oversized Tee",
    price: 599,
    category: "oversized-tees",
    fit: "Signature Oversized Fit",
    description: "Individually washed heavy cotton tee offering a distressed vintage streetwear aesthetic.",
    details: ["Acid washed finish", "240 GSM premium terry cloth", "Wide ribbed collar"],
    image: "/images/vintage-wash.jpg",
    isNew: true
  },
  {
    id: "oc-04",
    name: "Urban Utility Cropped Shirt",
    price: 699,
    category: "cropped-shirts",
    fit: "Cropped Relaxed Cut",
    description: "Street-forward cropped utility button-down featuring dual cargo chest pockets and a structured hem.",
    details: ["Lightweight durable cotton twill", "Metal button snap closures", "Square-cut cropped hemline"],
    image: "/images/cropped-shirt.jpg",
    isNew: true,
    isPopular: true
  },
  {
    id: "oc-05",
    name: "Subculture Graphic Puff Tee",
    price: 599,
    category: "graphic-tees",
    fit: "Oversized Fit",
    description: "Bold typographic graphic print celebrating Jaipur's growing new-age streetwear culture.",
    details: ["Electric green puff graphics", "Breathable 200 GSM summer weight cotton", "Reinforced shoulders"],
    image: "/images/puff-tee.jpg"
  },
  {
    id: "oc-06",
    name: "Retro-Future Boxy Tee",
    price: 599,
    category: "boxy-fits",
    fit: "Boxy Fit",
    description: "Retro-themed typography on a stark black box-cut profile. Clean, bold, and high-energy.",
    details: ["Retro-futuristic screen-print front", "Thick 1.2 inch neck ribbing", "Wide sleeves"],
    image: "/images/retro-boxy.jpg"
  },
  {
    id: "oc-07",
    name: "Chrome Liquid Drop Tee",
    price: 649,
    category: "new-drops",
    fit: "Oversized Fit",
    description: "Limited drops with mirror-finish chrome print lettering. Stands out day or night.",
    details: ["Mirror-effect foil screenprint", "Heavyweight 240 GSM luxury cotton", "Exclusive drop sticker pack included"],
    image: "/images/chrome-tee.jpg",
    isNew: true
  },
  {
    id: "oc-08",
    name: "Mansarovar Everyday Street Cargos",
    price: 899,
    category: "casual-fits",
    fit: "Relaxed Straight-Leg Fit",
    description: "Premium streetwear utility pants with adjustable drawstrings at the ankle to transition from cargos to joggers.",
    details: ["Durable cotton ripstop weave", "Adjustable ankle cuffs", "6-pocket modular design"],
    image: "/images/cargos.jpg",
    isPopular: true
  }
];
