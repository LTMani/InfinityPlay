import { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'route_66_revival',
    name: 'Route 66 Neon Revival',
    subtitle: 'The Classic Desert Dustbowl',
    description: 'Transform an abandoned Route 66 junction into the premier modern rest stop for truckers and adventurous tourists.',
    initialCash: 0,
    highwaySpeedLimit: 75,
    trafficVolumeRate: 1.0,
    mapWidth: 28,
    mapHeight: 28,
    weatherPattern: 'DESERT',
    objectives: [
      {
        id: 'build_pumps',
        description: 'Build at least 2 Dual Fuel Dispensers',
        target: 2,
        current: 0,
        completed: false
      },
      {
        id: 'build_motel',
        description: 'Construct at least 3 Motel Rooms or Trucker Cabins',
        target: 3,
        current: 0,
        completed: false
      },
      {
        id: 'serve_customers',
        description: 'Service 50 Highway Customers',
        target: 50,
        current: 0,
        completed: false
      },
      {
        id: 'reputation',
        description: 'Achieve a 4.0 Star Rating or higher',
        target: 4.0,
        current: 2.5,
        completed: false
      }
    ]
  },
  {
    id: 'interstate_freight_corridor',
    name: 'Interstate Big-Rig Corridor',
    subtitle: 'Heavy Freight Logistics Hub',
    description: 'A relentless artery of heavy commercial freight. Diesel supplies and soundproof sleeper cabins will drive maximum profit.',
    initialCash: 0,
    highwaySpeedLimit: 65,
    trafficVolumeRate: 1.5,
    mapWidth: 32,
    mapHeight: 32,
    weatherPattern: 'TEMPERATE',
    objectives: [
      {
        id: 'diesel_pumps',
        description: 'Build 3 Commercial Diesel Islands',
        target: 3,
        current: 0,
        completed: false
      },
      {
        id: 'trucker_cabins',
        description: 'Build 5 Soundproof Trucker Cabins',
        target: 5,
        current: 0,
        completed: false
      },
      {
        id: 'diner_built',
        description: 'Construct the Highway Diner & Grill',
        target: 1,
        current: 0,
        completed: false
      },
      {
        id: 'revenue_target',
        description: 'Earn $10,000 in net profits',
        target: 10000,
        current: 0,
        completed: false
      }
    ]
  },
  {
    id: 'infinite_sandbox',
    name: 'Billionaire Highway Sandbox',
    subtitle: 'Unlimited Creative Expansion',
    description: 'Uncapped capital, all technologies unlocked from the start, and zero debt. Build the ultimate mega-oasis.',
    initialCash: 500000,
    highwaySpeedLimit: 80,
    trafficVolumeRate: 1.8,
    mapWidth: 36,
    mapHeight: 36,
    weatherPattern: 'COASTAL',
    objectives: [
      {
        id: 'grand_oasis',
        description: 'Construct over 20 commercial and hospitality buildings',
        target: 20,
        current: 0,
        completed: false
      }
    ]
  }
];
