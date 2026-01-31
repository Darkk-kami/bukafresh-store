// Product images
import chickenBreastImg from '@/assets/products/chicken-breast.jpg';
import catfishImg from '@/assets/products/catfish.jpg';
import beefSuyaImg from '@/assets/products/beef-suya.jpg';
import tomatoesImg from '@/assets/products/tomatoes.jpg';
import peppersImg from '@/assets/products/peppers.jpg';
import spinachImg from '@/assets/products/spinach.jpg';
import ugwuImg from '@/assets/products/ugwu.jpg';
import plantainsImg from '@/assets/products/plantains.jpg';
import orangesImg from '@/assets/products/oranges.jpg';
import riceImg from '@/assets/products/rice.jpg';
import beansImg from '@/assets/products/beans.jpg';
import crayfishImg from '@/assets/products/crayfish.jpg';
import palmOilImg from '@/assets/products/palm-oil.jpg';

// Nigerian Banks for dropdown
export const nigerianBanks = [
  'Access Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Globus Bank',
  'Guaranty Trust Bank (GTBank)',
  'Heritage Bank',
  'Jaiz Bank',
  'Keystone Bank',
  'Kuda Bank',
  'Opay',
  'Palmpay',
  'Parallex Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'Titan Trust Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
];

export const mockPackages = [
  {
    id: 'pkg-essentials',
    name: 'Essentials',
    type: 'single',
    description: 'Perfect for singles and young couples starting out',
    weeklyDeliveryPrice: 70000,
    monthlyDeliveryPrice: 55000,
    servings: '1-2 people',
    features: [
      'Local rice, beans, garri, yam',
      'Fresh vegetables & fruits',
      'Frozen chicken & fish',
      'Basic oils & seasonings',
      'Saturday delivery',
    ],
  },
  {
    id: 'pkg-standard',
    name: 'Standard',
    type: 'couple',
    description: 'Complete kit for families of 3-5 members',
    weeklyDeliveryPrice: 140000,
    monthlyDeliveryPrice: 110000,
    servings: '3-5 people',
    features: [
      'Everything in Essentials',
      'Premium proteins selection',
      'Imported dairy products',
      'Household essentials',
      'Flexible delivery days',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'pkg-premium',
    name: 'Premium',
    type: 'premium',
    description: 'Curated gourmet selection for discerning households',
    weeklyDeliveryPrice: 320000,
    monthlyDeliveryPrice: 250000,
    servings: '4-6 people',
    features: [
      'Everything in Standard',
      'Imported gourmet items',
      'Specialty ingredients',
      'Wine & beverages',
      'Any-day delivery',
      'Dedicated concierge',
      'Custom substitutions',
    ],
  },
];

export const mockProducts = [
  // Proteins
  {
    id: 'prod-1',
    name: 'Fresh Chicken Breast',
    description: 'Premium boneless chicken breast, farm-fresh',
    category: 'proteins',
    price: 3500,
    unit: 'kg',
    image: chickenBreastImg,
    inStock: true,
    popular: true,
  },
  {
    id: 'prod-2',
    name: 'Nigerian Catfish',
    description: 'Fresh catfish, cleaned and cut',
    category: 'proteins',
    price: 4500,
    unit: 'kg',
    image: catfishImg,
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'Beef Suya Strips',
    description: 'Pre-marinated beef strips ready for grilling',
    category: 'proteins',
    price: 5000,
    unit: 'kg',
    image: beefSuyaImg,
    inStock: true,
    popular: true,
  },
  // Vegetables
  {
    id: 'prod-4',
    name: 'Fresh Tomatoes',
    description: 'Ripe, juicy tomatoes',
    category: 'vegetables',
    price: 800,
    unit: 'kg',
    image: tomatoesImg,
    inStock: true,
  },
  {
    id: 'prod-5',
    name: 'Green Peppers',
    description: 'Fresh tatashe and shombo peppers',
    category: 'vegetables',
    price: 600,
    unit: 'kg',
    image: peppersImg,
    inStock: true,
  },
  {
    id: 'prod-6',
    name: 'Spinach (Efo Tete)',
    description: 'Fresh Nigerian spinach, washed and ready',
    category: 'vegetables',
    price: 400,
    unit: 'bunch',
    image: spinachImg,
    inStock: true,
  },
  {
    id: 'prod-7',
    name: 'Ugwu Leaves',
    description: 'Fresh pumpkin leaves',
    category: 'vegetables',
    price: 350,
    unit: 'bunch',
    image: ugwuImg,
    inStock: true,
    popular: true,
  },
  // Fruits
  {
    id: 'prod-8',
    name: 'Ripe Plantains',
    description: 'Perfect for dodo or boli',
    category: 'fruits',
    price: 500,
    unit: 'bunch',
    image: plantainsImg,
    inStock: true,
    popular: true,
  },
  {
    id: 'prod-9',
    name: 'Fresh Oranges',
    description: 'Sweet and juicy oranges',
    category: 'fruits',
    price: 800,
    unit: 'dozen',
    image: orangesImg,
    inStock: true,
  },
  // Grains
  {
    id: 'prod-10',
    name: 'Premium Rice',
    description: 'Long grain Nigerian rice',
    category: 'grains',
    price: 2500,
    unit: 'kg',
    image: riceImg,
    inStock: true,
  },
  {
    id: 'prod-11',
    name: 'Beans (Oloyin)',
    description: 'Sweet honey beans',
    category: 'grains',
    price: 1200,
    unit: 'kg',
    image: beansImg,
    inStock: true,
  },
  // Spices
  {
    id: 'prod-12',
    name: 'Crayfish',
    description: 'Ground dried crayfish',
    category: 'spices',
    price: 2000,
    unit: '250g',
    image: crayfishImg,
    inStock: true,
  },
  {
    id: 'prod-13',
    name: 'Palm Oil',
    description: 'Pure red palm oil',
    category: 'spices',
    price: 1500,
    unit: 'litre',
    image: palmOilImg,
    inStock: true,
  },
];
