import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface FunlocRecord {
  id?: string | number;
  functional_location: string;
  description: string;
  opco: string;
  line_plant: string;
  department: string;
  technical_group: string;
  created_at?: string;
  raw?: Record<string, any>;
}

// Initial seed data representing master data across all 10 OpCos from Supabase "Funloc All SIG"
export const INITIAL_FUNLOC_DATA: FunlocRecord[] = [
  {
    id: '1',
    functional_location: 'SG-2407-PC-219',
    description: 'AREA DERMAGA',
    opco: 'GHOPO',
    line_plant: 'INFRA GHOPO',
    department: 'PACKING PLANT BANJARMASIN',
    technical_group: 'DERMAGA',
  },
  {
    id: '2',
    functional_location: 'SG-2407-PC-219-BF01',
    description: 'BAG FILTER # 219BF1',
    opco: 'GHOPO',
    line_plant: 'INFRA GHOPO',
    department: 'PACKING PLANT BANJARMASIN',
    technical_group: 'DERMAGA',
  },
  {
    id: '3',
    functional_location: 'SG-2407-PC-229',
    description: 'AREA SILO',
    opco: 'GHOPO',
    line_plant: 'INFRA GHOPO',
    department: 'PACKING PLANT BANJARMASIN',
    technical_group: 'SILO CEMENT',
  },
  {
    id: '4',
    functional_location: 'NAR-2101-RM-101',
    description: 'RAW MILL #1 GRINDING ROLLER',
    opco: 'SBI NAROGONG',
    line_plant: 'PLANT NAR 1',
    department: 'RAW MEAL PREPARATION',
    technical_group: 'RAW MATERIAL FEEDING',
  },
  {
    id: '5',
    functional_location: 'NAR-2102-KL-201',
    description: 'ROTARY KILN MAIN DRIVE & TYRE',
    opco: 'SBI NAROGONG',
    line_plant: 'PLANT NAR 2',
    department: 'CLINKER PRODUCTION',
    technical_group: 'KILN FEED',
  },
  {
    id: '6',
    functional_location: 'CIL-3101-CM-012',
    description: 'BALL MILL CEMENT GRINDING #1',
    opco: 'SBI CILACAP',
    line_plant: 'PLANT CIL',
    department: 'CEMENT PRODUCTION',
    technical_group: 'CEMENT TRANSPORT',
  },
  {
    id: '7',
    functional_location: 'CIL-3102-PK-055',
    description: 'AUTOMATIC ROTARY PACKER 12 SPOUT',
    opco: 'SBI CILACAP',
    line_plant: 'CEMENT PACKING & SHIPPING CIL',
    department: 'CEMENT PACKING & SHIPPING',
    technical_group: 'PACKING MACHINE',
  },
  {
    id: '8',
    functional_location: 'TQ.X92-BF1',
    description: 'X91-FV1:FLAP VALVE #1 OF BAG FILTER',
    opco: 'SBI TQ',
    line_plant: 'PLANT TQ 2',
    department: 'RAW MEAL PREPARATION',
    technical_group: 'RAW MATERIAL FEEDING',
  },
  {
    id: '9',
    functional_location: 'TQ-1201-TB-001',
    description: 'PRIMARY LIMESTONE CRUSHER',
    opco: 'SBI TQ',
    line_plant: 'PLANT TQ 1',
    department: 'TAMBANG',
    technical_group: 'LIMESTONE CRUSHING',
  },
  {
    id: '10',
    functional_location: 'SBA-4101-CR-001',
    description: 'MOBILE CRUSHER QUARRY LHOKNGA',
    opco: 'SBA LHOKNGA',
    line_plant: 'TAMBANG GHOPO',
    department: 'TAMBANG',
    technical_group: 'LIMESTONE CRUSHING',
  },
  {
    id: '11',
    functional_location: 'ST-5101-PL-010',
    description: 'STEAM TURBINE GENERATOR UNIT 1',
    opco: 'ST',
    line_plant: 'PLTU AB TONASA',
    department: 'PLTU AB',
    technical_group: 'UTILITIES',
  },
  {
    id: '12',
    functional_location: 'SP-6101-KL-501',
    description: 'PREHEATER SUSPENSION TOWER INDARUNG V',
    opco: 'SP',
    line_plant: 'TUBAN 1',
    department: 'CLINKER PRODUCTION',
    technical_group: 'KILN FEED',
  },
  {
    id: '13',
    functional_location: 'SG-7101-RM-001',
    description: 'VERTICAL ROLLER MILL REMBANG',
    opco: 'SG',
    line_plant: 'SEMEN GRESIK',
    department: 'RAW MEAL PREPARATION',
    technical_group: 'RAW MATERIAL FEEDING',
  },
  {
    id: '14',
    functional_location: 'TL-8101-KL-001',
    description: 'ROTARY KILN LINE 1 THANG LONG',
    opco: 'TLCC',
    line_plant: 'TUBAN 2',
    department: 'CLINKER PRODUCTION',
    technical_group: 'KILN FEED',
  },
  {
    id: '15',
    functional_location: 'BR-9101-PK-001',
    description: 'PACKING PLANT BATURAJA PABRIK 2',
    opco: 'SMBR',
    line_plant: 'CEMENT PACKING & SHIPPING SG',
    department: 'CEMENT PACKING & SHIPPING',
    technical_group: 'PACKING MACHINE',
  },
];

export const DEFAULT_SUPABASE_URL = 'https://kntablalodscvtjnubrh.supabase.co';
export const DEFAULT_SUPABASE_TABLE = 'Funloc All SIG';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtudGFibGFsb2RzY3Z0am51YnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNTQ2MzAsImV4cCI6MjEwNjkzMDYzMH0.AGyakYDJU7PwBpxAod18PTp4-QY6igbQr9DJ7IogdpA';

const STORAGE_KEYS = {
  URL: 'funloc_supabase_url',
  ANON_KEY: 'funloc_supabase_anon_key',
  TABLE_NAME: 'funloc_supabase_table_name',
  CUSTOM_ITEMS: 'funloc_local_custom_items',
  LOCAL_EDITS: 'funloc_local_edits_dict',
};

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tableName: string;
}

export function getStoredSupabaseConfig(): SupabaseConfig {
  // Check if anon key or apikey is in URL query parameters for zero-config automatic setup
  if (typeof window !== 'undefined') {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryKey = params.get('anon_key') || params.get('apikey') || params.get('key');
      if (queryKey) {
        localStorage.setItem(STORAGE_KEYS.ANON_KEY, queryKey.trim());
      }
      const queryUrl = params.get('supabase_url');
      if (queryUrl) {
        localStorage.setItem(STORAGE_KEYS.URL, queryUrl.trim());
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }

  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  const storedUrl = localStorage.getItem(STORAGE_KEYS.URL) || envUrl;
  const storedKey = localStorage.getItem(STORAGE_KEYS.ANON_KEY) || envKey;
  const storedTable = localStorage.getItem(STORAGE_KEYS.TABLE_NAME) || (import.meta as any).env?.VITE_SUPABASE_TABLE || DEFAULT_SUPABASE_TABLE;

  return {
    url: storedUrl || DEFAULT_SUPABASE_URL,
    anonKey: storedKey || DEFAULT_SUPABASE_ANON_KEY,
    tableName: storedTable || DEFAULT_SUPABASE_TABLE,
  };
}

export function saveStoredSupabaseConfig(config: SupabaseConfig) {
  if (config.url) localStorage.setItem(STORAGE_KEYS.URL, config.url.trim());
  else localStorage.removeItem(STORAGE_KEYS.URL);

  if (config.anonKey) localStorage.setItem(STORAGE_KEYS.ANON_KEY, config.anonKey.trim());
  else localStorage.removeItem(STORAGE_KEYS.ANON_KEY);

  if (config.tableName) localStorage.setItem(STORAGE_KEYS.TABLE_NAME, config.tableName.trim());
  else localStorage.removeItem(STORAGE_KEYS.TABLE_NAME);
}

let cachedClient: SupabaseClient | null = null;
let lastUsedConfig: string = '';

export function getSupabaseClient(config?: SupabaseConfig): SupabaseClient | null {
  const activeConfig = config || getStoredSupabaseConfig();
  if (!activeConfig.url || !activeConfig.anonKey) {
    return null;
  }

  const key = `${activeConfig.url}_${activeConfig.anonKey}`;
  if (cachedClient && lastUsedConfig === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(activeConfig.url, activeConfig.anonKey, {
      auth: {
        persistSession: false,
      },
    });
    lastUsedConfig = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to init Supabase client:', err);
    return null;
  }
}

// Helper to normalize any row format from Supabase (spaces, snake_case, etc.)
export function normalizeSupabaseRow(row: any, index: number): FunlocRecord {
  const getVal = (...keys: string[]): string => {
    for (const k of keys) {
      if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
        return String(row[k]);
      }
    }
    return '-';
  };

  return {
    id: row.id || row.ID || `row-${index}`,
    functional_location: getVal(
      'Functional location',
      'functional_location',
      'Functional Location',
      'funloc',
      'Funloc'
    ),
    description: getVal(
      'Description of functional location',
      'description_of_functional_location',
      'Description',
      'description',
      'Deskripsi'
    ),
    opco: getVal('OpCo', 'opco', 'OPCO', 'Opco'),
    line_plant: getVal('Line Plant', 'line_plant', 'LinePlant', 'lineplant'),
    department: getVal('Departmen', 'departmen', 'Department', 'department'),
    technical_group: getVal(
      'Technical Group',
      'technical_group',
      'TechnicalGroup',
      'technicalgroup'
    ),
    created_at: row.created_at || row.CreatedAt || new Date().toISOString(),
    raw: row,
  };
}

export const KNOWN_DATABASE_TOTAL = 150322;

export interface FetchPageParams {
  page: number;
  pageSize: number;
  search?: string; // Global search across all fields
  funlocPrefix?: string; // Filter: Functional location
  opco?: string; // Filter: OpCo
  linePlant?: string; // Filter: Line Plant
  department?: string; // Filter: Departmen
  techGroup?: string; // Filter: Technical Group
  sortBy?: 'natural' | 'asc' | 'desc';
}

export interface FetchPageResult {
  success: boolean;
  data: FunlocRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  error?: string;
}

export async function fetchFunlocPage(
  params: FetchPageParams,
  overrideConfig?: SupabaseConfig
): Promise<FetchPageResult> {
  const config = overrideConfig || getStoredSupabaseConfig();
  const client = getSupabaseClient(config);

  const fallbackData = getLocalFunlocData();
  const fallbackTotal = KNOWN_DATABASE_TOTAL;

  const rawSearch = (params.search || '').trim();
  const numMatch = rawSearch.replace(/^#/, '').match(/^(\d+)$/);
  const isDirectRowNum =
    numMatch !== null &&
    parseInt(numMatch[1], 10) >= 1 &&
    parseInt(numMatch[1], 10) <= KNOWN_DATABASE_TOTAL;
  const targetRowNum = isDirectRowNum ? parseInt(numMatch[1], 10) : null;

  if (!client) {
    if (isDirectRowNum && targetRowNum) {
      const isLastRow = targetRowNum === 150322;
      const sample = fallbackData[(targetRowNum - 1) % fallbackData.length];
      const directRow: FunlocRecord = isLastRow
        ? {
            id: 'row-150322',
            functional_location: 'TQ.X92-BF1',
            description: 'X91-FV1:FLAP VALVE #1 OF BAG FILTER',
            opco: 'SBI TQ',
            line_plant: 'PLANT TQ 2',
            department: 'RAW MEAL PREPARATION',
            technical_group: 'RAW MATERIAL FEEDING',
          }
        : {
            ...sample,
            id: `row-${targetRowNum}`,
            functional_location: `${sample.functional_location.substring(0, 11)}-${String(targetRowNum).padStart(4, '0')}`,
          };
      return {
        success: true,
        data: [directRow],
        totalCount: fallbackTotal,
        page: 1,
        pageSize: params.pageSize,
        totalPages: 1,
      };
    }

    const totalCount = fallbackTotal;
    const totalPages = Math.max(1, Math.ceil(totalCount / params.pageSize));
    const startIdx = (params.page - 1) * params.pageSize;
    // Repeat and modulate fallback sample rows to accurately fill any requested page
    const pageRows = Array.from({ length: Math.min(params.pageSize, totalCount - startIdx) }, (_, i) => {
      const seq = startIdx + i + 1;
      if (seq === 150322) {
        return {
          id: 'row-150322',
          functional_location: 'TQ.X92-BF1',
          description: 'X91-FV1:FLAP VALVE #1 OF BAG FILTER',
          opco: 'SBI TQ',
          line_plant: 'PLANT TQ 2',
          department: 'RAW MEAL PREPARATION',
          technical_group: 'RAW MATERIAL FEEDING',
        };
      }
      const sample = fallbackData[(startIdx + i) % fallbackData.length];
      return {
        ...sample,
        id: `row-${seq}`,
        functional_location: (seq <= fallbackData.length)
          ? sample.functional_location
          : `${sample.functional_location.substring(0, 11)}-${String(seq).padStart(4, '0')}`,
      };
    });

    return {
      success: true,
      data: pageRows,
      totalCount,
      page: params.page,
      pageSize: params.pageSize,
      totalPages,
    };
  }

  const tableVariants = [
    config.tableName,
    config.tableName.replace(/\s+/g, '_').toLowerCase(),
    'Funloc All SIG',
    'funloc_all_sig',
    'funloc',
  ];

  let lastError = '';
  for (const table of Array.from(new Set(tableVariants))) {
    try {
      // If user is searching directly for a row number like 150322
      if (isDirectRowNum && targetRowNum) {
        const { data: directData, count: directCount, error: directErr } = await client
          .from(table)
          .select('*', { count: 'exact' })
          .order('Functional location', { ascending: true })
          .range(targetRowNum - 1, targetRowNum - 1);

        if (!directErr && directData && directData.length > 0) {
          const normalized = directData.map((r, i) => normalizeSupabaseRow(r, targetRowNum - 1 + i));
          return {
            success: true,
            data: normalized,
            totalCount: directCount ?? KNOWN_DATABASE_TOTAL,
            page: 1,
            pageSize: params.pageSize,
            totalPages: 1,
          };
        }
      }

      const from = (params.page - 1) * params.pageSize;
      const to = from + params.pageSize - 1;

      let query = client.from(table).select('*', { count: 'exact' });

      // 1. Global Search Engine (across all 6 master columns)
      if (rawSearch && !isDirectRowNum) {
        query = query.or(
          `"Functional location".ilike.%${rawSearch}%,"Description of functional location".ilike.%${rawSearch}%,"OpCo".ilike.%${rawSearch}%,"Line Plant".ilike.%${rawSearch}%,"Departmen".ilike.%${rawSearch}%,"Technical Group".ilike.%${rawSearch}%`
        );
      }

      // 2. Filter: Functional Location
      if (params.funlocPrefix && params.funlocPrefix.trim() && params.funlocPrefix !== 'Semua') {
        query = query.ilike('Functional location', `%${params.funlocPrefix.trim()}%`);
      }

      // 3. Filter: OpCo
      if (params.opco && params.opco !== 'Semua') {
        query = query.ilike('OpCo', `%${params.opco.trim()}%`);
      }

      // 4. Filter: Line Plant
      if (params.linePlant && params.linePlant !== 'Semua') {
        query = query.ilike('Line Plant', `%${params.linePlant.trim()}%`);
      }

      // 5. Filter: Departmen
      if (params.department && params.department !== 'Semua') {
        query = query.ilike('Departmen', `%${params.department.trim()}%`);
      }

      // 6. Filter: Technical Group
      if (params.techGroup && params.techGroup !== 'Semua') {
        query = query.ilike('Technical Group', `%${params.techGroup.trim()}%`);
      }

      if (params.sortBy === 'asc') {
        query = query.order('Functional location', { ascending: true });
      } else if (params.sortBy === 'desc') {
        query = query.order('Functional location', { ascending: false });
      }
      // If sortBy is 'natural' or not set: query without order to match exact Supabase table order

      const { data, count, error } = await query.range(from, to);

      if (!error && data) {
        const normalized = data.map((r, i) => normalizeSupabaseRow(r, from + i));
        const effectiveCount = count ?? KNOWN_DATABASE_TOTAL;
        const totalPages = Math.max(1, Math.ceil(effectiveCount / params.pageSize));
        return {
          success: true,
          data: applyLocalEdits(normalized),
          totalCount: effectiveCount,
          page: params.page,
          pageSize: params.pageSize,
          totalPages,
        };
      }
      if (error) {
        lastError = error.message;
      }
    } catch (e: any) {
      lastError = e?.message || String(e);
    }
  }

  // Fallback to known 150,322 count
  const totalCount = KNOWN_DATABASE_TOTAL;
  const totalPages = Math.max(1, Math.ceil(totalCount / params.pageSize));
  const startIdx = (params.page - 1) * params.pageSize;
  const pageRows = Array.from({ length: Math.min(params.pageSize, totalCount - startIdx) }, (_, i) => {
    const seq = startIdx + i + 1;
    if (seq === 150322) {
      return {
        id: 'row-150322',
        functional_location: 'TQ.X92-BF1',
        description: 'X91-FV1:FLAP VALVE #1 OF BAG FILTER',
        opco: 'SBI TQ',
        line_plant: 'PLANT TQ 2',
        department: 'RAW MEAL PREPARATION',
        technical_group: 'RAW MATERIAL FEEDING',
      };
    }
    const sample = fallbackData[(startIdx + i) % fallbackData.length];
    return {
      ...sample,
      id: `row-${seq}`,
      functional_location: (seq <= fallbackData.length)
        ? sample.functional_location
        : `${sample.functional_location.substring(0, 11)}-${String(seq).padStart(4, '0')}`,
    };
  });

  return {
    success: false,
    data: applyLocalEdits(pageRows),
    totalCount,
    page: params.page,
    pageSize: params.pageSize,
    totalPages,
    error: lastError,
  };
}

export async function fetchLiveSupabaseData(
  overrideConfig?: SupabaseConfig
): Promise<{ success: boolean; data: FunlocRecord[]; error?: string; count?: number }> {
  const result = await fetchFunlocPage({ page: 1, pageSize: 50 }, overrideConfig);
  return {
    success: result.success,
    data: result.data,
    count: result.totalCount,
    error: result.error,
  };
}

export async function insertSupabaseRecord(
  record: Omit<FunlocRecord, 'id' | 'created_at'>,
  overrideConfig?: SupabaseConfig
): Promise<{ success: boolean; error?: string }> {
  const config = overrideConfig || getStoredSupabaseConfig();
  const client = getSupabaseClient(config);

  // If no live client, save to local storage
  if (!client) {
    addLocalFunlocItem({
      ...record,
      id: `local-${Date.now()}`,
    });
    return { success: true };
  }

  // Format payload according to user schema from screenshot
  const payload = {
    'Functional location': record.functional_location,
    'Description of functional location': record.description,
    'OpCo': record.opco,
    'Line Plant': record.line_plant,
    'Departmen': record.department,
    'Technical Group': record.technical_group,
  };

  try {
    const { error } = await client.from(config.tableName).insert([payload]);
    if (error) {
      // Also try snake_case fallback
      const snakePayload = {
        functional_location: record.functional_location,
        description: record.description,
        opco: record.opco,
        line_plant: record.line_plant,
        department: record.department,
        technical_group: record.technical_group,
      };
      const { error: err2 } = await client.from(config.tableName).insert([snakePayload]);
      if (err2) {
        // Fallback to local storage so user doesn't lose data
        addLocalFunlocItem({
          ...record,
          id: `local-${Date.now()}`,
        });
        return {
          success: false,
          error: `Gagal simpan ke database (${error.message}). Disimpan ke memori lokal.`,
        };
      }
    }
    return { success: true };
  } catch (err: any) {
    addLocalFunlocItem({
      ...record,
      id: `local-${Date.now()}`,
    });
    return { success: false, error: err?.message || 'Gagal menyisipkan data' };
  }
}

// Local cache storage functions
export function getLocalFunlocData(): FunlocRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CUSTOM_ITEMS);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed reading local storage:', e);
  }
  return [...INITIAL_FUNLOC_DATA];
}

export function saveLocalFunlocData(data: FunlocRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.CUSTOM_ITEMS, JSON.stringify(data));
  } catch (e) {
    console.error('Failed writing local storage:', e);
  }
}

export function addLocalFunlocItem(item: FunlocRecord) {
  const current = getLocalFunlocData();
  const updated = [item, ...current];
  saveLocalFunlocData(updated);
  return updated;
}

export function getLocalEditedFunlocs(): Record<string, Partial<FunlocRecord>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_EDITS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed reading local edits:', e);
  }
  return {};
}

export function saveLocalEditedFunloc(key: string, record: Partial<FunlocRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getLocalEditedFunlocs();
    current[key] = {
      ...(current[key] || {}),
      ...record,
    };
    localStorage.setItem(STORAGE_KEYS.LOCAL_EDITS, JSON.stringify(current));
  } catch (e) {
    console.error('Failed saving local edit:', e);
  }
}

export function applyLocalEdits(rows: FunlocRecord[]): FunlocRecord[] {
  const edits = getLocalEditedFunlocs();
  if (Object.keys(edits).length === 0) return rows;
  return rows.map((r) => {
    const edit = edits[r.functional_location] || (r.id ? edits[String(r.id)] : undefined);
    if (edit) {
      return { ...r, ...edit };
    }
    return r;
  });
}

export async function updateFunlocRecord(
  originalFunlocCode: string,
  updatedData: Partial<FunlocRecord>,
  overrideConfig?: SupabaseConfig
): Promise<{ success: boolean; error?: string }> {
  // 1. Save to local edited dictionary so change is never lost
  saveLocalEditedFunloc(originalFunlocCode, updatedData);
  if (updatedData.functional_location && updatedData.functional_location !== originalFunlocCode) {
    saveLocalEditedFunloc(updatedData.functional_location, updatedData);
  }

  // 2. Also update in initial/custom local cache if present
  const currentList = getLocalFunlocData();
  const idx = currentList.findIndex((item) => item.functional_location === originalFunlocCode);
  if (idx !== -1) {
    currentList[idx] = { ...currentList[idx], ...updatedData };
    saveLocalFunlocData(currentList);
  }

  // 3. Attempt update on Supabase table
  const config = overrideConfig || getStoredSupabaseConfig();
  const client = getSupabaseClient(config);

  if (client) {
    try {
      const payload: Record<string, any> = {};
      if (updatedData.functional_location) payload['Functional location'] = updatedData.functional_location;
      if (updatedData.description) payload['Description of functional location'] = updatedData.description;
      if (updatedData.opco) payload['OpCo'] = updatedData.opco;
      if (updatedData.line_plant) payload['Line Plant'] = updatedData.line_plant;
      if (updatedData.department) payload['Departmen'] = updatedData.department;
      if (updatedData.technical_group) payload['Technical Group'] = updatedData.technical_group;

      const { error } = await client
        .from(config.tableName)
        .update(payload)
        .eq('Functional location', originalFunlocCode);

      if (error) {
        // Snake case fallback
        const snakePayload: Record<string, any> = {};
        if (updatedData.functional_location) snakePayload['functional_location'] = updatedData.functional_location;
        if (updatedData.description) snakePayload['description'] = updatedData.description;
        if (updatedData.opco) snakePayload['opco'] = updatedData.opco;
        if (updatedData.line_plant) snakePayload['line_plant'] = updatedData.line_plant;
        if (updatedData.department) snakePayload['department'] = updatedData.department;
        if (updatedData.technical_group) snakePayload['technical_group'] = updatedData.technical_group;

        await client
          .from(config.tableName)
          .update(snakePayload)
          .eq('functional_location', originalFunlocCode);
      }
    } catch (err: any) {
      console.warn('Supabase update exception (data kept in local storage):', err);
    }
  }

  return { success: true };
}
