export interface ProductVariantGroup {
  id: string;
  name: string;
  options: { id: string; label: string; image?: string }[];
}

export interface UpsellItem {
  id: string;
  name: string;
  price: number; // in euros for simplicity
  originalPrice?: number;
  image: string;
}

export interface Product {
  slug: string;
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  media: { type: 'image' | 'video'; src: string; poster?: string }[];
  basePrice: number;
  reviewCount: number;
  rating: number; // 0-5
  variantGroups: ProductVariantGroup[];
  upsells: UpsellItem[];
  thresholds: { amount: number; label: string }[];
}

export const products: Product[] = [
  {
    slug: 'pro-moto-holder',
    id: 'prod_1',
    title: 'Professional motorcycle phone holder with metal plate',
    subtitle: 'Magnetic system with screwed fixing for motorcycle handlebars, steel plate included.',
    media: [
      { type: 'video', src: '/v2.mp4', poster: '/head.png' },
      { type: 'image', src: '/p1.png' },
      { type: 'image', src: '/p2.png' },
      { type: 'image', src: '/p3.png' }
    ],
    basePrice: 39.95,
    reviewCount: 3769,
    rating: 5,
    variantGroups: [
      {
        id: 'adapter',
        name: 'Select your phone adapter:',
        options: [
          { id: 'adapter_iphone', label: 'iPhone MagSafe', image: '/p1.png' },
          { id: 'adapter_sleeve_xl', label: 'Sleeve XL', image: '/p2.png' },
          { id: 'adapter_sleeve_2xl', label: 'Sleeve 2XL', image: '/p3.png' }
        ]
      },
      {
        id: 'support',
        name: 'Select your support:',
        options: [
          { id: 'support_moto', label: 'MOTO', image: '/b1.webp' },
          { id: 'support_bike_pro', label: 'BIKE PRO', image: '/IMG_8007.webp' },
          { id: 'support_moto_boost', label: 'MOTO PRO BOOST', image: '/IMG_7742-2.webp' }
        ]
      }
    ],
    upsells: [
      { id: 'upsell_anti_vibe', name: 'ANTI-VIBRATIONS', price: 7.47, originalPrice: 14.95, image: '/b1.webp' },
      { id: 'upsell_steel_plate', name: 'ADHESIVE STEEL PLATE', price: 4.97, originalPrice: 9.95, image: '/p2.png' },
      { id: 'upsell_phone_leash', name: 'PHONE LEASH', price: 4.97, originalPrice: 9.95, image: '/p3.png' }
    ],
    thresholds: [
      { amount: 30, label: '1 accessory at -50%' },
      { amount: 49, label: 'Free delivery' },
      { amount: 70, label: '5€ offered' }
    ]
  }
  ,{
    slug: 'bike-phone-mount',
    id: 'prod_2',
    title: 'Bike phone mount (with steel plate)',
    subtitle: 'Magnetic system with elastic silicone fixation, metal plate included.',
    media: [
      { type: 'image', src: '/p2.png' },
      { type: 'image', src: '/p1.png' },
      { type: 'image', src: '/p3.png' }
    ],
    basePrice: 29.95,
    reviewCount: 3315,
    rating: 5,
    variantGroups: [
      { id: 'adapter', name: 'Select your phone adapter:', options: [
        { id: 'adapter_iphone', label: 'iPhone MagSafe', image: '/p1.png' },
        { id: 'adapter_sleeve_xl', label: 'Sleeve XL', image: '/p2.png' }
      ]},
      { id: 'support', name: 'Select your support:', options: [
        { id: 'support_bike_pro', label: 'BIKE PRO', image: '/IMG_8007.webp' }
      ]}
    ],
    upsells: [
      { id: 'upsell_steel_plate_bike', name: 'ADHESIVE STEEL PLATE', price: 4.97, originalPrice: 9.95, image: '/p2.png' },
      { id: 'upsell_phone_leash_bike', name: 'PHONE LEASH', price: 4.97, originalPrice: 9.95, image: '/p3.png' }
    ],
    thresholds: [
      { amount: 30, label: '1 accessory at -50%' },
      { amount: 49, label: 'Free delivery' },
      { amount: 70, label: '5€ offered' }
    ]
  }
  ,{
    slug: 'pro-boost-moto-holder',
    id: 'prod_3',
    title: 'PRO BOOST motorcycle phone holder with metal plate',
    subtitle: 'Magnetic system with screwed handlebar attachment and 360° arm, metal plate included.',
    media: [
      { type: 'image', src: '/p3.png' },
      { type: 'image', src: '/p1.png' },
      { type: 'image', src: '/p2.png' }
    ],
    basePrice: 49.95,
    reviewCount: 3235,
    rating: 5,
    variantGroups: [
      { id: 'adapter', name: 'Select your phone adapter:', options: [
        { id: 'adapter_iphone', label: 'iPhone MagSafe', image: '/p1.png' },
        { id: 'adapter_sleeve_xl', label: 'Sleeve XL', image: '/p2.png' },
        { id: 'adapter_sleeve_2xl', label: 'Sleeve 2XL', image: '/p3.png' }
      ]},
      { id: 'support', name: 'Select your support:', options: [
        { id: 'support_moto_boost', label: 'MOTO PRO BOOST', image: '/IMG_7742-2.webp' }
      ]}
    ],
    upsells: [
      { id: 'upsell_anti_vibe_boost', name: 'ANTI-VIBRATIONS', price: 7.47, originalPrice: 14.95, image: '/b1.webp' },
      { id: 'upsell_phone_leash_boost', name: 'PHONE LEASH', price: 4.97, originalPrice: 9.95, image: '/p3.png' }
    ],
    thresholds: [
      { amount: 40, label: '1 accessory at -50%' },
      { amount: 60, label: 'Free delivery' },
      { amount: 80, label: '5€ offered' }
    ]
  }
  ,{
    slug: 'magsafe-desk-stand',
    id: 'prod_4',
    title: 'MagSafe Desk Stand – Adjustable Magnetic Phone Mount',
    subtitle: 'Clean, stable and adjustable MagSafe desk stand for calls, content and charging.',
    media: [
      { type: 'image', src: '/a3.png' }, // main hero image
      { type: 'image', src: '/a1.png' },
  { type: 'image', src: '/a2.png' },
  { type: 'image', src: '/a4.png' }
    ],
    basePrice: 34.95,
    reviewCount: 128,
    rating: 5,
    variantGroups: [
      { id: 'color', name: 'Choose color:', options: [
        { id: 'black', label: 'Matte Black', image: '/a3.png' },
        { id: 'silver', label: 'Space Silver', image: '/a2.png' }
      ]}
    ],
    upsells: [
      { id: 'upsell_cable_usb_c', name: 'USB‑C braided cable', price: 7.95, originalPrice: 12.95, image: '/p2.png' },
      { id: 'upsell_wall_adapter', name: '20W wall adapter', price: 9.95, originalPrice: 14.95, image: '/p3.png' }
    ],
    thresholds: [
      { amount: 35, label: '1 accessory -50%' },
      { amount: 49, label: 'Free delivery' },
      { amount: 65, label: '5€ offered' }
    ]
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}
