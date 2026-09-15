export type DevRequirementType = 
  | 'FUEL_CAPACITY'
  | 'STORE_CAPACITY'
  | 'MOTEL_CAPACITY'
  | 'LAND_PARCELS'
  | 'CUSTOMERS_SERVED'
  | 'HIGHWAY_LANES'
  | 'REPUTATION';

export interface DevRequirement {
  type: DevRequirementType;
  value: number;
  label: string;
}

export interface PlazaLevelConfig {
  level: number;
  name: string;
  subtitle: string;
  upgradeCost: number;
  requiredDev: DevRequirement;
  unlockedFeatures: string[];
}

function generateProgressionLevels(): PlazaLevelConfig[] {
  const levels: PlazaLevelConfig[] = [];

  // Titles and milestones distribution across 100 levels
  for (let i = 1; i <= 100; i++) {
    let name = `Level ${i}: Highway Milestone`;
    let subtitle = 'Expanding travel oasis throughput and services';
    let upgradeCost = Math.round(350 * Math.pow(i, 1.35) / 50) * 50;
    if (i === 1) upgradeCost = 450;
    if (i === 100) upgradeCost = 0; // Final level

    let reqType: DevRequirementType = 'CUSTOMERS_SERVED';
    let reqVal = Math.round(i * 12);
    let reqLabel = `Serve at least ${reqVal} highway customers`;
    let unlockedFeatures: string[] = [`Increased Highway Customer Flow (+${i * 2}%)`];

    // Tier 1: Roadside Fuel Expansion (Levels 1 - 15)
    if (i <= 5) {
      if (i === 1) {
        name = 'Level 1: Solitary Roadside Pump';
        subtitle = 'Basic gasoline dispenser serving highway pass-through traffic';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 0;
        reqLabel = 'Initial starter fuel pump';
        unlockedFeatures = ['Regular Gasoline Pump', 'Direct Cash Receipts'];
      } else if (i === 2) {
        name = 'Level 2: Dual Fuel Nozzle Post';
        subtitle = 'Increased pumping speed and customer capacity';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 4;
        reqLabel = 'Serve at least 4 highway customers';
        unlockedFeatures = ['Pump Speed Boost +20%', 'Reduced Wait Times'];
      } else if (i === 3) {
        name = 'Level 3: Lighted Canopy Shell';
        subtitle = 'Illuminated modern canopy providing shade and weather cover';
        reqType = 'FUEL_CAPACITY';
        reqVal = 2;
        reqLabel = 'Upgrade Fuel Capacity to Level 2';
        unlockedFeatures = ['Overhead Weather Canopy', 'Night Lighting'];
      } else if (i === 4) {
        name = 'Level 4: High-Throughput Fuel Island';
        subtitle = 'Additional pump nozzles for passenger sedans';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 15;
        reqLabel = 'Serve at least 15 highway vehicles';
        unlockedFeatures = ['+2 Fuel Dispensers', 'Dual-Side Pumping'];
      } else if (i === 5) {
        name = 'Level 5: Roadside Air & Water Bay';
        subtitle = 'Tire inflation and windshield squeegee stations';
        reqType = 'FUEL_CAPACITY';
        reqVal = 3;
        reqLabel = 'Upgrade Fuel Capacity to Level 3';
        unlockedFeatures = ['Free Air Station', 'Customer Satisfaction +15%'];
      }
    } 
    // Tier 2: Commercial Rig Freight Hub & EV Hub (Levels 6 - 20)
    else if (i <= 20) {
      if (i === 6) {
        name = 'Level 6: North Land Acquisition';
        subtitle = 'Acquire adjacent northern acreage to construct commercial truck lanes';
        reqType = 'LAND_PARCELS';
        reqVal = 1;
        reqLabel = 'Purchase North Expansion Land Plot';
        unlockedFeatures = ['North Land Parcel Access', 'Truck Lane Prep'];
      } else if (i === 7) {
        name = 'Level 7: Commercial 18-Wheeler Diesel Lane';
        subtitle = 'Heavy-duty high-speed diesel lanes set 35m deep for semi-trucks';
        reqType = 'FUEL_CAPACITY';
        reqVal = 4;
        reqLabel = 'Upgrade Fuel Capacity to Level 4 (Diesel)';
        unlockedFeatures = ['18-Wheeler Semi-Truck Access', 'Commercial Diesel Berths'];
      } else if (i === 8) {
        name = 'Level 8: 350kW DC Ultra-Fast EV Hub';
        subtitle = 'High-output electric vehicle charging pedestals with cyan illumination';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 45;
        reqLabel = 'Serve 45 highway customers';
        unlockedFeatures = ['350kW EV Superchargers', 'Electric Vehicle Traffic'];
      } else if (i === 12) {
        name = 'Level 12: Dual Commercial Freight Corridors';
        subtitle = 'Expanded drive-through diesel berths with zero service road overlap';
        reqType = 'FUEL_CAPACITY';
        reqVal = 5;
        reqLabel = 'Upgrade Fuel Capacity to Level 5';
        unlockedFeatures = ['+2 High-Speed Diesel Lanes', 'DEF Additive Pumps'];
      } else if (i === 16) {
        name = 'Level 16: Automated Wholesale Tanker Logistics';
        subtitle = 'Bulk underground fuel storage tanks and lower supply pricing';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 110;
        reqLabel = 'Serve 110 highway vehicles';
        unlockedFeatures = ['50,000L Fuel Reserves', 'Bulk Fuel Discount'];
      } else if (i === 20) {
        name = 'Level 20: Interstate Freight Logistics Junction';
        subtitle = 'Fleet accounts and commercial trucking contracts';
        reqType = 'LAND_PARCELS';
        reqVal = 2;
        reqLabel = 'Purchase East Commercial Land Plot';
        unlockedFeatures = ['East Expansion Parcel', 'Commercial Fleet Traffic'];
      } else {
        name = `Level ${i}: Freight Corridor Optimization Stage ${i - 5}`;
        reqType = 'CUSTOMERS_SERVED';
        reqVal = i * 14;
        reqLabel = `Serve ${reqVal} highway vehicles`;
      }
    }
    // Tier 3: 24/7 Oasis QuickMart Retail (Levels 21 - 45)
    else if (i <= 45) {
      if (i === 21) {
        name = 'Level 21: QuickMart Express Store Opening';
        subtitle = 'Full 24/7 convenience store with fresh snacks, drinks, and coffee';
        reqType = 'STORE_CAPACITY';
        reqVal = 1;
        reqLabel = 'Construct & Stock QuickMart Store (Capacity Lvl 1)';
        unlockedFeatures = ['24/7 Oasis QuickMart', 'Retail Merchandising Revenue'];
      } else if (i === 25) {
        name = 'Level 25: Artisan Bean-to-Cup Coffee Bar';
        subtitle = 'Espresso machines and premium hot roast station';
        reqType = 'STORE_CAPACITY';
        reqVal = 2;
        reqLabel = 'Upgrade Store Capacity to Level 2';
        unlockedFeatures = ['Gourmet Coffee Bar', 'High-Margin Snack Sales'];
      } else if (i === 30) {
        name = 'Level 30: Chilled Beverage Caves & Grab-and-Go';
        subtitle = 'Walk-in beverage cooler and fresh artisan deli sandwiches';
        reqType = 'STORE_CAPACITY';
        reqVal = 3;
        reqLabel = 'Upgrade Store Capacity to Level 3';
        unlockedFeatures = ['Cold Drink Cave', 'Fresh Deli Counter'];
      } else if (i === 35) {
        name = 'Level 35: Roadside Souvenirs & Travel Essentials';
        subtitle = 'Route 66 memorabilia, electronics chargers, and local gifts';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 320;
        reqLabel = 'Serve 320 highway visitors';
        unlockedFeatures = ['Gift & Souvenir Aisle', '+35% Retail Margin'];
      } else if (i === 40) {
        name = 'Level 40: Fast-Flow Dual Checkout Registers';
        subtitle = 'Rapid POS checkout terminals eliminating customer store queues';
        reqType = 'STORE_CAPACITY';
        reqVal = 4;
        reqLabel = 'Upgrade Store Capacity to Level 4';
        unlockedFeatures = ['Dual POS Registers', 'Zero Store Checkout Queues'];
      } else if (i === 45) {
        name = 'Level 45: Commercial Trucker Travel Mart';
        subtitle = 'Heavy-duty trucking hardware, logbooks, and CB radio gear';
        reqType = 'REPUTATION';
        reqVal = 4.2;
        reqLabel = 'Achieve 4.2+ Star Customer Rating';
        unlockedFeatures = ['Trucker Hardware Section', 'Store Patronage +40%'];
      } else {
        name = `Level ${i}: Retail Market Expansion Step ${i - 20}`;
        reqType = 'STORE_CAPACITY';
        reqVal = Math.min(5, Math.floor(i / 10));
        reqLabel = `Store Capacity Level ${reqVal}+ and ${i * 12} customers`;
      }
    }
    // Tier 4: Route 66 Classic Diner & Food Plaza (Levels 46 - 65)
    else if (i <= 65) {
      if (i === 46) {
        name = 'Level 46: Route 66 Diner Grand Opening';
        subtitle = 'Classic Americana diner serving hot burgers, shakes, and steaks';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 500;
        reqLabel = 'Serve 500 total highway customers';
        unlockedFeatures = ['Route 66 Diner Kitchen', 'Restaurant Meal Revenue'];
      } else if (i === 50) {
        name = 'Level 50: Outdoor Patio & Umbrella Seating';
        subtitle = 'Sunlit outdoor dining area for scenic highway views';
        reqType = 'REPUTATION';
        reqVal = 4.4;
        reqLabel = 'Achieve 4.4+ Star Reputation';
        unlockedFeatures = ['Patio Umbrella Dining Tables', 'Food Capacity +50%'];
      } else if (i === 55) {
        name = 'Level 55: High-Output Commercial Kitchen';
        subtitle = 'Stainless steel commercial fryers and artisan burger prep line';
        reqType = 'STORE_CAPACITY';
        reqVal = 5;
        reqLabel = 'Upgrade Store & Food Capacity to Level 5';
        unlockedFeatures = ['Gourmet Kitchen Prep', 'Diner Peak Rush Handling'];
      } else if (i === 60) {
        name = 'Level 60: South Truck Logistics Lot Acquisition';
        subtitle = 'Acquire southern territory to construct overnight motel and rest park';
        reqType = 'LAND_PARCELS';
        reqVal = 3;
        reqLabel = 'Purchase South Logistics Land Plot';
        unlockedFeatures = ['South Land Parcel', 'Motel & Park Prep'];
      } else if (i === 65) {
        name = 'Level 65: 24/7 All-Day Breakfast & Bakery';
        subtitle = 'Fresh hot donuts, pies, and endless hot skillet breakfasts';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 850;
        reqLabel = 'Serve 850 highway travelers';
        unlockedFeatures = ['24/7 Bakery Display', 'Breakfast Rush Bonuses'];
      } else {
        name = `Level ${i}: Food Service Elevation Phase ${i - 45}`;
        reqType = 'CUSTOMERS_SERVED';
        reqVal = i * 16;
        reqLabel = `Serve ${reqVal} hungry travelers`;
      }
    }
    // Tier 5: Highway Motel, Sleeper Cabins & Rest Park (Levels 66 - 85)
    else if (i <= 85) {
      if (i === 66) {
        name = 'Level 66: Highway Motel Lodge Opening';
        subtitle = 'Modern 2-story guest suites with comfortable king beds and hot showers';
        reqType = 'MOTEL_CAPACITY';
        reqVal = 1;
        reqLabel = 'Construct & Open Motel Suites (Motel Lvl 1)';
        unlockedFeatures = ['2-Story Motel Suites', 'High-Yield Room Bookings'];
      } else if (i === 70) {
        name = 'Level 70: Soundproof Trucker Sleeper Cabins';
        subtitle = 'Heavy acoustic insulation cabins giving long-haul truckers quiet rest';
        reqType = 'MOTEL_CAPACITY';
        reqVal = 2;
        reqLabel = 'Upgrade Motel Capacity to Level 2';
        unlockedFeatures = ['Soundproof Sleeper Cabins', 'Long-Haul Trucker Bookings'];
      } else if (i === 75) {
        name = 'Level 75: Landscaped Oasis Rest Park';
        subtitle = 'Lush grass lawn, shade trees, picnic benches, and pet relief areas';
        reqType = 'REPUTATION';
        reqVal = 4.6;
        reqLabel = 'Achieve 4.6+ Star Customer Reputation';
        unlockedFeatures = ['Rest Park & Shade Trees', 'Family Traveler Boost +30%'];
      } else if (i === 80) {
        name = 'Level 80: Deep East Resort Land Acquisition';
        subtitle = 'Acquire fourth acreage parcel for mega luxury expansion';
        reqType = 'LAND_PARCELS';
        reqVal = 4;
        reqLabel = 'Purchase Deep East Land Parcel';
        unlockedFeatures = ['Deep East Acreage', 'Resort Amenities Access'];
      } else if (i === 85) {
        name = 'Level 85: Luxury Executive Motel Suites';
        subtitle = 'Jacuzzi suites, premium bedding, and 24-hour room service';
        reqType = 'MOTEL_CAPACITY';
        reqVal = 4;
        reqLabel = 'Upgrade Motel Capacity to Level 4';
        unlockedFeatures = ['Executive Penthouse Suites', '$250/Night VIP Rates'];
      } else {
        name = `Level ${i}: Hospitality Excellence Phase ${i - 65}`;
        reqType = 'MOTEL_CAPACITY';
        reqVal = Math.min(5, Math.floor((i - 60) / 5));
        reqLabel = `Motel Capacity Level ${reqVal}+ and ${i * 18} guests`;
      }
    }
    // Tier 6: Highway Infrastructure Expansion & Continental Oasis (Levels 86 - 100)
    else {
      if (i === 86) {
        name = 'Level 86: 6-Lane Highway Arterial Expansion';
        subtitle = 'Expand the single arterial highway into a 6-lane interstate superhighway';
        reqType = 'HIGHWAY_LANES';
        reqVal = 6;
        reqLabel = 'Expand Highway to 6 Full Lanes';
        unlockedFeatures = ['6-Lane Interstate Highway', 'Traffic Throughput +50%'];
      } else if (i === 90) {
        name = 'Level 90: High-Speed Flyover Toll & Express Slipways';
        subtitle = 'Flyover ramps providing zero-stop entry into the travel center';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 1800;
        reqLabel = 'Serve 1,800 highway travelers';
        unlockedFeatures = ['Express Off-Ramp Flyover', 'Zero-Congestion Inflow'];
      } else if (i === 95) {
        name = 'Level 95: Automated Touchless Tunnel Car Wash';
        subtitle = 'High-pressure wash bay with foam cannon and ceramic wax polish';
        reqType = 'REPUTATION';
        reqVal = 4.85;
        reqLabel = 'Achieve 4.85+ Star Customer Reputation';
        unlockedFeatures = ['Tunnel Car Wash', 'Automated Wash Revenue'];
      } else if (i === 100) {
        name = 'Level 100: Grand Continental Highway Travel Oasis';
        subtitle = 'The ultimate 5-Star travel destination across the transcontinental corridor';
        reqType = 'CUSTOMERS_SERVED';
        reqVal = 2500;
        reqLabel = 'Serve 2,500 total highway travelers';
        unlockedFeatures = [
          'Master Highway Tycoon Trophy',
          'Unlimited Customer Capacity',
          'VIP Diamond Concierge',
          '5-Star Transcontinental Prestige'
        ];
      } else {
        name = `Level ${i}: Super-Oasis Infrastructure Stage ${i - 85}`;
        reqType = 'CUSTOMERS_SERVED';
        reqVal = i * 22;
        reqLabel = `Serve ${reqVal} travelers across the corridor`;
      }
    }

    levels.push({
      level: i,
      name,
      subtitle,
      upgradeCost,
      requiredDev: {
        type: reqType,
        value: reqVal,
        label: reqLabel
      },
      unlockedFeatures
    });
  }

  return levels;
}

export const PROG_100_LEVELS: PlazaLevelConfig[] = generateProgressionLevels();
