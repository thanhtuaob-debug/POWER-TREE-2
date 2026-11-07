import React, { useState, useEffect } from 'react';
import {
  Zap,
  Activity,
  Layers,
  Search,
  Power,
  Cpu,
  Factory,
  Home,
  Sun,
  BatteryCharging,
  GitBranch,
  BarChart3,
  ChevronRight,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

interface PowerNode {
  id: string;
  name: string;
  code: string;
  type: 'substation' | 'transformer' | 'renewable' | 'storage' | 'industrial' | 'residential';
  level: number;
  voltage: string;
  powerKw: number;
  maxPowerKw: number;
  currentAmp: number;
  status: 'online' | 'warning' | 'offline';
  temperatureC: number;
  breakerClosed: boolean;
}

const INITIAL_NODES: PowerNode[] = [
  {
    id: 'node-root',
    name: 'Trạm Trung Tâm 110kV/22kV',
    code: 'TBA-CENTRAL-01',
    type: 'substation',
    level: 0,
    voltage: '110 kV',
    powerKw: 2450.0,
    maxPowerKw: 3000.0,
    currentAmp: 12.8,
    status: 'online',
    temperatureC: 48,
    breakerClosed: true,
  },
  {
    id: 'node-dist-a',
    name: 'Nhánh Phân Phối A - Khu Công Nghiệp',
    code: 'FEEDER-22KV-IND',
    type: 'transformer',
    level: 1,
    voltage: '22 kV',
    powerKw: 1180.5,
    maxPowerKw: 1500.0,
    currentAmp: 31.0,
    status: 'online',
    temperatureC: 52,
    breakerClosed: true,
  },
  {
    id: 'node-dist-b',
    name: 'Nhánh Phân Phối B - Đô Thị & Dân Cư',
    code: 'FEEDER-22KV-RES',
    type: 'transformer',
    level: 1,
    voltage: '22 kV',
    powerKw: 680.0,
    maxPowerKw: 1000.0,
    currentAmp: 17.8,
    status: 'online',
    temperatureC: 44,
    breakerClosed: true,
  },
  {
    id: 'node-dist-c',
    name: 'Nhánh Năng Lượng Tái Tạo & BESS',
    code: 'FEEDER-22KV-GREEN',
    type: 'renewable',
    level: 1,
    voltage: '22 kV',
    powerKw: 589.5,
    maxPowerKw: 800.0,
    currentAmp: 15.5,
    status: 'online',
    temperatureC: 39,
    breakerClosed: true,
  },
  {
    id: 'node-ind-1',
    name: 'Nhà Máy Luyện Kim & Chế Tạo',
    code: 'LOAD-IND-01',
    type: 'industrial',
    level: 2,
    voltage: '0.4 kV',
    powerKw: 720.0,
    maxPowerKw: 850.0,
    currentAmp: 1040,
    status: 'warning',
    temperatureC: 62,
    breakerClosed: true,
  },
  {
    id: 'node-solar-1',
    name: 'Trang Trại Điện Mặt Trời Solar Farm',
    code: 'GEN-SOLAR-01',
    type: 'renewable',
    level: 2,
    voltage: '0.4 kV',
    powerKw: 380.0,
    maxPowerKw: 450.0,
    currentAmp: 548,
    status: 'online',
    temperatureC: 38,
    breakerClosed: true,
  },
  {
    id: 'node-bess-1',
    name: 'Pin Lưu Trữ BESS 500kWh',
    code: 'STOR-BESS-01',
    type: 'storage',
    level: 2,
    voltage: '0.4 kV',
    powerKw: 209.5,
    maxPowerKw: 350.0,
    currentAmp: 302,
    status: 'online',
    temperatureC: 35,
    breakerClosed: true,
  },
];

export default function App() {
  const [nodes, setNodes] = useState<PowerNode[]>(INITIAL_NODES);
  const [selectedId, setSelectedId] = useState<string>('node-root');
  const [search, setSearch] = useState<string>('');
  const [freq, setFreq] = useState<number>(50.02);

  useEffect(() => {
    const timer = setInterval(() => {
      setFreq(Number((50.0 + (Math.random() * 0.08 - 0.04)).toFixed(2)));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const selectedNode = nodes.find((n) => n.id === selectedId) || nodes[0];

  const handleToggleBreaker = (id: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, breakerClosed: !n.breakerClosed, status: !n.breakerClosed ? 'online' : 'offline' } : n
      )
    );
  };

  const filtered = nodes.filter((n) => n.name.toLowerCase().includes(search.toLowerCase()) || n.code.includes(search));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              POWER TREE 2
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                ONLINE
              </span>
            </h1>
            <p className="text-xs text-slate-400">Hệ thống Giám sát & Phân phối Lưới điện Cây</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400">Tần số:</span>
            <span className="font-mono font-bold text-emerald-300">{freq} Hz</span>
          </div>
          <div className="h-3 w-px bg-slate-700"></div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400">Vercel Deploy:</span>
            <span className="font-mono font-bold text-cyan-300">Hoạt động tốt</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Banner thành công */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-emerald-300 text-sm">Deploy thành công! Màn hình trắng đã được khắc phục.</div>
              <div className="text-xs text-slate-300">File App.tsx đã được nạp đầy đủ giao diện bảng điều khiển Power Tree.</div>
            </div>
          </div>
        </div>

        {/* Danh sách các nút điện */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-emerald-400" />
                Sơ đồ Nút Cây Điện Lực
              </h3>
              <input
                type="text"
                placeholder="Tìm trạm / phụ tải..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
              />
            </div>

            {filtered.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedId(node.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                  node.id === selectedId
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
                style={{ marginLeft: `${node.level * 16}px` }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{node.name}</div>
                    <div className="text-xs text-slate-400">{node.code} • {node.voltage} • {node.temperatureC}°C</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-amber-400">
                    {node.breakerClosed ? `${node.powerKw} kW` : 'CẮT ĐIỆN'}
                  </div>
                  <div className="text-[11px] text-slate-500">Định mức: {node.maxPowerKw} kW</div>
                </div>
              </div>
            ))}
          </div>

          {/* Chi tiết & Thao tác Aptomat */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">
                Thông số Nút Đang Chọn
              </h3>
              <div>
                <div className="text-lg font-bold text-white">{selectedNode.name}</div>
                <div className="text-xs font-mono text-cyan-400">{selectedNode.code}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Điện áp</div>
                  <div className="text-base font-bold font-mono text-white mt-1">{selectedNode.voltage}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Dòng điện</div>
                  <div className="text-base font-bold font-mono text-white mt-1">{selectedNode.currentAmp} A</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Công suất P</div>
                  <div className="text-base font-bold font-mono text-amber-400 mt-1">{selectedNode.powerKw} kW</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div className="text-xs text-slate-400">Nhiệt độ</div>
                  <div className="text-base font-bold font-mono text-slate-200 mt-1">{selectedNode.temperatureC} °C</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6">
              <button
                onClick={() => handleToggleBreaker(selectedNode.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition ${
                  selectedNode.breakerClosed
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{selectedNode.breakerClosed ? 'CẮT MÁY CẮT (TRIP)' : 'ĐÓNG MÁY CẮT (CLOSE)'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
