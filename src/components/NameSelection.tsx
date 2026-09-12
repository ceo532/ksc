import React from 'react';
import { StudentName } from '../types.ts';
import { GraduationCap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface NameSelectionProps {
  selectedStudent: StudentName | '';
  onSelectStudent: (name: StudentName) => void;
  onStartQuiz: () => void;
}

const STUDENTS: StudentName[] = ['Bảo Khuê', 'Duy Sang', 'Minh Chi'];

export const NameSelection: React.FC<NameSelectionProps> = ({
  selectedStudent,
  onSelectStudent,
  onStartQuiz,
}) => {
  return (
    <div id="name-selection-container" className="w-full max-w-xl mx-auto px-4 py-8 sm:py-12">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/25 mb-4 ring-4 ring-sky-100">
          <GraduationCap className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Bài Tập Trắc Nghiệm Tiếng Anh Lớp 7
        </h1>
        <p className="mt-2 text-slate-600 text-base sm:text-lg">
          Luyện tập kiến thức học kỳ với 40 câu hỏi trắc nghiệm
        </p>
      </div>

      {/* Main Selection Card */}
      <div 
        id="name-selection-card"
        className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100"
      >
        <div className="flex items-center gap-2 mb-6 text-sky-700 font-medium bg-sky-50 py-2.5 px-4 rounded-xl border border-sky-100/80">
          <Sparkles className="w-5 h-5 text-sky-500 shrink-0" />
          <span className="text-sm sm:text-base">Chào mừng em đến với phòng thi trực tuyến!</span>
        </div>

        <div className="space-y-6">
          <div>
            <label 
              htmlFor="student-select" 
              className="block text-base font-bold text-slate-800 mb-2"
            >
              Chọn tên của em <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="student-select"
                value={selectedStudent}
                onChange={(e) => onSelectStudent(e.target.value as StudentName)}
                className="w-full text-base sm:text-lg px-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-sky-500 focus:bg-white transition-all cursor-pointer shadow-xs font-medium"
              >
                <option value="" disabled>-- Vui lòng chọn tên của em --</option>
                {STUDENTS.map((name) => (
                  <option key={name} value={name} className="py-2">
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              * Bắt buộc chọn tên trước khi bắt đầu làm bài
            </p>
          </div>

          {/* Quick selection chips for convenient mobile tap */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Hoặc bấm chọn nhanh tên em:
            </span>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {STUDENTS.map((name) => {
                const isSelected = selectedStudent === name;
                return (
                  <button
                    key={`quick-${name}`}
                    id={`quick-select-${name}`}
                    type="button"
                    onClick={() => onSelectStudent(name)}
                    className={`py-2.5 px-3 rounded-xl text-sm sm:text-base font-semibold border-2 transition-all text-center flex items-center justify-center gap-1.5 ${
                      isSelected
                        ? 'bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                    <span className="truncate">{name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-2">
            <button
              id="btn-start-quiz"
              type="button"
              disabled={!selectedStudent}
              onClick={onStartQuiz}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg flex items-center justify-center gap-3 transition-all ${
                selectedStudent
                  ? 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white shadow-lg shadow-sky-600/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <span>Bắt đầu làm bài</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quiz Info Badges */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500">Số lượng câu hỏi</div>
            <div className="text-base font-bold text-slate-700 mt-0.5">40 câu trắc nghiệm</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-xs text-slate-500">Hình thức chấm</div>
            <div className="text-base font-bold text-emerald-600 mt-0.5">Tự động chấm điểm</div>
          </div>
        </div>
      </div>
    </div>
  );
};
