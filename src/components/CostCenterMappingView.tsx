import React, { useState } from 'react';
import {
  CostCenterActivityRow,
  getLocalCostCenterMapping,
  saveLocalCostCenterMapping,
  addDepartmentRow,
  deleteDepartmentRow,
} from '../data/costCenterData.ts';
import {
  PlusCircle,
  Pencil,
  Trash2,
  GitFork,
  CheckCircle2,
  Plus,
  Layers,
  Factory,
  Check,
} from 'lucide-react';

interface CostCenterMappingViewProps {
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  onSwitchToFunlocWithFilter?: (funlocPrefix: string) => void;
}

// Unified Modal State: Menggabungkan Edit Departemen dan Aktivitas dalam 1 Modal di Aksi
interface UnifiedRowModalState {
  deptId: string;
  deptNo: number;
  deptName: string;
  productionLinePlant: string;
  actIndex?: number; // undefined bila menambah aktivitas baru ke departemen
  sigCode: string;
  sigDesc: string;
  tgCode: string;
  tgDesc: string;
  ghopoCode: string;
}

export const CostCenterMappingView: React.FC<CostCenterMappingViewProps> = () => {
  // Master data state from localStorage / default
  const [mappingData, setMappingData] = useState<CostCenterActivityRow[]>(() =>
    getLocalCostCenterMapping()
  );

  // Notifications
  const [notification, setNotification] = useState<string | null>(null);

  // Unified Edit Modal (Dibuka dari kolom Aksi, berisi Departemen + Aktivitas sekaligus)
  const [unifiedModal, setUnifiedModal] = useState<UnifiedRowModalState | null>(null);

  // Modal Tambah Departemen Baru
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);
  const [newDeptForm, setNewDeptForm] = useState<{
    no: number;
    departmentName: string;
    productionLinePlant: string;
    iconType: 'tambang' | 'raw_meal' | 'clinker' | 'cement' | 'packing' | 'utilitas';
    sigCode: string;
    sigDesc: string;
    tgCode: string;
    tgDesc: string;
    ghopoCode: string;
  }>({
    no: 8,
    departmentName: '',
    productionLinePlant: '1/2/3/4 etc',
    iconType: 'cement',
    sigCode: '',
    sigDesc: '',
    tgCode: '',
    tgDesc: '',
    ghopoCode: '-',
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const filteredData = mappingData;

  // Simpan Modal Terpadu (Aksi -> Departemen + Aktivitas sekaligus)
  const handleSaveUnifiedModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unifiedModal) return;

    const updated = [...mappingData];
    const dept = updated.find((d) => d.id === unifiedModal.deptId);
    if (!dept) return;

    // 1. Update Nilai Departemen & Line Plant
    dept.no = Number(unifiedModal.deptNo) || dept.no;
    dept.departmentName = unifiedModal.deptName.trim().toUpperCase();
    dept.productionLinePlant = unifiedModal.productionLinePlant.trim();

    // 2. Update atau Tambah Nilai Aktivitas
    if (unifiedModal.actIndex !== undefined && unifiedModal.actIndex >= 0) {
      // Edit Aktivitas yang ada
      if (dept.sigActivities[unifiedModal.actIndex]) {
        dept.sigActivities[unifiedModal.actIndex].code = unifiedModal.sigCode.trim();
        dept.sigActivities[unifiedModal.actIndex].description = unifiedModal.sigDesc.trim().toUpperCase();
      }
      if (!dept.techGroupActivities[unifiedModal.actIndex]) {
        dept.techGroupActivities[unifiedModal.actIndex] = {
          id: `tg-${Date.now()}`,
          code: unifiedModal.tgCode.trim(),
          description: unifiedModal.tgDesc.trim().toUpperCase(),
        };
      } else {
        dept.techGroupActivities[unifiedModal.actIndex].code = unifiedModal.tgCode.trim();
        dept.techGroupActivities[unifiedModal.actIndex].description = unifiedModal.tgDesc.trim().toUpperCase();
      }
      if (!dept.ghopoActivities[unifiedModal.actIndex]) {
        dept.ghopoActivities[unifiedModal.actIndex] = {
          id: `gh-${Date.now()}`,
          code: unifiedModal.ghopoCode.trim() || '-',
          description: '',
        };
      } else {
        dept.ghopoActivities[unifiedModal.actIndex].code = unifiedModal.ghopoCode.trim() || '-';
      }
      showToast(`Data departemen & aktivitas baris berhasil diperbarui!`);
    } else {
      // Tambah Aktivitas baru ke departemen
      const newActId = `act-${Date.now()}`;
      dept.sigActivities.push({
        id: `sig-${newActId}`,
        code: unifiedModal.sigCode.trim(),
        description: unifiedModal.sigDesc.trim().toUpperCase(),
      });
      dept.techGroupActivities.push({
        id: `tg-${newActId}`,
        code: unifiedModal.tgCode.trim(),
        description: unifiedModal.tgDesc.trim().toUpperCase(),
      });
      dept.ghopoActivities.push({
        id: `gh-${newActId}`,
        code: unifiedModal.ghopoCode.trim() || '-',
        description: '',
      });
      showToast(`Aktivitas baru berhasil ditambahkan ke ${dept.departmentName}!`);
    }

    saveLocalCostCenterMapping(updated);
    setMappingData(updated);
    setUnifiedModal(null);
  };

  // Save New Department
  const handleSaveAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptForm.departmentName) return;

    const newId = `cc-dept-${Date.now()}`;
    const newRecord: CostCenterActivityRow = {
      id: newId,
      no: newDeptForm.no,
      departmentName: newDeptForm.departmentName.toUpperCase(),
      productionLinePlant: newDeptForm.productionLinePlant,
      iconType: newDeptForm.iconType,
      colorTheme: 'blue',
      sigActivities: newDeptForm.sigCode
        ? [{ id: `sig-${newId}`, code: newDeptForm.sigCode, description: newDeptForm.sigDesc }]
        : [{ id: `sig-${newId}`, code: '01', description: 'GENERAL ACTIVITY' }],
      techGroupActivities: newDeptForm.tgCode
        ? [{ id: `tg-${newId}`, code: newDeptForm.tgCode, description: newDeptForm.tgDesc }]
        : [{ id: `tg-${newId}`, code: '01', description: 'GENERAL ACTIVITY' }],
      ghopoActivities: [
        { id: `gh-${newId}`, code: newDeptForm.ghopoCode || '-', description: '' },
      ],
    };

    const res = addDepartmentRow(newRecord);
    setMappingData([...res]);
    showToast(`Departemen baru "${newRecord.departmentName}" berhasil ditambahkan!`);
    setShowAddDeptModal(false);
    setNewDeptForm({
      no: mappingData.length + 2,
      departmentName: '',
      productionLinePlant: '1/2/3/4 etc',
      iconType: 'cement',
      sigCode: '',
      sigDesc: '',
      tgCode: '',
      tgDesc: '',
      ghopoCode: '-',
    });
  };

  // Delete an activity
  const handleDeleteActivity = (deptId: string, actIndex: number, actDesc: string) => {
    const dept = mappingData.find((d) => d.id === deptId);
    if (!dept) return;

    if (dept.sigActivities.length <= 1) {
      if (
        confirm(
          `Departemen "${dept.departmentName}" hanya memiliki 1 aktivitas. Menghapus aktivitas ini akan menghapus seluruh departemen. Lanjutkan?`
        )
      ) {
        const res = deleteDepartmentRow(deptId);
        setMappingData([...res]);
        showToast(`Departemen "${dept.departmentName}" berhasil dihapus.`);
      }
      return;
    }

    if (confirm(`Hapus aktivitas "${actDesc}" dari departemen ini?`)) {
      const updated = [...mappingData];
      const targetDept = updated.find((d) => d.id === deptId);
      if (targetDept) {
        targetDept.sigActivities.splice(actIndex, 1);
        targetDept.techGroupActivities.splice(actIndex, 1);
        targetDept.ghopoActivities.splice(actIndex, 1);
        saveLocalCostCenterMapping(updated);
        setMappingData(updated);
        showToast('Aktivitas berhasil dihapus.');
      }
    }
  };

  return (
    <div className="w-full my-2 select-none">
      <div className="skeuo-curved-shadow w-full">
        <div className="skeuo-panel-gloss rounded-lg p-4 sm:p-6 border border-[#b8bfc8] w-full bg-white">
          {/* Header Panel */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#cbd1d8]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#28313e] text-white shadow-xs border border-white/20">
                <GitFork className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#2d343f] tracking-tight">
                  Cost Center / Mapping
                </h3>
                <p className="text-xs text-[#6e7784] mt-0.5">
                  Tabel Pemetaan Master Data Departemen, Line/Plant, dan Aktivitas (SIG · Technical Group · GHOPO)
                </p>
              </div>
            </div>
          </div>

          {/* Action Notification Toast */}
          {notification && (
            <div className="mt-3 p-2.5 bg-[#252b34] text-white text-xs rounded-md shadow flex items-center justify-between border border-white/20 animate-fade-in">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {notification}
              </span>
              <button
                onClick={() => setNotification(null)}
                className="text-white/60 hover:text-white px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* MAIN DATA TABLE: POLA LAMPIRAN 2 & LAMPIRAN 3 (1 WARNA SOLID TANPA GRADASI) */}
          <div className="overflow-x-auto rounded border border-[#b2b9c3] shadow-inner bg-white mt-4">
            <table className="w-full border-collapse text-left text-xs">
              {/* HEADER BERJENJANG DENGAN 1 WARNA SOLID (#dce3ec) TANPA GRADASI */}
              <thead>
                {/* Header Row 1 */}
                <tr className="bg-[#dce3ec] text-[#1e2530] border-b border-[#b2b9c3] font-bold text-[11px] select-none uppercase tracking-wider">
                  <th
                    rowSpan={2}
                    className="p-2.5 border-r border-[#b2b9c3] w-14 text-center align-middle"
                  >
                    NO
                  </th>
                  <th
                    rowSpan={2}
                    className="p-2.5 border-r border-[#b2b9c3] min-w-[200px] w-64 align-middle"
                  >
                    DEPARTMENT
                  </th>
                  <th
                    rowSpan={2}
                    className="p-2.5 border-r border-[#b2b9c3] min-w-[140px] w-40 align-middle"
                  >
                    LINE / PLANT
                  </th>
                  <th
                    colSpan={3}
                    className="p-2 border-r border-[#b2b9c3] text-center bg-[#dce3ec] text-[#1e2530] tracking-widest font-extrabold"
                  >
                    ACTIVITY (MAPPING AKTIVITAS)
                  </th>
                  <th
                    rowSpan={2}
                    className="p-2.5 w-24 text-center align-middle"
                  >
                    AKSI
                  </th>
                </tr>

                {/* Header Row 2: Sub-columns under ACTIVITY - Menggunakan warna solid yang sama (#dce3ec) */}
                <tr className="bg-[#dce3ec] text-[#2c333e] border-b-2 border-[#9fa8b5] font-semibold text-[10.5px] uppercase">
                  <th className="p-2 border-r border-[#b2b9c3] min-w-[260px]">
                    <div className="flex items-center justify-between">
                      <span>SIG (KODE & DESKRIPSI)</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-700 text-white rounded font-bold font-mono">
                        SIG STD
                      </span>
                    </div>
                  </th>
                  <th className="p-2 border-r border-[#b2b9c3] min-w-[260px]">
                    <div className="flex items-center justify-between">
                      <span>TECHNICAL GROUP</span>
                      <span className="text-[9px] px-1.5 py-0.2 bg-blue-700 text-white rounded font-bold font-mono">
                        TECH GROUP
                      </span>
                    </div>
                  </th>
                  <th className="p-2 border-r border-[#b2b9c3] w-28 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>GHOPO</span>
                      <span className="text-[9px] px-1 py-0.2 bg-amber-700 text-white rounded font-bold font-mono">
                        OPCO
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* TABLE BODY: DEPARTMENT BLOCKS WITH ACTIVITIES */}
              <tbody className="divide-y divide-[#cfd5de]">
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-[#6e7784] bg-[#f9fafb]"
                    >
                      <Factory className="w-8 h-8 mx-auto mb-2 text-[#9da6b2] opacity-60" />
                      <p className="font-medium text-sm">Tidak ada data pemetaan yang cocok</p>
                      <p className="text-xs text-[#8d97a5] mt-1">
                        Coba ubah kata kunci pencarian atau reset filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((dept) => {
                    const rowCount = Math.max(dept.sigActivities.length, 1);

                    return dept.sigActivities.map((act, actIdx) => {
                      const tgAct = dept.techGroupActivities[actIdx] || {
                        code: act.code,
                        description: act.description,
                      };
                      const ghAct = dept.ghopoActivities[actIdx] || { code: '-' };
                      const isFirstRow = actIdx === 0;

                      return (
                        <tr
                          key={`${dept.id}-${act.id || actIdx}`}
                          className={`hover:bg-[#f2f5f9] transition-colors ${
                            actIdx % 2 === 0 ? 'bg-white' : 'bg-[#fafbfc]'
                          } ${isFirstRow && 'border-t-2 border-[#b0b8c4]'}`}
                        >
                          {/* Kolom 1: NO (Solid background, clean) */}
                          {isFirstRow && (
                            <td
                              rowSpan={rowCount}
                              className="p-2.5 border-r border-[#cfd5de] text-center font-bold text-[#1f252f] text-xs align-middle bg-[#f8fafc]"
                            >
                              <span className="font-mono font-bold text-xs text-[#2c333e]">
                                {dept.no}
                              </span>
                            </td>
                          )}

                          {/* Kolom 2: DEPARTMENT */}
                          {isFirstRow && (
                            <td
                              rowSpan={rowCount}
                              className="p-3 border-r border-[#cfd5de] align-middle bg-[#f8fafc]"
                            >
                              <div className="font-bold text-[#1e2530] text-xs uppercase tracking-tight leading-relaxed">
                                {dept.departmentName}
                              </div>
                            </td>
                          )}

                          {/* Kolom 3: LINE / PLANT */}
                          {isFirstRow && (
                            <td
                              rowSpan={rowCount}
                              className="p-3 border-r border-[#cfd5de] align-middle bg-[#f8fafc]"
                            >
                              <span className="font-mono font-semibold text-xs text-[#2c333e]">
                                {dept.productionLinePlant}
                              </span>
                            </td>
                          )}

                          {/* Kolom 4: SIG ACTIVITY (Kode & Deskripsi) */}
                          <td className="p-2.5 border-r border-[#cfd5de] align-middle">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-950 font-mono font-bold text-[11px] shrink-0">
                                {act.code}
                              </span>
                              <span className="font-semibold text-[#1e2530] text-xs uppercase tracking-tight">
                                {act.description}
                              </span>
                            </div>
                          </td>

                          {/* Kolom 5: TECHNICAL GROUP (Kode & Deskripsi) */}
                          <td className="p-2.5 border-r border-[#cfd5de] align-middle">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-300 text-blue-950 font-mono font-bold text-[11px] shrink-0">
                                {tgAct.code}
                              </span>
                              <span className="font-semibold text-[#27303d] text-xs uppercase tracking-tight">
                                {tgAct.description}
                              </span>
                            </div>
                          </td>

                          {/* Kolom 6: GHOPO (Kode) */}
                          <td className="p-2.5 border-r border-[#cfd5de] text-center align-middle">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded font-mono font-bold text-xs ${
                                ghAct.code !== '-'
                                    ? 'bg-amber-100 border border-amber-300 text-amber-950'
                                    : 'text-[#8b95a3] bg-[#f0f3f6]'
                              }`}
                            >
                              {ghAct.code}
                            </span>
                          </td>

                          {/* Kolom 7: AKSI (Edit gabungan Departemen & Aktivitas dalam 1 modal) */}
                          <td className="p-2 text-center align-middle">
                            <div className="flex items-center justify-center gap-1">
                              {/* Tombol Edit Baris & Departemen */}
                              <button
                                onClick={() =>
                                  setUnifiedModal({
                                    deptId: dept.id,
                                    deptNo: dept.no,
                                    deptName: dept.departmentName,
                                    productionLinePlant: dept.productionLinePlant,
                                    actIndex: actIdx,
                                    sigCode: act.code,
                                    sigDesc: act.description,
                                    tgCode: tgAct.code,
                                    tgDesc: tgAct.description,
                                    ghopoCode: ghAct.code,
                                  })
                                }
                                className="p-1.5 rounded hover:bg-slate-100 text-[#475569] hover:text-[#0f172a] cursor-pointer"
                                title="Edit Departemen & Aktivitas Baris Ini"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>

                              {/* Tombol Tambah Aktivitas ke Departemen Ini */}
                              <button
                                onClick={() =>
                                  setUnifiedModal({
                                    deptId: dept.id,
                                    deptNo: dept.no,
                                    deptName: dept.departmentName,
                                    productionLinePlant: dept.productionLinePlant,
                                    sigCode: '',
                                    sigDesc: '',
                                    tgCode: '',
                                    tgDesc: '',
                                    ghopoCode: '-',
                                  })
                                }
                                className="p-1.5 rounded hover:bg-emerald-50 text-emerald-700 cursor-pointer"
                                title="Tambah Aktivitas ke Departemen Ini"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                              {/* Tombol Hapus Aktivitas */}
                              {rowCount > 1 && (
                                <button
                                  onClick={() =>
                                    handleDeleteActivity(dept.id, actIdx, act.description)
                                  }
                                  className="p-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer"
                                  title="Hapus Aktivitas Ini"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Table Toolbar - Flat solid color tanpa gradasi */}
          <div className="mt-4 p-3 bg-[#edf2f7] rounded border border-[#ccd2da] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#565f6c]">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>
                Menampilkan <strong>{filteredData.length}</strong> Departemen dengan pola matriks Lampiran 2 (SAP PM & Controlling SIG).
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddDeptModal(true)}
                className="skeuo-btn-convex px-3 py-1.5 text-xs font-bold text-[#1f2530] flex items-center gap-1 cursor-pointer bg-white"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>+ Tambah Baris / Departemen Baru</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* UNIFIED MODAL: EDIT VALUE DEPARTEMEN & AKTIVITAS JADI 1 (SESUAI REQUEST USER) */}
      {unifiedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="skeuo-panel-gloss bg-white rounded-xl shadow-2xl max-w-xl w-full border border-[#a8b1bd] overflow-hidden">
            {/* Modal Header - Solid tanpa gradasi */}
            <div className="px-5 py-3.5 bg-[#1e293b] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm tracking-tight">
                  {unifiedModal.actIndex !== undefined
                    ? 'Edit Data Departemen & Aktivitas'
                    : `Tambah Aktivitas Baru ke ${unifiedModal.deptName}`}
                </h4>
              </div>
              <button
                onClick={() => setUnifiedModal(null)}
                className="text-white/70 hover:text-white p-1 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveUnifiedModal} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              {/* SECTION 1: EDIT VALUE DEPARTEMEN & LINE/PLANT (JADI 1 DI SINI) */}
              <div className="p-3 bg-slate-50 border border-slate-300 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Factory className="w-4 h-4 text-slate-700" />
                    Data Departemen & Line Plant
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    Tersinkronisasi untuk departemen ini
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  <div className="col-span-1">
                    <label className="block text-[11px] text-[#555] font-semibold mb-1">
                      No. (NO) *
                    </label>
                    <input
                      type="number"
                      required
                      value={unifiedModal.deptNo}
                      onChange={(e) =>
                        setUnifiedModal({
                          ...unifiedModal,
                          deptNo: Number(e.target.value) || 0,
                        })
                      }
                      className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-mono font-bold text-center"
                    />
                  </div>

                  <div className="col-span-3">
                    <label className="block text-[11px] text-[#555] font-semibold mb-1">
                      Nama Departemen *
                    </label>
                    <input
                      type="text"
                      required
                      value={unifiedModal.deptName}
                      onChange={(e) =>
                        setUnifiedModal({
                          ...unifiedModal,
                          deptName: e.target.value.toUpperCase(),
                        })
                      }
                      className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-bold uppercase"
                      placeholder="e.g. RAW MATERIAL PREPARATION / TAMBANG"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-[#555] font-semibold mb-1">
                    Line / Plant *
                  </label>
                  <input
                    type="text"
                    required
                    value={unifiedModal.productionLinePlant}
                    onChange={(e) =>
                      setUnifiedModal({
                        ...unifiedModal,
                        productionLinePlant: e.target.value,
                      })
                    }
                    className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-semibold"
                    placeholder="e.g. 1/2/3/4 etc atau PACKING"
                  />
                </div>
              </div>

              {/* SECTION 2: STANDAR AKTIVITAS SIG */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-300 rounded-lg space-y-2">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Standar SIG (Semen Indonesia Group)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[11px] text-[#555] font-semibold mb-1">
                      Kode SIG *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 23"
                      value={unifiedModal.sigCode}
                      onChange={(e) =>
                        setUnifiedModal({ ...unifiedModal, sigCode: e.target.value })
                      }
                      className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[11px] text-[#555] font-semibold mb-1">
                      Deskripsi Aktivitas SIG *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LIMESTONE CRUSHING"
                      value={unifiedModal.sigDesc}
                      onChange={(e) =>
                        setUnifiedModal({
                          ...unifiedModal,
                          sigDesc: e.target.value.toUpperCase(),
                        })
                      }
                      className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: TECHNICAL GROUP */}
              <div className="p-3 bg-blue-50/60 border border-blue-300 rounded-lg space-y-2">
                <span className="font-bold text-blue-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  Technical Group Mapping
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[11px] text-[#555] font-semibold mb-1">
                      Kode TG
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 23"
                      value={unifiedModal.tgCode}
                      onChange={(e) =>
                        setUnifiedModal({ ...unifiedModal, tgCode: e.target.value })
                      }
                      className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[11px] text-[#555] font-semibold mb-1">
                      Deskripsi Technical Group
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LIMESTONE CRUSHING"
                      value={unifiedModal.tgDesc}
                      onChange={(e) =>
                        setUnifiedModal({
                          ...unifiedModal,
                          tgDesc: e.target.value.toUpperCase(),
                        })
                      }
                      className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: GHOPO (OPCO) */}
              <div className="p-3 bg-amber-50/60 border border-amber-300 rounded-lg space-y-1">
                <label className="block text-[11px] text-[#555] font-semibold mb-1">
                  Kode Mapping GHOPO (OpCo)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 52/53 atau -"
                  value={unifiedModal.ghopoCode}
                  onChange={(e) =>
                    setUnifiedModal({ ...unifiedModal, ghopoCode: e.target.value })
                  }
                  className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-mono font-bold"
                />
              </div>

              {/* Modal Buttons - Solid tanpa gradasi */}
              <div className="pt-3 border-t border-[#ccd2da] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setUnifiedModal(null)}
                  className="skeuo-btn-convex px-4 py-2 text-xs font-semibold text-[#555] bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="skeuo-btn-convex px-5 py-2 text-xs font-bold bg-[#1e293b] text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH DEPARTEMEN / BARIS BARU */}
      {showAddDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="skeuo-panel-gloss bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#a8b1bd] overflow-hidden">
            <div className="px-5 py-3.5 bg-[#1e293b] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-sm tracking-tight">
                  Tambah Departemen & Aktivitas Baru
                </h4>
              </div>
              <button
                onClick={() => setShowAddDeptModal(false)}
                className="text-white/70 hover:text-white p-1 cursor-pointer text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddDept} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-[11px] text-[#555] font-semibold mb-1">
                    Nomor (NO) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newDeptForm.no}
                    onChange={(e) =>
                      setNewDeptForm({ ...newDeptForm, no: Number(e.target.value) || 0 })
                    }
                    className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-mono font-bold text-center"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-[11px] text-[#555] font-semibold mb-1">
                    Nama Departemen *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. LOGISTIK & DISTRIBUSI"
                    value={newDeptForm.departmentName}
                    onChange={(e) =>
                      setNewDeptForm({
                        ...newDeptForm,
                        departmentName: e.target.value.toUpperCase(),
                      })
                    }
                    className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#555] font-semibold mb-1">
                  Line / Plant *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1/2/3/4 etc atau PACKING"
                  value={newDeptForm.productionLinePlant}
                  onChange={(e) =>
                    setNewDeptForm({ ...newDeptForm, productionLinePlant: e.target.value })
                  }
                  className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-semibold"
                />
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-md space-y-2">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Aktivitas SIG Perdana (Bisa ditambah nanti)
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] text-[#555] font-semibold mb-1">
                      Kode SIG
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 01"
                      value={newDeptForm.sigCode}
                      onChange={(e) =>
                        setNewDeptForm({ ...newDeptForm, sigCode: e.target.value })
                      }
                      className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-mono font-bold"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] text-[#555] font-semibold mb-1">
                      Deskripsi Aktivitas SIG
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AKTIVITAS OPERASIONAL"
                      value={newDeptForm.sigDesc}
                      onChange={(e) =>
                        setNewDeptForm({ ...newDeptForm, sigDesc: e.target.value.toUpperCase() })
                      }
                      className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#555] font-semibold mb-1">
                    Kode TG (Technical Group)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01"
                    value={newDeptForm.tgCode}
                    onChange={(e) =>
                      setNewDeptForm({ ...newDeptForm, tgCode: e.target.value })
                    }
                    className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#555] font-semibold mb-1">
                    Kode GHOPO (OpCo)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 01 atau -"
                    value={newDeptForm.ghopoCode}
                    onChange={(e) =>
                      setNewDeptForm({ ...newDeptForm, ghopoCode: e.target.value })
                    }
                    className="skeuo-inset-input w-full p-2 border border-[#b8bfc8] rounded bg-white text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#ccd2da] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  className="skeuo-btn-convex px-4 py-2 text-xs font-semibold text-[#555] bg-white cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="skeuo-btn-convex px-5 py-2 text-xs font-bold bg-[#1e293b] text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tambahkan Departemen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
