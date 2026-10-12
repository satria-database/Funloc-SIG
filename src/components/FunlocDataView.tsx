import React, { useState, useMemo, useEffect } from 'react';
import {
  FunlocRecord,
  insertSupabaseRecord,
  updateFunlocRecord,
  fetchFunlocPage,
  KNOWN_DATABASE_TOTAL,
} from '../lib/supabase.ts';
import {
  Search,
  Database,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  Copy,
  Check,
  CheckCircle2,
  Building2,
  Factory,
  Wrench,
  Pencil,
  Filter,
  ChevronDown,
} from 'lucide-react';

interface FunlocDataViewProps {
  data: FunlocRecord[];
  isLoading: boolean;
  onRefresh: () => void;
  isConnectedLive: boolean;
  tableName: string;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  initialFunlocFilter?: string;
}

export const FunlocDataView: React.FC<FunlocDataViewProps> = ({
  data,
  isLoading: isExternalLoading,
  onRefresh: onExternalRefresh,
  tableName,
  isEditMode,
  onToggleEditMode,
  initialFunlocFilter,
}) => {
  // Global Search & 5-Category Filter State
  const [searchTerm, setSearchTerm] = useState(''); // Search Engine Global (all 6 columns)
  const [showSpecificFilters, setShowSpecificFilters] = useState(Boolean(initialFunlocFilter)); // Default hide filter spesifik (klik untuk membuka)
  const [filterFunloc, setFilterFunloc] = useState(initialFunlocFilter || ''); // 1. Functional Location
  const [filterOpCo, setFilterOpCo] = useState('Semua'); // 2. OpCo
  const [filterLinePlant, setFilterLinePlant] = useState('Semua'); // 3. Line Plant
  const [filterDepartment, setFilterDepartment] = useState('Semua'); // 4. Departmen
  const [filterTechGroup, setFilterTechGroup] = useState('Semua'); // 5. Technical Group

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<FunlocRecord | null>(null);

  // Edit Mode & Editing Item State (Pastikan semua data bisa diedit)
  const [internalEditMode, setInternalEditMode] = useState(false);
  const effectiveEditMode = isEditMode !== undefined ? isEditMode : internalEditMode;
  const toggleEdit = onToggleEditMode || (() => setInternalEditMode((prev) => !prev));

  const [editingRecord, setEditingRecord] = useState<FunlocRecord | null>(null);
  const [originalCode, setOriginalCode] = useState<string>('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    functional_location: '',
    description: '',
    opco: 'GHOPO',
    line_plant: 'INFRA GHOPO',
    department: 'PACKING PLANT BANJARMASIN',
    technical_group: 'DERMAGA',
  });

  // Server-side / Database Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50); // Default 50 items per page
  const [jumpPageInput, setJumpPageInput] = useState<string>('');
  const [pageRows, setPageRows] = useState<FunlocRecord[]>(data);
  const [totalCount, setTotalCount] = useState<number>(KNOWN_DATABASE_TOTAL);
  const [isFetchingPage, setIsFetchingPage] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'natural' | 'asc' | 'desc'>('natural');

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({
    functional_location: '',
    description: '',
    opco: 'GHOPO',
    line_plant: 'INFRA GHOPO',
    department: 'PACKING PLANT BANJARMASIN',
    technical_group: 'DERMAGA',
  });
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    if (initialFunlocFilter) {
      setFilterFunloc(initialFunlocFilter);
    }
  }, [initialFunlocFilter]);

  // Reset to page 1 when search or any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    filterFunloc,
    filterOpCo,
    filterLinePlant,
    filterDepartment,
    filterTechGroup,
    pageSize,
    sortBy,
  ]);

  // Load paginated data from Supabase
  const loadActivePageData = React.useCallback(async () => {
    setIsFetchingPage(true);
    const res = await fetchFunlocPage({
      page: currentPage,
      pageSize: pageSize === -1 ? 1000 : pageSize,
      search: searchTerm,
      funlocPrefix: filterFunloc,
      opco: filterOpCo,
      linePlant: filterLinePlant,
      department: filterDepartment,
      techGroup: filterTechGroup,
      sortBy: sortBy,
    });

    if (res.data && res.data.length > 0) {
      setPageRows(res.data);
      setTotalCount(res.totalCount || KNOWN_DATABASE_TOTAL);
    }
    setIsFetchingPage(false);
  }, [
    currentPage,
    pageSize,
    searchTerm,
    filterFunloc,
    filterOpCo,
    filterLinePlant,
    filterDepartment,
    filterTechGroup,
    sortBy,
  ]);

  useEffect(() => {
    loadActivePageData();
  }, [loadActivePageData]);

  // Dynamic filter dropdown options
  const opcoOptions = useMemo(() => {
    const list = Array.from(new Set(data.map((d) => d.opco?.trim()).filter(Boolean)));
    const defaults = ['GHOPO', 'SMBR', 'SBI TQ', 'SBI', 'SP', 'ST'];
    return Array.from(new Set([...list, ...defaults])).filter((x) => x !== 'Semua' && x !== '-');
  }, [data]);

  const linePlantOptions = useMemo(() => {
    const list = Array.from(new Set(data.map((d) => d.line_plant?.trim()).filter(Boolean)));
    const defaults = [
      'INFRA GHOPO',
      'BATURAJA 1',
      'BATURAJA 2',
      'PLANT TQ 1',
      'PLANT TQ 2',
      'TUBAN PLANT',
      'GRESIK PLANT',
      'PADANG PLANT',
      'TONASA PLANT',
    ];
    return Array.from(new Set([...list, ...defaults])).filter((x) => x !== 'Semua' && x !== '-');
  }, [data]);

  const departmentOptions = useMemo(() => {
    const list = Array.from(new Set(data.map((d) => d.department?.trim()).filter(Boolean)));
    const defaults = [
      'PACKING PLANT BANJARMASIN',
      'CEMENT PRODUCTION',
      'UTILITIES & ELECTRICAL',
      'RAW MEAL PREPARATION',
      'GRINDING PLANT CIGADING',
      'TUBAN PLANT',
      'GRESIK PLANT',
      'PADANG PLANT',
      'TONASA PLANT',
    ];
    return Array.from(new Set([...list, ...defaults])).filter((x) => x !== 'Semua' && x !== '-');
  }, [data]);

  const techGroupOptions = useMemo(() => {
    const list = Array.from(new Set(data.map((d) => d.technical_group?.trim()).filter(Boolean)));
    const defaults = [
      'DERMAGA',
      'SILO CEMENT',
      'PACKING PLANT',
      'RAW MATERIAL FEEDING',
      'KILN & COAL MILL',
      'RAW MILL',
      'CRUSHER',
      'UTILITY & INFRA',
    ];
    return Array.from(new Set([...list, ...defaults])).filter((x) => x !== 'Semua' && x !== '-');
  }, [data]);

  const activeFilterCount =
    (searchTerm.trim() ? 1 : 0) +
    (filterFunloc.trim() ? 1 : 0) +
    (filterOpCo !== 'Semua' ? 1 : 0) +
    (filterLinePlant !== 'Semua' ? 1 : 0) +
    (filterDepartment !== 'Semua' ? 1 : 0) +
    (filterTechGroup !== 'Semua' ? 1 : 0);

  const handleResetAllFilters = () => {
    setSearchTerm('');
    setFilterFunloc('');
    setFilterOpCo('Semua');
    setFilterLinePlant('Semua');
    setFilterDepartment('Semua');
    setFilterTechGroup('Semua');
    setCurrentPage(1);
  };

  // Pagination Calculations
  const totalItems = totalCount;
  const effectivePageSize = pageSize === -1 ? 1000 : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize));
  const activePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (activePage - 1) * effectivePageSize;
  const endIndex = Math.min(startIndex + pageRows.length, totalItems);

  // Smart Pagination Number Pills (e.g. 1, 2, 3... 3007)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (activePage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (activePage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', activePage - 1, activePage, activePage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpPageInput('');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    const headers = [
      'Functional location',
      'Description of functional location',
      'OpCo',
      'Line Plant',
      'Departmen',
      'Technical Group',
    ];
    const rows = pageRows.map((d) => [
      `"${d.functional_location}"`,
      `"${d.description}"`,
      `"${d.opco}"`,
      `"${d.line_plant}"`,
      `"${d.department}"`,
      `"${d.technical_group}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Funloc_SIG_Export_Hal_${activePage}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionNotice(`Data halaman ${activePage} berhasil diekspor ke CSV`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleStartEdit = (item: FunlocRecord) => {
    setEditingRecord(item);
    setOriginalCode(item.functional_location);
    setEditForm({
      functional_location: item.functional_location,
      description: item.description,
      opco: item.opco,
      line_plant: item.line_plant,
      department: item.department,
      technical_group: item.technical_group,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord || !editForm.functional_location.trim() || !editForm.description.trim()) return;

    setIsSavingEdit(true);
    const res = await updateFunlocRecord(originalCode, editForm);
    setIsSavingEdit(false);

    // Update in local page rows immediately
    setPageRows((prev) =>
      prev.map((r) =>
        r.functional_location === originalCode || r.id === editingRecord.id
          ? { ...r, ...editForm }
          : r
      )
    );

    setActionNotice(`Data ${editForm.functional_location} berhasil diperbarui!`);
    setEditingRecord(null);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.functional_location.trim() || !addForm.description.trim()) return;

    setIsSubmitting(true);
    const res = await insertSupabaseRecord(addForm);
    setIsSubmitting(false);

    if (res.success) {
      setActionNotice(`Data ${addForm.functional_location} berhasil ditambahkan!`);
      setShowAddModal(false);
      setAddForm({
        functional_location: '',
        description: '',
        opco: 'GHOPO',
        line_plant: 'INFRA GHOPO',
        department: 'PACKING PLANT BANJARMASIN',
        technical_group: 'DERMAGA',
      });
      loadActivePageData();
      onExternalRefresh();
    } else {
      setActionNotice(res.error || 'Gagal menambahkan data');
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  const isWorking = isExternalLoading || isFetchingPage;

  return (
    <div className="w-full my-2 select-none">
      <div className="skeuo-curved-shadow w-full">
        <div className="skeuo-panel-gloss rounded-lg p-4 sm:p-6 border border-[#b8bfc8] w-full">
          {/* Top Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#cbd1d8]">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-[#2e3541] text-emerald-400 border border-white/20">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#2d343f] tracking-tight">
                    Data Master Functional Location (Funloc SIG)
                  </h3>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  loadActivePageData();
                  onExternalRefresh();
                }}
                disabled={isWorking}
                className="skeuo-btn-convex px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 text-[#373e48]"
                title="Sinkronisasi data otomatis dengan database"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isWorking ? 'animate-spin text-emerald-600' : ''}`} />
                <span>{isWorking ? 'Sinkronisasi...' : 'Sinkronisasi Data'}</span>
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="skeuo-btn-convex px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 text-[#1f252f] bg-[#eef1f5]"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tambah Funloc</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="skeuo-btn-convex px-3 py-1.5 text-xs text-[#525a66] flex items-center gap-1.5"
                title="Ekspor ke format CSV / Excel"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#4e7d58]" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* Action Notification */}
          {actionNotice && (
            <div className="mt-3 p-2.5 bg-[#252b34] text-white text-xs rounded-md shadow flex items-center justify-between border border-white/20 animate-fade-in">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {actionNotice}
              </span>
              <button
                onClick={() => setActionNotice(null)}
                className="text-white/60 hover:text-white px-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* SECTION 1: GLOBAL SEARCH ENGINE (Mencakup Semua Kolom) */}
          <div className="my-3.5">
            <div className="relative w-full">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#565f6c] pointer-events-none flex items-center gap-1.5">
                <Search className="w-4 h-4 text-emerald-700" />
                <span className="text-[10.5px] uppercase font-bold tracking-wider text-[#636d7a] hidden sm:inline">
                  Search Global:
                </span>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ketik kata kunci apa saja (mencakup Functional Location, Deskripsi, OpCo, Line Plant, Departemen, Technical Group)..."
                className="skeuo-inset-input w-full pl-9 sm:pl-36 pr-8 py-2.5 text-xs text-[#282e37] placeholder-[#808995] font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7f8894] hover:text-black text-xs font-bold p-1 cursor-pointer"
                  title="Hapus pencarian global"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* SECTION 2: 5-CATEGORY COMPREHENSIVE FILTER PANEL (DEFAULT HIDE / ACCORDION) */}
          <div className="rounded-lg bg-gradient-to-b from-[#e8ecf1] to-[#dce1e7] border border-[#bcc3cc] shadow-xs mb-4 overflow-hidden">
            {/* Filter Header & Toggle Button */}
            <div
              onClick={() => setShowSpecificFilters((prev) => !prev)}
              className="p-3 sm:p-3.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-black/5 transition-colors select-none"
              title={showSpecificFilters ? 'Klik untuk menyembunyikan filter spesifik' : 'Klik untuk membuka filter spesifik'}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-[#2d3440] text-xs tracking-wide">
                  Filter Spesifik:
                </span>
                {activeFilterCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-600 text-white shadow-xs">
                    {activeFilterCount} filter aktif
                  </span>
                ) : (
                  <span className="text-[11px] text-[#717a86]">
                    {showSpecificFilters
                      ? '(Pilih satu atau kombinasikan filter di bawah)'
                      : '(Klik untuk membuka filter)'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResetAllFilters();
                    }}
                    className="text-[11px] text-rose-700 hover:text-rose-900 font-bold hover:underline flex items-center gap-1 cursor-pointer mr-1"
                  >
                    ✕ Reset Semua ({activeFilterCount})
                  </button>
                )}
                <div className="skeuo-btn-convex px-2.5 py-1 text-xs text-[#3b434f] font-semibold flex items-center gap-1">
                  <span>{showSpecificFilters ? 'Sembunyikan Filter' : 'Buka Filter'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[#555d6a] transition-transform duration-200 ${
                      showSpecificFilters ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Filter Inputs Grid (Hanya terbuka jika showSpecificFilters = true) */}
            {showSpecificFilters && (
              <div className="p-3 sm:p-3.5 pt-2 border-t border-[#cbd1da] bg-[#e4e8ee]/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs">
                  {/* 1. Filter Functional Location */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#454d59] mb-1">
                      1. Functional Location
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={filterFunloc}
                        onChange={(e) => setFilterFunloc(e.target.value)}
                        placeholder="Kode (SG-2407, TQ...)"
                        className="skeuo-inset-input w-full px-2.5 pr-6 py-1.5 text-xs text-[#2a303a] font-mono bg-white"
                      />
                      {filterFunloc && (
                        <button
                          onClick={() => setFilterFunloc('')}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#7d8692] hover:text-black text-[11px] p-0.5"
                          title="Hapus filter kode"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 2. Filter OpCo */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#454d59] mb-1">
                      2. OpCo
                    </label>
                    <select
                      value={filterOpCo}
                      onChange={(e) => setFilterOpCo(e.target.value)}
                      className="skeuo-inset-input w-full px-2.5 py-1.5 text-xs text-[#2a303a] font-semibold cursor-pointer bg-white"
                    >
                      <option value="Semua">Semua OpCo</option>
                      {opcoOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Line Plant */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#454d59] mb-1">
                      3. Line Plant
                    </label>
                    <select
                      value={filterLinePlant}
                      onChange={(e) => setFilterLinePlant(e.target.value)}
                      className="skeuo-inset-input w-full px-2.5 py-1.5 text-xs text-[#2a303a] cursor-pointer bg-white"
                    >
                      <option value="Semua">Semua Line Plant</option>
                      {linePlantOptions.map((lp) => (
                        <option key={lp} value={lp}>
                          {lp}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 4. Filter Departemen */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#454d59] mb-1">
                      4. Departemen
                    </label>
                    <select
                      value={filterDepartment}
                      onChange={(e) => setFilterDepartment(e.target.value)}
                      className="skeuo-inset-input w-full px-2.5 py-1.5 text-xs text-[#2a303a] cursor-pointer bg-white"
                    >
                      <option value="Semua">Semua Departemen</option>
                      {departmentOptions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 5. Filter Technical Group */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#454d59] mb-1">
                      5. Technical Group
                    </label>
                    <select
                      value={filterTechGroup}
                      onChange={(e) => setFilterTechGroup(e.target.value)}
                      className="skeuo-inset-input w-full px-2.5 py-1.5 text-xs text-[#2a303a] cursor-pointer bg-white"
                    >
                      <option value="Semua">Semua Technical Group</option>
                      {techGroupOptions.map((tg) => (
                        <option key={tg} value={tg}>
                          {tg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table Container with Freeze Pane Header (Sticky Header) */}
          <div className="border border-[#b5bcc6] rounded-lg overflow-hidden bg-white/90 shadow-inner">
            <div className="overflow-x-auto max-h-[68vh] overflow-y-auto relative scroll-smooth">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-20 shadow-sm">
                  <tr className="bg-gradient-to-b from-[#e5e9ee] to-[#d6dbe2] text-[#424954] border-b border-[#bcc2cb] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3 border-r border-[#cad0da] w-14 text-center sticky top-0 bg-[#dde2e9] z-20">#</th>
                    {/* Functional Location (Diperkecil + Interaktif Urutan) */}
                    <th
                      onClick={() => {
                        setSortBy((prev) => (prev === 'natural' ? 'asc' : prev === 'asc' ? 'desc' : 'natural'));
                        setCurrentPage(1);
                      }}
                      className="py-2.5 px-2.5 border-r border-[#cad0da] w-40 min-w-[145px] max-w-[175px] cursor-pointer hover:bg-black/5 select-none transition-colors sticky top-0 bg-[#dde2e9] z-20"
                      title="Klik untuk mengubah urutan (Standar / A-Z / Z-A)"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>Functional Location</span>
                        <span
                          className={`text-[9.5px] px-1 py-0.2 rounded font-mono font-bold shrink-0 ${
                            sortBy === 'natural'
                              ? 'bg-[#cbd2dc] text-[#2d3440]'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {sortBy === 'natural' ? 'Standar' : sortBy === 'asc' ? 'A→Z ↑' : 'Z→A ↓'}
                        </span>
                      </div>
                    </th>
                    <th className="py-2.5 px-3 border-r border-[#cad0da] min-w-[240px] sticky top-0 bg-[#dde2e9] z-20">
                      Description of Functional Location
                    </th>
                    {/* OpCo (Dilebarkan) */}
                    <th className="py-2.5 px-4 border-r border-[#cad0da] w-48 min-w-[170px] text-center sticky top-0 bg-[#dde2e9] z-20">
                      OpCo
                    </th>
                    <th className="py-2.5 px-3 border-r border-[#cad0da] min-w-[130px] sticky top-0 bg-[#dde2e9] z-20">Line Plant</th>
                    <th className="py-2.5 px-3 border-r border-[#cad0da] min-w-[200px] sticky top-0 bg-[#dde2e9] z-20">Departmen</th>
                    <th className="py-2.5 px-3 border-r border-[#cad0da] min-w-[140px] sticky top-0 bg-[#dde2e9] z-20">Technical Group</th>
                    <th className="py-2.5 px-3 text-center w-24 sticky top-0 bg-[#dde2e9] z-20">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d5dae2] text-[#2c323b]">
                  {isWorking && pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#707985]">
                        <RefreshCw className="w-7 h-7 mx-auto text-emerald-600 animate-spin mb-2" />
                        <div className="font-semibold text-sm">Memuat data functional location...</div>
                      </td>
                    </tr>
                  ) : pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-[#707985]">
                        <Database className="w-8 h-8 mx-auto text-[#9ea6b2] mb-2" />
                        <div className="font-semibold text-sm">Tidak ada data yang cocok</div>
                        <div className="text-xs text-[#8c949f] mt-1">
                          Coba sesuaikan kata kunci pencarian atau bersihkan filter.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((item, idx) => {
                      const isCopied = copiedId === item.functional_location;
                      const globalRowNumber = startIndex + idx + 1;

                      return (
                        <tr
                          key={item.id || `${item.functional_location}-${idx}`}
                          className="hover:bg-[#f2f5f9] transition-colors group"
                        >
                          {/* Global Row Number */}
                          <td className="py-2.5 px-3 text-center text-[#757d89] font-mono border-r border-[#dfe3e8]">
                            {globalRowNumber.toLocaleString('id-ID')}
                          </td>

                          {/* Functional Location (Diperkecil) */}
                          <td className="py-2.5 px-2.5 font-mono font-semibold text-[#1e232a] border-r border-[#dfe3e8] w-40 min-w-[145px] max-w-[175px]">
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className="tracking-tight hover:text-blue-700 cursor-pointer truncate text-[11px]"
                                title={item.functional_location}
                                onClick={() => setSelectedDetail(item)}
                              >
                                {item.functional_location}
                              </span>
                              <button
                                onClick={() => handleCopyCode(item.functional_location)}
                                title="Salin Functional Location"
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-black/10 rounded transition text-[#565e6b] shrink-0"
                              >
                                {isCopied ? (
                                  <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Description */}
                          <td className="py-2.5 px-3 font-medium text-[#2d333d] border-r border-[#dfe3e8]">
                            <div className="flex items-center gap-1.5">
                              <span>{item.description}</span>
                            </div>
                          </td>

                          {/* OpCo (Dilebarkan) */}
                          <td className="py-2.5 px-4 text-center border-r border-[#dfe3e8] w-48 min-w-[170px]">
                            <span className="inline-flex items-center justify-center min-w-[110px] px-3.5 py-1 rounded font-mono font-bold text-xs bg-[#eef1f5] text-[#2c333e] border border-[#cbd1d8] shadow-xs tracking-wider">
                              {item.opco}
                            </span>
                          </td>

                          {/* Line Plant */}
                          <td className="py-2.5 px-3 text-[#49505c] border-r border-[#dfe3e8] font-mono text-[11px]">
                            {item.line_plant}
                          </td>

                          {/* Department */}
                          <td className="py-2.5 px-3 text-[#3f4652] border-r border-[#dfe3e8]">
                            <span className="inline-flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-[#707987] shrink-0" />
                              <span className="truncate max-w-[210px]">{item.department}</span>
                            </span>
                          </td>

                          {/* Technical Group */}
                          <td className="py-2.5 px-3 border-r border-[#dfe3e8]">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                              item.technical_group.includes('DERMAGA')
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : item.technical_group.includes('SILO')
                                ? 'bg-sky-50 text-sky-900 border-sky-300'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            }`}>
                              <Wrench className="w-2.5 h-2.5 shrink-0 opacity-70" />
                              {item.technical_group}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleStartEdit(item)}
                                className={`skeuo-btn-convex px-2 py-1 text-[11px] font-bold flex items-center gap-1 cursor-pointer ${
                                  effectiveEditMode
                                    ? 'bg-amber-200 border-amber-400 text-amber-950 ring-1 ring-amber-400 font-extrabold'
                                    : 'text-[#2a313b]'
                                }`}
                                title="Edit seluruh kolom data Functional Location ini"
                              >
                                <Pencil className="w-3 h-3 text-amber-700" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => setSelectedDetail(item)}
                                className="skeuo-btn-convex px-2 py-1 text-[11px] font-semibold text-[#48505d] hover:text-black"
                              >
                                Detail
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination & Page Filter Controls Bar */}
          <div className="flex flex-col xl:flex-row items-center justify-between gap-3 mt-4 pt-3.5 border-t border-[#cbd1d8] text-xs">
            {/* Info Summary */}
            <div className="text-[11.5px] text-[#555d6b] flex items-center gap-1.5 flex-wrap">
              <span>Menampilkan baris</span>
              <strong className="text-[#1c222b] font-mono font-bold">
                {totalItems === 0 ? 0 : (startIndex + 1).toLocaleString('id-ID')} - {endIndex.toLocaleString('id-ID')}
              </strong>
              <span>dari total</span>
              <strong className="text-emerald-900 font-mono font-bold text-sm">
                {totalItems.toLocaleString('id-ID')}
              </strong>
              <span>entri functional location</span>
              <span className="text-[#76808e] font-mono">
                (Halaman {activePage.toLocaleString('id-ID')} dari {totalPages.toLocaleString('id-ID')})
              </span>
            </div>

            {/* Number Page Filter Buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1 select-none flex-wrap justify-center">
                {/* First Page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={activePage === 1}
                  className={`skeuo-btn-convex px-2.5 py-1 text-xs font-semibold ${
                    activePage === 1 ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer hover:text-black'
                  }`}
                  title="Halaman Pertama (1)"
                >
                  ««
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
                  disabled={activePage === 1}
                  className={`skeuo-btn-convex px-2.5 py-1 text-xs font-semibold ${
                    activePage === 1 ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer hover:text-black'
                  }`}
                  title="Halaman Sebelumnya"
                >
                  ‹
                </button>

                {/* Page Number Buttons */}
                {getPageNumbers().map((p, pIdx) => {
                  if (p === '...') {
                    return (
                      <span key={`ellipsis-${pIdx}`} className="px-2 py-1 text-xs text-[#7c8592] font-mono">
                        ...
                      </span>
                    );
                  }
                  const isCur = p === activePage;
                  return (
                    <button
                      key={`page-${p}`}
                      onClick={() => setCurrentPage(p as number)}
                      className={`min-w-[32px] h-[28px] px-2 text-xs font-bold rounded cursor-pointer transition-all ${
                        isCur
                          ? 'skeuo-tab-dark shadow-sm ring-1 ring-black/40 text-white font-mono scale-105'
                          : 'skeuo-btn-convex text-[#3a414c] hover:text-black'
                      }`}
                      title={`Buka Halaman ${p}`}
                    >
                      {p}
                    </button>
                  );
                })}

                {/* Next Page */}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, activePage + 1))}
                  disabled={activePage === totalPages}
                  className={`skeuo-btn-convex px-2.5 py-1 text-xs font-semibold ${
                    activePage === totalPages ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer hover:text-black'
                  }`}
                  title="Halaman Berikutnya"
                >
                  ›
                </button>

                {/* Last Page */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={activePage === totalPages}
                  className={`skeuo-btn-convex px-2.5 py-1 text-xs font-semibold ${
                    activePage === totalPages ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer hover:text-black'
                  }`}
                  title={`Halaman Terakhir (${totalPages.toLocaleString('id-ID')}) · Berisi Data ke-150.322`}
                >
                  »» ({totalPages.toLocaleString('id-ID')})
                </button>
              </div>
            )}

            {/* Page Size & Jump To Page */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Rows per page selector */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#555d6a]">
                <span>Tampilkan:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="skeuo-inset-input px-2 py-1 text-xs font-mono font-bold bg-transparent cursor-pointer"
                >
                  <option value={25}>25 baris</option>
                  <option value={50}>50 baris</option>
                  <option value={100}>100 baris</option>
                  <option value={250}>250 baris</option>
                  <option value={500}>500 baris</option>
                  <option value={1000}>1.000 baris</option>
                  <option value={-1}>Maksimal (1.000)</option>
                </select>
              </div>

              {/* Jump to Page */}
              {totalPages > 1 && (
                <form onSubmit={handleJumpPage} className="flex items-center gap-1 text-[11px] text-[#555d6a]">
                  <span>Hal:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    placeholder={String(activePage)}
                    className="skeuo-inset-input w-16 px-1.5 py-1 text-center text-xs font-mono"
                  />
                  <span className="text-[#788290]">/ {totalPages.toLocaleString('id-ID')}</span>
                  <button
                    type="submit"
                    className="skeuo-btn-convex px-2 py-1 text-[11px] font-bold text-[#323943] cursor-pointer"
                  >
                    Buka
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none animate-fade-in">
          <div className="skeuo-curved-shadow max-w-md w-full">
            <div className="skeuo-panel-gloss rounded-lg p-5 sm:p-6 border border-[#a8b0ba] text-[#343b44] shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#cbd1d8]">
                <div className="flex items-center gap-2">
                  <Factory className="w-5 h-5 text-[#3b434f]" />
                  <h4 className="text-sm sm:text-base font-bold text-[#2e353f]">
                    Detail Functional Location
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="p-1 rounded text-[#6b7380] hover:text-black hover:bg-black/5"
                >
                  ✕
                </button>
              </div>

              <div className="my-4 space-y-2.5 text-xs">
                <div className="p-3 bg-white/80 rounded border border-[#ccd2da] space-y-2">
                  <div>
                    <span className="text-[#727a86] block text-[10.5px]">Functional Location Code:</span>
                    <div className="font-mono font-bold text-[#1e2329] text-sm flex items-center justify-between">
                      <span>{selectedDetail.functional_location}</span>
                      <button
                        onClick={() => handleCopyCode(selectedDetail.functional_location)}
                        className="skeuo-btn-convex px-2 py-0.5 text-[10px]"
                      >
                        {copiedId === selectedDetail.functional_location ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <span className="text-[#727a86] block text-[10.5px]">Description:</span>
                    <div className="font-bold text-[#2d343f]">{selectedDetail.description}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-[#edf1f5] rounded border border-[#d2d7df]">
                    <span className="text-[#727a86] block text-[10px]">OpCo (Operating Company):</span>
                    <strong className="font-mono text-[#242931]">{selectedDetail.opco}</strong>
                  </div>
                  <div className="p-2.5 bg-[#edf1f5] rounded border border-[#d2d7df]">
                    <span className="text-[#727a86] block text-[10px]">Line Plant:</span>
                    <strong className="font-mono text-[#242931]">{selectedDetail.line_plant}</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-[#edf1f5] rounded border border-[#d2d7df]">
                  <span className="text-[#727a86] block text-[10px]">Departmen / Unit Kerja:</span>
                  <strong className="text-[#242931]">{selectedDetail.department}</strong>
                </div>

                <div className="p-2.5 bg-[#edf1f5] rounded border border-[#d2d7df]">
                  <span className="text-[#727a86] block text-[10px]">Technical Group:</span>
                  <strong className="text-[#242931]">{selectedDetail.technical_group}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#cbd1d8]">
                <button
                  onClick={() => {
                    const itemToEdit = selectedDetail;
                    setSelectedDetail(null);
                    handleStartEdit(itemToEdit);
                  }}
                  className="skeuo-btn-convex px-3 py-1.5 text-xs font-bold text-amber-950 bg-amber-100 border-amber-400 flex items-center gap-1 mr-auto"
                >
                  <Pencil className="w-3.5 h-3.5 text-amber-800" />
                  <span>Edit Data Ini</span>
                </button>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="skeuo-btn-convex px-4 py-1.5 text-xs text-[#525a66]"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    handleCopyCode(selectedDetail.functional_location);
                    setSelectedDetail(null);
                  }}
                  className="skeuo-btn-convex px-4 py-1.5 text-xs font-bold text-[#202630]"
                >
                  Salin Kode SAP PM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Funloc Modal (Pastikan Semua Data Bisa Diedit) */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs select-none animate-fade-in">
          <div className="skeuo-curved-shadow max-w-lg w-full">
            <div className="skeuo-panel-gloss rounded-lg p-5 sm:p-6 border border-[#a8b0ba] text-[#343b44] shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#cbd1d8]">
                <div className="flex items-center gap-2">
                  <Pencil className="w-5 h-5 text-amber-700" />
                  <div>
                    <h4 className="text-base font-bold text-[#272e38]">
                      Edit Data Functional Location
                    </h4>
                    <p className="text-[11px] text-[#6e7784]">
                      Ubah seluruh kolom master data untuk <strong>{originalCode}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingRecord(null)}
                  className="p-1 rounded text-[#6b7380] hover:text-black hover:bg-black/5"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="my-4 space-y-3 text-xs text-[#444c57]">
                <div>
                  <label className="block font-semibold mb-1">Functional Location Code (SAP PM):</label>
                  <input
                    type="text"
                    required
                    value={editForm.functional_location}
                    onChange={(e) =>
                      setEditForm({ ...editForm, functional_location: e.target.value })
                    }
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs font-mono uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Description of Functional Location:
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs uppercase font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">OpCo:</label>
                    <select
                      value={editForm.opco}
                      onChange={(e) => setEditForm({ ...editForm, opco: e.target.value })}
                      className="skeuo-inset-input w-full px-2.5 py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      {opcoOptions.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Line Plant:</label>
                    <input
                      type="text"
                      value={editForm.line_plant}
                      onChange={(e) => setEditForm({ ...editForm, line_plant: e.target.value })}
                      className="skeuo-inset-input w-full px-3 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Departmen:</label>
                  <input
                    type="text"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Technical Group:</label>
                  <input
                    type="text"
                    value={editForm.technical_group}
                    onChange={(e) =>
                      setEditForm({ ...editForm, technical_group: e.target.value })
                    }
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs uppercase"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#cbd1d8]">
                  <button
                    type="button"
                    onClick={() => setEditingRecord(null)}
                    className="skeuo-btn-convex px-4 py-1.5 text-xs text-[#525a66]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="skeuo-btn-convex px-5 py-1.5 text-xs font-bold text-[#1f252f] bg-[#eef1f5] flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>{isSavingEdit ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add New Funloc Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs select-none animate-fade-in">
          <div className="skeuo-curved-shadow max-w-lg w-full">
            <div className="skeuo-panel-gloss rounded-lg p-5 sm:p-6 border border-[#a8b0ba] text-[#343b44] shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-[#cbd1d8]">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-sm sm:text-base font-bold text-[#2e353f]">
                    Tambah Data Functional Location
                  </h4>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded text-[#6b7380] hover:text-black hover:bg-black/5"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="my-4 space-y-3 text-xs text-[#444c57]">
                <div>
                  <label className="block font-semibold mb-1">Functional Location Code:</label>
                  <input
                    type="text"
                    required
                    value={addForm.functional_location}
                    onChange={(e) => setAddForm({ ...addForm, functional_location: e.target.value })}
                    placeholder="Contoh: SG-2407-PC-239-EP01"
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Description of Functional Location:</label>
                  <input
                    type="text"
                    required
                    value={addForm.description}
                    onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                    placeholder="Contoh: ELECTROSTATIC PRECIPITATOR"
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">OpCo:</label>
                    <input
                      type="text"
                      value={addForm.opco}
                      onChange={(e) => setAddForm({ ...addForm, opco: e.target.value })}
                      className="skeuo-inset-input w-full px-3 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Line Plant:</label>
                    <input
                      type="text"
                      value={addForm.line_plant}
                      onChange={(e) => setAddForm({ ...addForm, line_plant: e.target.value })}
                      className="skeuo-inset-input w-full px-3 py-1.5 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Departmen:</label>
                  <input
                    type="text"
                    value={addForm.department}
                    onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Technical Group:</label>
                  <input
                    type="text"
                    value={addForm.technical_group}
                    onChange={(e) => setAddForm({ ...addForm, technical_group: e.target.value })}
                    placeholder="Contoh: DERMAGA / SILO CEMENT / PACKING PLANT"
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs uppercase"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#cbd1d8]">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="skeuo-btn-convex px-4 py-1.5 text-xs text-[#525a66]"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="skeuo-btn-convex px-5 py-1.5 text-xs font-bold text-[#1f252f]"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

