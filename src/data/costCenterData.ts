/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ActivityCodeItem {
  id: string;
  code: string;
  description: string;
}

export interface CostCenterActivityRow {
  id: string;
  no: number;
  departmentName: string;
  departmentSubtitle?: string;
  iconType: 'tambang' | 'raw_meal' | 'clinker' | 'cement' | 'packing' | 'utilitas';
  colorTheme: 'blue' | 'green' | 'teal' | 'indigo' | 'orange' | 'purple';
  productionLinePlant: string;
  productionLineIcon?: 'mountain' | 'factory' | 'warehouse' | 'lightning';
  sigActivities: ActivityCodeItem[];
  techGroupActivities: ActivityCodeItem[];
  ghopoActivities: ActivityCodeItem[];
}

export const INITIAL_COST_CENTER_MAPPING: CostCenterActivityRow[] = [
  {
    id: 'cc-dept-2',
    no: 2,
    departmentName: 'TAMBANG',
    departmentSubtitle: 'RAW MATERIAL PREPARATION / TAMBANG',
    iconType: 'tambang',
    colorTheme: 'blue',
    productionLinePlant: 'TAMBANG',
    productionLineIcon: 'mountain',
    sigActivities: [
      { id: 'sig-23', code: '23', description: 'LIMESTONE CRUSHING' },
      { id: 'sig-24', code: '24', description: 'RAW MATERIAL TRANSPORT AND STORAGE' },
      { id: 'sig-25', code: '25', description: 'CLAY CRUSHING AND TRANSPORT' },
    ],
    techGroupActivities: [
      { id: 'tg-23', code: '23', description: 'LIMESTONE CRUSHING' },
      { id: 'tg-24', code: '24', description: 'RAW MATERIAL TRANSPORT AND STORAGE' },
      { id: 'tg-25', code: '25', description: 'CLAY CRUSHING AND TRANSPORT' },
    ],
    ghopoActivities: [
      { id: 'gh-2-1', code: '-', description: '' },
      { id: 'gh-2-2', code: '-', description: '' },
      { id: 'gh-2-3', code: '-', description: '' },
    ],
  },
  {
    id: 'cc-dept-3',
    no: 3,
    departmentName: 'RAW MEAL PREPARATION',
    departmentSubtitle: '',
    iconType: 'raw_meal',
    colorTheme: 'green',
    productionLinePlant: '1/2/3/4 etc',
    productionLineIcon: 'factory',
    sigActivities: [
      { id: 'sig-32', code: '32', description: 'RAW MATERIAL RECLAIM' },
      { id: 'sig-33', code: '33', description: 'RAW MATERIAL FEEDING' },
      { id: 'sig-34', code: '34', description: 'RAW MEAL GRINDING' },
      { id: 'sig-35', code: '35', description: 'RAW MATERIAL TRANSPORT' },
    ],
    techGroupActivities: [
      { id: 'tg-32', code: '32', description: 'RAW MATERIAL RECLAIM' },
      { id: 'tg-33', code: '33', description: 'RAW MATERIAL FEEDING' },
      { id: 'tg-34', code: '34', description: 'RAW MEAL GRINDING' },
      { id: 'tg-35', code: '35', description: 'RAW MATERIAL TRANSPORT' },
    ],
    ghopoActivities: [
      { id: 'gh-3-1', code: '-', description: '' },
      { id: 'gh-3-2', code: '-', description: '' },
      { id: 'gh-3-3', code: '-', description: '' },
      { id: 'gh-3-4', code: '-', description: '' },
    ],
  },
  {
    id: 'cc-dept-4',
    no: 4,
    departmentName: 'CLINKER PRODUCTION',
    departmentSubtitle: '',
    iconType: 'clinker',
    colorTheme: 'teal',
    productionLinePlant: '1/2/3/4 etc',
    productionLineIcon: 'factory',
    sigActivities: [
      { id: 'sig-41', code: '41', description: 'BLENDING SILO' },
      { id: 'sig-42', code: '42', description: 'KILN FEED' },
      { id: 'sig-44', code: '44', description: 'PYROPROCESS EQUIPMENT' },
      { id: 'sig-45', code: '45', description: 'CLINKER CONVEYING' },
      { id: 'sig-46', code: '46', description: 'COAL HANDLING' },
      { id: 'sig-47', code: '47', description: 'COAL GRINDING' },
      { id: 'sig-48', code: '48', description: 'PULVERIZED COAL FEEDING' },
      { id: 'sig-49', code: '49', description: 'FUEL OIL HANDLING AND FIRING' },
    ],
    techGroupActivities: [
      { id: 'tg-41', code: '41', description: 'BLENDING SILO' },
      { id: 'tg-42', code: '42', description: 'KILN FEED' },
      { id: 'tg-44', code: '44', description: 'PYROPROCESS EQUIPMENT' },
      { id: 'tg-45', code: '45', description: 'CLINKER CONVEYING' },
      { id: 'tg-46', code: '46', description: 'COAL HANDLING' },
      { id: 'tg-47', code: '47', description: 'COAL GRINDING' },
      { id: 'tg-48', code: '48', description: 'PULVERIZED COAL FEEDING' },
      { id: 'tg-49', code: '49', description: 'FUEL OIL HANDLING AND FIRING' },
    ],
    ghopoActivities: [
      { id: 'gh-4-1', code: '-', description: '' },
      { id: 'gh-4-2', code: '-', description: '' },
      { id: 'gh-4-3', code: '-', description: '' },
      { id: 'gh-4-4', code: '-', description: '' },
      { id: 'gh-4-5', code: '-', description: '' },
      { id: 'gh-4-6', code: '-', description: '' },
      { id: 'gh-4-7', code: '-', description: '' },
      { id: 'gh-4-8', code: '-', description: '' },
    ],
  },
  {
    id: 'cc-dept-5',
    no: 5,
    departmentName: 'CEMENT PRODUCTION',
    departmentSubtitle: '',
    iconType: 'cement',
    colorTheme: 'indigo',
    productionLinePlant: '1/2/3/4 etc',
    productionLineIcon: 'factory',
    sigActivities: [
      { id: 'sig-51', code: '51', description: 'GYPSUM AND ADDITIVES HANDLING' },
      { id: 'sig-52', code: '52', description: 'CLINKER STORAGE/HANDLING' },
      { id: 'sig-54', code: '54', description: 'RAW MATERIAL FEEDING AND GRINDING' },
      { id: 'sig-56', code: '56', description: 'CEMENT TRANSPORT' },
    ],
    techGroupActivities: [
      { id: 'tg-51', code: '51', description: 'GYPSUM AND ADDITIVES HANDLING' },
      { id: 'tg-52', code: '52', description: 'CLINKER STORAGE/HANDLING' },
      { id: 'tg-54', code: '54', description: 'RAW MATERIAL FEEDING AND GRINDING' },
      { id: 'tg-56', code: '56', description: 'CEMENT TRANSPORT' },
    ],
    ghopoActivities: [
      { id: 'gh-5-1', code: '52/53', description: '' },
      { id: 'gh-5-2', code: '54', description: '' },
      { id: 'gh-5-3', code: '56', description: '' },
      { id: 'gh-5-4', code: '-', description: '' },
    ],
  },
  {
    id: 'cc-dept-6',
    no: 6,
    departmentName: 'CEMENT PACKING & SHIPPING',
    departmentSubtitle: '',
    iconType: 'packing',
    colorTheme: 'orange',
    productionLinePlant: 'CEMENT PACKING AND SHIPPING',
    productionLineIcon: 'warehouse',
    sigActivities: [
      { id: 'sig-61', code: '61', description: 'SILO CEMENT' },
      { id: 'sig-62', code: '62', description: 'CEMENT TRANSPORT' },
      { id: 'sig-63', code: '63', description: 'PACKING MACHINE' },
      { id: 'sig-64', code: '64', description: 'BULK LOADING' },
      { id: 'sig-65', code: '65', description: 'CEMENT RETURN' },
    ],
    techGroupActivities: [
      { id: 'tg-61', code: '61', description: 'SILO CEMENT' },
      { id: 'tg-62', code: '62', description: 'CEMENT TRANSPORT' },
      { id: 'tg-63', code: '63', description: 'PACKING MACHINE' },
      { id: 'tg-64', code: '64', description: 'BULK LOADING' },
      { id: 'tg-65', code: '65', description: 'CEMENT RETURN' },
    ],
    ghopoActivities: [
      { id: 'gh-6-1', code: '-', description: '' },
      { id: 'gh-6-2', code: '-', description: '' },
      { id: 'gh-6-3', code: '-', description: '' },
      { id: 'gh-6-4', code: '-', description: '' },
      { id: 'gh-6-5', code: '-', description: '' },
    ],
  },
  {
    id: 'cc-dept-7',
    no: 7,
    departmentName: 'UTILITAS AND ELECTRICAL',
    departmentSubtitle: '',
    iconType: 'utilitas',
    colorTheme: 'purple',
    productionLinePlant: '1/2/3/4 etc',
    productionLineIcon: 'lightning',
    sigActivities: [
      { id: 'sig-71', code: '71', description: 'UTILITIES' },
      { id: 'sig-72', code: '72', description: 'ELECTRICAL' },
    ],
    techGroupActivities: [
      { id: 'tg-71', code: '71', description: 'UTILITIES' },
      { id: 'tg-72', code: '72', description: 'ELECTRICAL' },
    ],
    ghopoActivities: [
      { id: 'gh-7-1', code: '-', description: '' },
      { id: 'gh-7-2', code: '-', description: '' },
    ],
  },
];

const LOCAL_STORAGE_KEY = 'sig_cost_center_activity_mapping_v2';

export function getLocalCostCenterMapping(): CostCenterActivityRow[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse cost center mapping from localStorage', err);
  }
  return INITIAL_COST_CENTER_MAPPING;
}

export function saveLocalCostCenterMapping(data: CostCenterActivityRow[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save cost center mapping to localStorage', err);
  }
}

export function resetCostCenterMappingToDefault(): CostCenterActivityRow[] {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
  return INITIAL_COST_CENTER_MAPPING;
}

export function updateDepartmentRow(
  id: string,
  updated: Partial<CostCenterActivityRow>
): CostCenterActivityRow[] {
  const current = getLocalCostCenterMapping();
  const index = current.findIndex((d) => d.id === id);
  if (index !== -1) {
    const existing = current[index];
    if (existing) {
      current[index] = { ...existing, ...updated } as CostCenterActivityRow;
      saveLocalCostCenterMapping(current);
    }
  }
  return current;
}

export function addDepartmentRow(newRow: CostCenterActivityRow): CostCenterActivityRow[] {
  const current = getLocalCostCenterMapping();
  current.push(newRow);
  saveLocalCostCenterMapping(current);
  return current;
}

export function deleteDepartmentRow(id: string): CostCenterActivityRow[] {
  const current = getLocalCostCenterMapping().filter((d) => d.id !== id);
  saveLocalCostCenterMapping(current);
  return current;
}

export function addActivityToDepartment(
  deptId: string,
  sigCode: string,
  sigDesc: string,
  tgCode: string,
  tgDesc: string,
  ghopoCode: string
): CostCenterActivityRow[] {
  const current = getLocalCostCenterMapping();
  const dept = current.find((d) => d.id === deptId);
  if (dept) {
    const actId = `act-${Date.now()}`;
    dept.sigActivities.push({
      id: `sig-${actId}`,
      code: sigCode,
      description: sigDesc,
    });
    dept.techGroupActivities.push({
      id: `tg-${actId}`,
      code: tgCode || sigCode,
      description: tgDesc || sigDesc,
    });
    dept.ghopoActivities.push({
      id: `gh-${actId}`,
      code: ghopoCode || '-',
      description: '',
    });
    saveLocalCostCenterMapping(current);
  }
  return current;
}

export function updateActivityInDepartment(
  deptId: string,
  actIndex: number,
  sigCode: string,
  sigDesc: string,
  tgCode: string,
  tgDesc: string,
  ghopoCode: string
): CostCenterActivityRow[] {
  const current = getLocalCostCenterMapping();
  const dept = current.find((d) => d.id === deptId);
  if (dept && dept.sigActivities[actIndex]) {
    dept.sigActivities[actIndex].code = sigCode;
    dept.sigActivities[actIndex].description = sigDesc;

    if (!dept.techGroupActivities[actIndex]) {
      dept.techGroupActivities[actIndex] = { id: `tg-${Date.now()}`, code: tgCode, description: tgDesc };
    } else {
      dept.techGroupActivities[actIndex].code = tgCode;
      dept.techGroupActivities[actIndex].description = tgDesc;
    }

    if (!dept.ghopoActivities[actIndex]) {
      dept.ghopoActivities[actIndex] = { id: `gh-${Date.now()}`, code: ghopoCode, description: '' };
    } else {
      dept.ghopoActivities[actIndex].code = ghopoCode;
    }

    saveLocalCostCenterMapping(current);
  }
  return current;
}

export function deleteActivityFromDepartment(
  deptId: string,
  actIndex: number
): CostCenterActivityRow[] {
  const current = getLocalCostCenterMapping();
  const dept = current.find((d) => d.id === deptId);
  if (dept) {
    dept.sigActivities.splice(actIndex, 1);
    dept.techGroupActivities.splice(actIndex, 1);
    dept.ghopoActivities.splice(actIndex, 1);
    saveLocalCostCenterMapping(current);
  }
  return current;
}

// Backward-compatible alias
export const getLocalCostCenterData = getLocalCostCenterMapping;

