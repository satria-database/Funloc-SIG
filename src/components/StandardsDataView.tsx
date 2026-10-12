import React, { useState, useMemo } from 'react';
import {
  STANDARDIZATION_DATABASE,
  StandardItem,
} from '../data/standardsData.ts';
import {
  Search,
  SlidersHorizontal,
  FileDown,
  CheckCircle2,
  FileCheck2,
  PlusCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface StandardsDataViewProps {
  onTriggerDownload: (standard: StandardItem) => void;
  onOpenTester: (standard: StandardItem) => void;
  isIdnMode?: boolean;
}

export const StandardsDataView: React.FC<StandardsDataViewProps> = ({
  onTriggerDownload,
  onOpenTester,
  isIdnMode = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('Semua Sektor');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedDetail, setSelectedDetail] = useState<StandardItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSector, setNewSector] = useState('Teknologi Informasi & Siber');

  const sectors = [
    'Semua Sektor',
    'Teknologi Informasi & Siber',
    'Manajemen & Organisasi',
    'Kesehatan & Farmasi',
    'Kelistrikan & Energi',
    'Lingkungan & Keberlanjutan',
    'Pangan & Pertanian',
    'Konstruksi & Sipil',
  ];

  const filteredData = useMemo(() => {
    return STANDARDIZATION_DATABASE.filter((item) => {
      const matchSearch =
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ics.includes(searchTerm);
      const matchSector =
        selectedSector === 'Semua Sektor' || item.sector === selectedSector;
      const matchStatus =
        selectedStatus === 'Semua' || item.status === selectedStatus;
      return matchSearch && matchSector && matchStatus;
    });
  }, [searchTerm, selectedSector, selectedStatus]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle) return;
    const newItem: StandardItem = {
      id: `std-${Date.now()}`,
      code: newCode,
      title: newTitle,
      sector: newSector,
      ics: '01.040',
      year: 2026,
      status: 'Draf Konsensus',
      pages: 24,
      fileSize: '1.5 MB',
      organization: 'Badan Standardisasi Nasional (BSN)',
      summary: 'Usulan standar baru yang diajukan melalui sistem verifikasi standarisasi mandiri.',
      scope: ['Perumusan Draf', 'Uji Komite Teknis', 'Konsensus Nasional'],
      parameters: [
        { name: 'Kesesuaian Spesifikasi', targetValue: '100', tolerance: '±5', unit: '%' },
        { name: 'Toleransi Ambang', targetValue: '50', tolerance: '<60', unit: 'Unit' },
      ],
    };
    STANDARDIZATION_DATABASE.unshift(newItem);
    setShowAddModal(false);
    setNewCode('');
    setNewTitle('');
  };

  return (
    <div className="w-full my-4 select-none">
      <div className="skeuo-curved-shadow w-full">
        <div className="skeuo-panel-gloss rounded-lg p-5 sm:p-7 border border-[#b8bfc8] w-full">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#cbd1d8]">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#3b434e]" />
                <h3 className="text-lg sm:text-xl font-bold text-[#323943] tracking-tight">
                  {isIdnMode ? 'Pangkalan Data Standarisasi Nasional' : 'National Standardization Database'}
                </h3>
              </div>
              <p className="text-xs text-[#6e7784] mt-0.5">
                {isIdnMode
                  ? 'Katalog resmi Standar Nasional Indonesia (SNI), ISO, dan regulasi kepatuhan mutu.'
                  : 'Official catalog of Indonesian National Standards (SNI), ISO, and compliance regulations.'}
              </p>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="skeuo-btn-convex px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5 text-[#424954]" />
                <span>{isIdnMode ? 'Usulkan Standar Baru' : 'Propose Standard'}</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 my-4">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#79828e]">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={isIdnMode ? 'Cari kode SNI, ISO, atau kata kunci judul...' : 'Search standard code or keyword...'}
                className="skeuo-inset-input w-full pl-8 pr-3 py-1.5 text-xs text-[#2c323a]"
              />
            </div>

            {/* Sector Dropdown */}
            <div className="sm:col-span-4">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="skeuo-inset-input w-full px-2.5 py-1.5 text-xs text-[#323841] cursor-pointer"
              >
                {sectors.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="skeuo-inset-input w-full px-2 py-1.5 text-xs text-[#323841] cursor-pointer"
              >
                <option value="Semua">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Revisi">Revisi</option>
                <option value="Draf Konsensus">Draf Konsensus</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded border border-[#ccd2da] bg-white/70 shadow-inner">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gradient-to-b from-[#e7eaf0] to-[#d7dce2] border-b border-[#bcc2cb] text-[#4a525f] font-bold">
                  <th className="py-2.5 px-3 whitespace-nowrap">Kode Dokumen</th>
                  <th className="py-2.5 px-3 min-w-[240px]">Judul Standarisasi</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Sektor Teknis</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">Tahun</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">Status</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-center">Ukuran</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e5ea] text-[#343b44]">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-[#717b88]">
                      Tidak ada dokumen standarisasi yang cocok dengan kriteria pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#f0f3f7] transition-colors cursor-pointer"
                      onClick={() => setSelectedDetail(item)}
                    >
                      {/* Code */}
                      <td className="py-2.5 px-3 font-mono font-semibold text-[#292f37] whitespace-nowrap">
                        {item.code}
                      </td>

                      {/* Title */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#303741] line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[10px] text-[#717a86] truncate max-w-sm">
                          ICS: {item.ics} · {item.organization}
                        </div>
                      </td>

                      {/* Sector */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-[#505864]">
                        {item.sector}
                      </td>

                      {/* Year */}
                      <td className="py-2.5 px-3 font-mono text-center tabular-nums text-[#454d58]">
                        {item.year}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Aktif'
                              ? 'bg-[#d8eedd] text-[#1b5b29] border border-[#a6d8ae]'
                              : item.status === 'Revisi'
                              ? 'bg-[#fcf1db] text-[#8a5d12] border border-[#e8d2a0]'
                              : 'bg-[#ebeff5] text-[#4d5663] border border-[#cbd2dc]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* File Size */}
                      <td className="py-2.5 px-3 text-center font-mono text-[11px] tabular-nums text-[#5c6572]">
                        {item.fileSize}
                      </td>

                      {/* Actions */}
                      <td
                        className="py-2.5 px-3 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenTester(item)}
                            className="skeuo-btn-convex px-2 py-1 text-[11px] font-semibold text-[#3c434f]"
                            title="Uji Nilai Parameter"
                          >
                            Uji
                          </button>
                          <button
                            onClick={() => onTriggerDownload(item)}
                            className="skeuo-btn-convex px-2.5 py-1 text-[11px] font-bold text-[#2a3039] flex items-center gap-1"
                            title="Unduh Berkas Standar"
                          >
                            <FileDown className="w-3 h-3 text-[#464f5c]" />
                            <span>Unduh</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Metrics */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-[#cbd1d8] text-xs text-[#6e7784]">
            <div className="flex items-center gap-4">
              <span>
                Menampilkan <strong>{filteredData.length}</strong> dari{' '}
                <strong>{STANDARDIZATION_DATABASE.length}</strong> data standar
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">Standar Terakreditasi BSN & Komite Akreditasi Nasional</span>
            </div>

            <div className="text-[11px] font-mono text-[#5c6471]">
              Siklus Validasi: 2026-Q3
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px]">
          <div className="skeuo-curved-shadow max-w-lg w-full">
            <div className="skeuo-panel-gloss rounded-lg p-6 border border-[#a8b0ba] text-[#343b44] shadow-2xl relative">
              <div className="flex items-start justify-between pb-3 border-b border-[#cbd1d8]">
                <div>
                  <span className="font-mono text-xs font-bold text-[#2a3039] bg-white/80 px-2 py-0.5 rounded border border-[#ccd2db]">
                    {selectedDetail.code}
                  </span>
                  <h4 className="text-base font-bold text-[#303741] mt-1.5">
                    {selectedDetail.title}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="p-1 rounded text-[#6b7380] hover:text-black hover:bg-black/5"
                >
                  ✕
                </button>
              </div>

              <div className="my-3 space-y-2.5 text-xs text-[#525a66]">
                <p className="leading-relaxed bg-white/70 p-3 rounded border border-[#d2d7de]">
                  {selectedDetail.summary}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-[#f0f3f6] rounded border border-[#d6dbe2]">
                    <span className="text-[#727a86] block">Sektor & ICS:</span>
                    <strong>{selectedDetail.sector} (ICS {selectedDetail.ics})</strong>
                  </div>
                  <div className="p-2 bg-[#f0f3f6] rounded border border-[#d6dbe2]">
                    <span className="text-[#727a86] block">Penerbit & Tahun:</span>
                    <strong>{selectedDetail.organization} ({selectedDetail.year})</strong>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-[#3a414c] mb-1">Ruang Lingkup Standarisasi:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDetail.scope.map((sc, i) => (
                      <span
                        key={i}
                        className="bg-white/90 border border-[#c5ccd5] text-[#414853] px-2 py-0.5 rounded text-[11px]"
                      >
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#cbd1d8]">
                <button
                  onClick={() => setSelectedDetail(null)}
                  className="skeuo-btn-convex px-4 py-1.5 text-xs text-[#525a66]"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    const itm = selectedDetail;
                    setSelectedDetail(null);
                    onOpenTester(itm);
                  }}
                  className="skeuo-btn-convex px-4 py-1.5 text-xs font-semibold text-[#3b434e]"
                >
                  Uji Parameter Mutu
                </button>
                <button
                  onClick={() => {
                    const itm = selectedDetail;
                    setSelectedDetail(null);
                    onTriggerDownload(itm);
                  }}
                  className="skeuo-btn-convex px-4 py-1.5 text-xs font-bold text-[#2a3039]"
                >
                  Unduh Dokumen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Standard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-[1px]">
          <div className="skeuo-curved-shadow max-w-md w-full">
            <div className="skeuo-panel-gloss rounded-lg p-6 border border-[#a8b0ba] text-[#343b44] shadow-2xl">
              <h4 className="text-base font-bold text-[#303741] pb-2 border-b border-[#cbd1d8]">
                Formulir Usulan Standar Baru
              </h4>
              <form onSubmit={handleAddSubmit} className="space-y-3 mt-3 text-xs">
                <div>
                  <label className="block text-[#474f5b] font-semibold mb-1">
                    Kode Standar (misal: SNI 9999:2026)
                  </label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="SNI 9999:2026"
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#474f5b] font-semibold mb-1">
                    Judul Standarisasi Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Spesifikasi Mutu & Tata Cara Pengujian..."
                    className="skeuo-inset-input w-full px-3 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#474f5b] font-semibold mb-1">
                    Sektor Teknis
                  </label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    className="skeuo-inset-input w-full px-2.5 py-1.5 text-xs"
                  >
                    {sectors.slice(1).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
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
                    className="skeuo-btn-convex px-5 py-1.5 text-xs font-bold text-[#2a3039]"
                  >
                    Simpan Draf Usulan
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
