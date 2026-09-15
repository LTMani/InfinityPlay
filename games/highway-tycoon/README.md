# 🛣️ Highway Oasis Tycoon

**Highway Oasis Tycoon** is a deep, production-grade 2.5D isometric rest-stop and service plaza management simulation game built with React, TypeScript, Vite, Tailwind CSS, HTML5 Canvas, and the Web Audio API.

---

## 🎮 How to Run and Play

From the project root:
```bash
# Start the game dev server directly
npm run game

# Or navigate directly into the game folder
cd apps/highway-tycoon
npm run dev
```

Open your browser at `http://localhost:5173` to play!

---

## 🕹️ Controls & Navigation

- **Left Mouse Click & Drag**: Pan across the rest-stop campus.
- **Mouse Wheel**: Smooth zoom in and out (0.6x to 2.2x).
- **Left Click on Ground**: Build selected facility (when building tool is active).
- **Left Click on Vehicle**: Open Customer Inspector (view driver name, fatigue, fuel level, hunger, and spend).
- **Spacebar**: Pause / Resume simulation.
- **1 / 2 / 5 Keys**: Set simulation speed to 1x (Normal), 2x (Fast), or 5x (Hyper).
- **Escape**: Cancel active build or demolish mode.

---

## 🏗️ Core Game Systems & Features

### 1. ⛽ Petrol Pumps & Underground Fuel Logistics
- **Multi-Grade Dispensers**: Dual pumps offering Regular 87 and Premium 93, commercial Ultra-High-Flow Diesel for 18-wheelers, and 350kW DC Fast EV Superchargers.
- **Underground Storage Tanks (UST)**: Real-time inventory tracking for Regular, Premium, Diesel, and grid power.
- **Crude Oil Market Volatility**: Wholesale oil barrel prices fluctuate dynamically. Set retail fuel prices to maintain profit margins without driving away price-sensitive travelers.
- **Automated Tanker Delivery**: Schedule tanker trucks or enable Auto-Reorder when tank thresholds fall low.

### 2. 🛏️ Sleeper Motels & Soundproof Trucker Cabins
- **Hospitality Accommodations**: Classic motel suites for families/tourists and acoustically soundproofed sleeper cabins for commercial long-haulers.
- **Room Lifecycle**: Vacant Clean $\rightarrow$ Occupied $\rightarrow$ Vacant Dirty $\rightarrow$ Housekeeping Sanitization.
- **Turnover Management**: Hire and schedule housekeepers to maintain rapid turnaround and avoid customer complaints.
- **Dynamic Room Pricing**: Adjust nightly rates per category to maximize RevPAR (Revenue Per Available Room).

### 3. 🛒 24/7 Commercial Services
- **Oasis QuickMart**: Convenience store selling snacks, hot coffee, drinks, and auto supplies.
- **Highway Diner & Grill**: Hot burger plates, pancake stacks, and meals with short-order cook throughput.
- **Express Tunnel Car Wash**: Cleans highway road grime for high-margin extra income.
- **Sanitary Restroom Pavilion**: Well-maintained restrooms prevent negative reviews.

### 4. 🚗 Dynamic Highway & Customer AI
- **Multi-Lane Interstate**: Continuously spawning sedans, SUVs, sports cars, refrigerated reefers, 18-wheelers, campers, electric vehicles, and motorcycles.
- **Need-Based Exit Decisions**: Drivers decide to exit based on low fuel, exhaustion, hunger, or giant highway billboard advertising.
- **Smooth Waypoint Routing**: Realistic off-ramp deceleration, driveway navigation, pump queueing, parking, and on-ramp acceleration back into highway traffic.
- **HighwayYelp Reviews**: Customers publish 1 to 5 star reviews based on pump wait times, room cleanliness, food quality, and pricing.

### 5. 👥 Human Resources & Payroll
- **Staff Roles**: Pump Attendants, Housekeepers, Cashiers, Short-Order Cooks, Mechanics, and Security Guards.
- **Staff Attributes**: Skill levels, morale, stamina, and hourly wage expectations. Adjust salaries to maintain high workforce efficiency.

### 6. 📈 Financial Ledger & Commercial Loans
- **Real-Time P&L Statement**: Breakdown of revenue by department (Fuel, Motel, Store, Diner, Services) vs expenses (Payroll, Utilities, Wholesale Fuel, Loan Interest).
- **Commercial Credit Facilities**: Take bank loans for capital expenditure and pay off installments over time.

### 7. 🔬 R&D Technology Tree
- **High-Flow Dispensers**: +40% refueling speed.
- **Pay-at-the-Pump Automation**: Instant pump checkouts.
- **Orthopedic Memory Foam Beds**: Boosts motel rates and guest happiness.
- **Self-Service Kiosks**: Doubles QuickMart throughput.
- **10-Mile Radar Neon Beacon**: +30% highway exit traffic volume.
- **Solar Microgrid Canopy**: Reduces daily electricity bills by 50%.

### 8. 🔊 Procedural Web Audio Synthesizer
- Fully synthesized retro-modern audio generated directly in code via the Web Audio API without needing external asset files:
  - Cash register "ching"
  - Fuel pump nozzle clicks and dispensing hum
  - Motel reception desk bell chime
  - Car horns and revs
  - Objective completion victory fanfare
  - Mute/Unmute toggle

---

## 🧪 Testing

Run the automated test suite covering financial integrity, fuel tank logistics, room turnover, and traffic routing:
```bash
npm test
```
