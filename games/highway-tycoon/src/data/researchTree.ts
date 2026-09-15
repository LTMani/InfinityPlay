import { ResearchTech } from '../types';

export const RESEARCH_TECHS: ResearchTech[] = [
  {
    id: 'HIGH_FLOW_NOZZLES',
    name: 'High-Flow Dispenser Nozzles',
    cost: 3000,
    category: 'EFFICIENCY',
    description: 'Increases fuel pump transfer rate by +40%, cutting queue times significantly.',
    unlocked: false,
    prerequisites: [],
    effectDescription: '+40% Refueling Speed'
  },
  {
    id: 'AUTOMATED_BILLING',
    name: 'Pay-at-the-Pump Terminals',
    cost: 4500,
    category: 'EFFICIENCY',
    description: 'Drivers can tap-and-pay directly at pumps, freeing cashiers to service store customers.',
    unlocked: false,
    prerequisites: ['HIGH_FLOW_NOZZLES'],
    effectDescription: 'Customers pay instantly at pumps'
  },
  {
    id: 'MEMO_FOAM_MATTRESSES',
    name: 'Orthopedic Sleep Beds',
    cost: 5000,
    category: 'LUXURY',
    description: 'Upgrades motel beds to NASA-grade memory foam, boosting motel guest satisfaction by +35%.',
    unlocked: false,
    prerequisites: [],
    effectDescription: '+35% Motel Satisfaction & +$15/night room rate'
  },
  {
    id: 'EXPRESS_CHECKOUT',
    name: 'Self-Service Mart Kiosks',
    cost: 6500,
    category: 'EFFICIENCY',
    description: 'Reduces convenience store checkout queues by 50% through automated scanning.',
    unlocked: false,
    prerequisites: ['AUTOMATED_BILLING'],
    effectDescription: 'Doubles Store Checkout Capacity'
  },
  {
    id: 'ROADSIDE_MEGA_NEON',
    name: '10-Mile Radar Neon Beacon',
    cost: 8000,
    category: 'MARKETING',
    description: 'Draws weary cross-country long-haulers off the interstate even in poor weather.',
    unlocked: false,
    prerequisites: [],
    effectDescription: '+30% Highway Exit Traffic Volume'
  },
  {
    id: 'SOLAR_CANOPY',
    name: 'Solar Canopy Microgrid',
    cost: 12000,
    category: 'CAPACITY',
    description: 'Rooftop photovoltaic arrays power all EV stations and lower daily electricity upkeep by 50%.',
    unlocked: false,
    prerequisites: ['AUTOMATED_BILLING'],
    effectDescription: '-50% Daily Building Utility Upkeep'
  }
];
