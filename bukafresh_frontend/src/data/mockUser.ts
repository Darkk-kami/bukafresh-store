import { User, Subscription, Order, Address, Delivery } from '@/types';
import { mockPackages } from './mockProducts';

export const mockUser: User = {
  id: 'user-1',
  email: 'john.doe@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+234 801 234 5678',
  createdAt: new Date('2024-01-15'),
};

export const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    street: '15 Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos',
    postalCode: '101233',
    isDefault: true,
    instructions: 'Call when at the gate',
  },
  {
    id: 'addr-2',
    label: 'Office',
    street: '42 Marina Street, Lagos Island',
    city: 'Lagos',
    state: 'Lagos',
    postalCode: '101001',
    isDefault: false,
  },
];

export const mockSubscription: Subscription = {
  id: 'sub-1',
  userId: 'user-1',
  packageId: 'pkg-couple',
  package: mockPackages[1],
  status: 'active',
  startDate: new Date('2024-01-20'),
  nextDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
  deliveryDay: 'saturday',
  deliveryFrequency: 'weekly',
};

export const mockDeliveries: Delivery[] = [
  {
    id: 'del-1',
    subscriptionId: 'sub-1',
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'scheduled',
    address: mockAddresses[0],
    items: [
      { id: 'item-1', productId: 'prod-1', name: 'Fresh Chicken Breast', quantity: 2, unit: 'kg', price: 7000 },
      { id: 'item-2', productId: 'prod-4', name: 'Fresh Tomatoes', quantity: 3, unit: 'kg', price: 2400 },
      { id: 'item-3', productId: 'prod-7', name: 'Ugwu Leaves', quantity: 4, unit: 'bunch', price: 1400 },
      { id: 'item-4', productId: 'prod-10', name: 'Premium Rice', quantity: 5, unit: 'kg', price: 12500 },
    ],
  },
  {
    id: 'del-2',
    subscriptionId: 'sub-1',
    scheduledDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    status: 'delivered',
    address: mockAddresses[0],
    items: [
      { id: 'item-5', productId: 'prod-2', name: 'Nigerian Catfish', quantity: 2, unit: 'kg', price: 9000 },
      { id: 'item-6', productId: 'prod-5', name: 'Green Peppers', quantity: 2, unit: 'kg', price: 1200 },
      { id: 'item-7', productId: 'prod-8', name: 'Ripe Plantains', quantity: 3, unit: 'bunch', price: 1500 },
    ],
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ord-1',
    userId: 'user-1',
    type: 'subscription',
    items: mockDeliveries[1].items,
    subtotal: 11700,
    deliveryFee: 0,
    total: 11700,
    status: 'delivered',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    address: mockAddresses[0],
  },
  {
    id: 'ord-2',
    userId: 'user-1',
    type: 'addon',
    items: [
      { id: 'item-8', productId: 'prod-3', name: 'Beef Suya Strips', quantity: 1, unit: 'kg', price: 5000 },
    ],
    subtotal: 5000,
    deliveryFee: 500,
    total: 5500,
    status: 'delivered',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    deliveredAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    address: mockAddresses[0],
  },
];
