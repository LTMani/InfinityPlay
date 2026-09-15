import { StaffMember, StaffRole } from '../../types';

export const ROLE_CONFIGS: Record<StaffRole, { title: string; defaultSalary: number; description: string }> = {
  PUMP_ATTENDANT: {
    title: 'Pump Attendant',
    defaultSalary: 16,
    description: 'Speeds up refueling and prevents fuel spills.'
  },
  HOUSEKEEPER: {
    title: 'Housekeeper',
    defaultSalary: 18,
    description: 'Cleans dirty motel rooms and trucker cabins, readying them for guests.'
  },
  CASHIER: {
    title: 'QuickMart Cashier',
    defaultSalary: 15,
    description: 'Speeds up convenience store checkout and keeps shelves organized.'
  },
  COOK: {
    title: 'Short-Order Cook',
    defaultSalary: 22,
    description: 'Cooks meals at the highway diner, reducing customer wait times.'
  },
  MECHANIC: {
    title: 'Service Mechanic',
    defaultSalary: 28,
    description: 'Repairs broken dispensers and maintains car wash machinery.'
  },
  SECURITY: {
    title: 'Highway Security Guard',
    defaultSalary: 20,
    description: 'Prevents noise complaints in the sleep area and improves safety score.'
  }
};

const FIRST_NAMES = ['Jack', 'Sarah', 'Carlos', 'Dave', 'Elena', 'Marcus', 'Chloe', 'Liam', 'Maya', 'Tyler', 'Brenda', 'Ray'];
const LAST_NAMES = ['Miller', 'Johnson', 'Rodriguez', 'Smith', 'Chang', 'Kowalski', 'Davis', 'Walker', 'O\'Connor', 'Patel'];

export class StaffManager {
  public staff: StaffMember[] = [];

  constructor() {
    // Initial starting staff
    this.hireStaff('PUMP_ATTENDANT', 'DAY');
    this.hireStaff('HOUSEKEEPER', 'DAY');
  }

  public hireStaff(role: StaffRole, shift: 'DAY' | 'NIGHT' | 'SWING' = 'DAY'): StaffMember {
    const config = ROLE_CONFIGS[role];
    const name = `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
    const id = `staff_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const newMember: StaffMember = {
      id,
      name,
      role,
      salaryPerHour: config.defaultSalary,
      skill: Math.floor(Math.random() * 4) + 4, // 4 - 8
      stamina: 100,
      morale: 85,
      shift,
      isWorking: true,
      hireDate: Date.now()
    };

    this.staff.push(newMember);
    return newMember;
  }

  public fireStaff(id: string): boolean {
    const index = this.staff.findIndex(s => s.id === id);
    if (index !== -1) {
      this.staff.splice(index, 1);
      return true;
    }
    return false;
  }

  public setSalary(id: string, newSalary: number): void {
    const member = this.staff.find(s => s.id === id);
    if (member) {
      member.salaryPerHour = Math.max(10, Math.min(60, newSalary));
      // Adjust morale based on salary comparison to default
      const baseSalary = ROLE_CONFIGS[member.role].defaultSalary;
      const ratio = member.salaryPerHour / baseSalary;
      member.morale = Math.min(100, Math.max(20, Math.round(ratio * 80)));
    }
  }

  public getHourlySalariesTotal(): number {
    return this.staff.reduce((sum, s) => sum + s.salaryPerHour, 0);
  }

  public hasActiveHousekeeper(): boolean {
    return this.staff.some(s => s.role === 'HOUSEKEEPER' && s.isWorking);
  }

  public getHousekeepingSpeedMultiplier(): number {
    const cleaners = this.staff.filter(s => s.role === 'HOUSEKEEPER' && s.isWorking);
    if (cleaners.length === 0) return 0;
    const avgSkill = cleaners.reduce((sum, c) => sum + c.skill, 0) / cleaners.length;
    return cleaners.length * (0.8 + avgSkill * 0.1);
  }

  public getPumpSpeedMultiplier(): number {
    const attendants = this.staff.filter(s => s.role === 'PUMP_ATTENDANT' && s.isWorking);
    if (attendants.length === 0) return 1.0;
    return 1.0 + (attendants.length * 0.25);
  }
}
