import React, { useState } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer,
  LabelList
} from 'recharts';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Database, 
  Library, 
  Share2, 
  Lock, 
  Search, 
  BarChart3, 
  FileText, 
  Zap, 
  AlertTriangle, 
  Calendar,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Loader2,
  Info,
  CheckCircle2,
  Circle,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeMaturity, MaturityScore, AnalysisReport } from './services/gemini';

const KNOWLEDGE_AREAS = [
  { name: 'Data Governance', icon: ShieldCheck, description: 'Strategy, policy, and management' },
  { name: 'Data Architecture', icon: Database, description: 'Data flow and blueprint' },
  { name: 'Data Modeling & Design', icon: LayoutDashboard, description: 'Database schema and structure' },
  { name: 'Data Storage & Ops', icon: Database, description: 'Physical database management' },
  { name: 'Data Security', icon: Lock, description: 'Access control and privacy' },
  { name: 'Integration & Interoperability', icon: Share2, description: 'Moving data between systems' },
  { name: 'Document & Content', icon: FileText, description: 'Unstructured data management' },
  { name: 'Reference & Master Data', icon: Library, description: 'Uniform enterprise identifiers' },
  { name: 'Data Warehousing & BI', icon: BarChart3, description: 'Reporting and analysis' },
  { name: 'Metadata Management', icon: Search, description: 'Data about data context' },
  { name: 'Data Quality', icon: TrendingUp, description: 'Accuracy and consistency' },
];

export default function App() {
  const [scores, setScores] = useState<Record<string, number>>(
    KNOWLEDGE_AREAS.reduce((acc, area) => ({ ...acc, [area.name]: 3 }), {})
  );
  const [confidence, setConfidence] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [showRubric, setShowRubric] = useState(false);

  const MATURITY_LEVELS: Record<number, { label: string; desc: string }> = {
    1: { label: 'Initial', desc: 'Success depends on individual heroics; data is siloed and managed reactively with no formal process.' },
    2: { label: 'Developing', desc: 'Standard rituals are followed within specific departments but lack consistent enterprise-wide alignment.' },
    3: { label: 'Defined', desc: 'A formal enterprise-wide standard is documented and strictly followed across all operational domains.' },
    4: { label: 'Managed', desc: 'Process performance is quantitatively measured, audited for quality, and governed by executive KPIs.' },
    5: { label: 'Optimized', desc: 'Processes are continuously optimized via advanced automation, self-healing logic, and AI-driven governance.' },
  };

  const handleScoreChange = (area: string, val: number) => {
    setScores(prev => ({ ...prev, [area]: val }));
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const formattedScores: MaturityScore[] = Object.entries(scores).map(([area, score]) => ({
        area,
        score: score as number
      }));
      const result = await analyzeMaturity(formattedScores, confidence);
      setReport(result);
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chartData = KNOWLEDGE_AREAS.map(area => ({
    subject: area.name,
    A: scores[area.name],
    fullMark: 5,
  }));

  const scoreValues = Object.values(scores) as number[];
  const overallScore = (scoreValues.reduce((a, b) => a + b, 0) / KNOWLEDGE_AREAS.length).toFixed(1);

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR: Controls & Inputs */}
      <aside className="w-80 lg:w-96 flex flex-col border-r border-slate-200 bg-white z-20 shadow-xl overflow-hidden shrink-0">
        <header className="p-6 border-bottom border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-200 shadow-lg">
              <BrainCircuit className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">DAMA Evaluator</h1>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Strategic Tool</p>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Assessment Heading */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5" />
                Maturity Sliders
              </h3>
              <button 
                onClick={() => setShowRubric(!showRubric)}
                className={`p-1.5 rounded-md transition-all ${showRubric ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Maturity Criteria"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Rubric View */}
            <AnimatePresence>
              {showRubric && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-6 space-y-3 overflow-hidden"
                >
                  <div className="bg-slate-900 rounded-xl p-4 text-white">
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-3 text-center">Reference Guide</p>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((lv) => (
                        <div key={lv} className="flex gap-3">
                          <span className="w-5 h-5 shrink-0 bg-blue-600 flex items-center justify-center rounded font-bold text-[10px]">{lv}</span>
                          <div>
                            <p className="text-[10px] font-bold leading-none mb-1">{MATURITY_LEVELS[lv].label}</p>
                            <p className="text-[8px] text-slate-400 leading-tight">{MATURITY_LEVELS[lv].desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sliders */}
            <div className="space-y-6">
              {KNOWLEDGE_AREAS.map((area) => (
                <div key={area.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-semibold text-slate-600">{area.name}</span>
                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{scores[area.name]}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={scores[area.name]}
                    onChange={(e) => handleScoreChange(area.name, parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                  />
                  <div className="mt-1.5 flex flex-col">
                    <p className="text-[9px] font-black text-blue-500 uppercase tracking-tighter leading-none mb-0.5">
                      {MATURITY_LEVELS[scores[area.name]].label}
                    </p>
                    <p className="text-[8px] text-slate-400 leading-tight italic">
                      {MATURITY_LEVELS[scores[area.name]].desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Confidence Slider */}
          <section className="pt-6 border-t border-slate-100">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Assessment Confidence</label>
            <div className="flex p-1 bg-slate-50 rounded-xl gap-1">
              {(['Low', 'Medium', 'High'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setConfidence(level)}
                  className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${
                    confidence === level 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Action Footer */}
        <div className="p-6 bg-white border-t border-slate-100">
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 disabled:opacity-70"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span className="animate-pulse">Processing Report...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-blue-400 fill-blue-400" />
                Analyze Capability
              </>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT: Visualization & Report */}
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar p-8">
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
          
          {/* Top Row: KPIs and Charts */}
          <div className="grid grid-cols-12 gap-6">
            
            {/* Overall Score Billboard */}
            <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 rounded-3xl p-8 flex flex-col shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 relative z-10">Total Maturity</span>
              <div className="flex items-baseline gap-2 mb-6 relative z-10">
                <span className="text-7xl font-black text-slate-900 tracking-tighter">{overallScore}</span>
                <span className="text-2xl text-slate-300 font-bold">/ 5.0</span>
              </div>
              <div className="mt-auto space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                    {Number(overallScore) < 2 ? 'Initial' : Number(overallScore) < 3 ? 'Repeatable' : Number(overallScore) < 4 ? 'Defined' : 'Managed'}
                  </p>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {Number(overallScore) < 2 
                    ? 'Processes are siloed and reactive. Efficiency is manually driven by key individuals.'
                    : Number(overallScore) < 3 
                    ? 'Standards exist but lack global alignment. Success is consistent locally.'
                    : 'A formal enterprise-wide standard is strictly followed and governed.'}
                </p>
              </div>
            </div>

            {/* Capability Profile Radar */}
            <div className="col-span-12 md:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm overflow-hidden h-[400px]">
              <div className="flex items-center justify-between mb-4 px-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Capability Profile</h3>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
              </div>
              <div className="w-full h-full flex items-center justify-center -mt-4 overflow-visible">
                <ResponsiveContainer width="100%" height="90%">
                  <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
                    <PolarGrid stroke="#F1F5F9" />
                    <PolarAngleAxis 
                      dataKey="subject" 
                      tick={{ fontSize: 9, fill: '#64748B', fontWeight: 600, width: 100 }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 5]} 
                      ticks={[1, 2, 3, 4, 5]} 
                      tick={{ fontSize: 10, fill: '#CBD5E1' }}
                      hide
                    />
                    <Radar
                      name="Maturity"
                      dataKey="A"
                      stroke="#2563EB"
                      fill="#2563EB"
                      fillOpacity={0.15}
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Analysis Viewport */}
          <AnimatePresence mode="wait">
            {!report && !isAnalyzing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-white border-2 border-dashed border-slate-200 rounded-3xl py-24 flex flex-col items-center justify-center text-center px-6"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <FileText className="w-10 h-10 text-slate-300" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Awaiting Assessment Data</h2>
                <p className="text-slate-500 max-w-lg text-sm">
                  Adjust the sliders on the left and click "Analyze Capability" to generate your enterprise-grade DAMA maturity report, including risks and roadmap.
                </p>
              </motion.div>
            )}

            {report && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-8"
              >
                {/* Insights Row 1 */}
                <div className="grid grid-cols-12 gap-6">
                  
                  {/* Summary & Wins */}
                  <div className="col-span-12 lg:col-span-8 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-6">Executive Insight</h3>
                      <p className="text-xl font-bold text-slate-800 leading-relaxed tracking-tight">
                        {report.summary}
                      </p>
                    </div>

                    <div className="bg-blue-600 rounded-3xl p-8 shadow-xl shadow-blue-100 text-white relative overflow-hidden">
                      <Zap className="absolute top-6 right-8 w-24 h-24 text-white/10 fill-white/5" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-blue-200 mb-6 flex items-center gap-2">
                        <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                        Tactical Quick Wins
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {report.quickWins.map((win, i) => (
                          <div key={i} className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                            <p className="text-sm font-bold leading-tight">{win}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Risks & Gaps */}
                  <div className="col-span-12 lg:col-span-4 bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6">Strategic Risks</h3>
                    <div className="space-y-6">
                      {report.risks.map((risk, i) => (
                        <div key={i} className="group cursor-default">
                          <p className="text-sm font-black text-rose-400 mb-1 group-hover:text-rose-300 transition-colors uppercase tracking-tight">
                            {risk.split(':')[0]}
                          </p>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            {risk.includes(':') ? risk.split(':')[1] : risk}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-12 pt-6 border-t border-slate-800">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Urgent Mitigation Required</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Grid */}
                <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 flex gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> STABLE
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> ACTIVE
                    </div>
                  </div>
                  
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-10 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Implementation Horizon 2026
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {report.roadmap.map((item, i) => {
                      const isActive = i === 0;
                      return (
                        <div key={i} className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-500 ${
                          isActive ? 'bg-blue-50/50 border-blue-200 shadow-lg shadow-blue-50' : 'border-slate-100 hover:border-slate-200 opacity-80'
                        }`}>
                          <div className="flex justify-between items-center mb-4">
                            <span className={`text-[10px] font-black tracking-widest uppercase ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>
                              {item.month}
                            </span>
                            {isActive && <Zap className="w-4 h-4 text-blue-500 fill-blue-500" />}
                          </div>
                          
                          <div className="space-y-4 mb-8">
                            {item.actions.map((act, idx) => (
                              <div key={idx} className="flex gap-3 items-start">
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isActive ? 'bg-blue-500' : 'bg-slate-300'}`} />
                                <p className={`text-xs font-bold leading-tight ${isActive ? 'text-slate-800' : 'text-slate-600'}`}>
                                  {act}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-auto pt-6 border-t border-slate-100 italic text-[10px] text-slate-400 text-center">
                            Strategic Phase {i + 1}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Final Insights Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 mb-6 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> Competitive Advantages
                    </h3>
                    <div className="space-y-4">
                      {report.strengths.map((str, i) => (
                        <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-emerald-100/50">
                          <span className="w-6 h-6 shrink-0 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center font-black text-[10px]">{i + 1}</span>
                          <p className="text-xs font-bold text-slate-800">{str}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-rose-50/50 border border-rose-100 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-xs font-black uppercase tracking-widest text-rose-600 mb-6 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Priority Gaps
                    </h3>
                    <div className="space-y-4">
                      {report.weaknesses.map((gap, i) => (
                        <div key={i} className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-rose-100/50">
                          <span className="w-6 h-6 shrink-0 bg-rose-100 text-rose-700 rounded-lg flex items-center justify-center font-black text-[10px]">{i + 1}</span>
                          <p className="text-xs font-bold text-slate-800">{gap}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}} />
    </div>
  );
}


