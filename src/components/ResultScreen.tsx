import React, { useEffect, useRef, useState } from 'react';
import { Question, StudentName } from '../types.ts';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Award, 
  Check, 
  X, 
  Filter,
  User,
  Sparkles
} from 'lucide-react';

interface ResultScreenProps {
  questions: Question[];
  studentName: StudentName;
  answers: Record<number, string>;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  questions,
  studentName,
  answers,
  onRestart,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'incorrect'>('all');
  const hasSentWebhook = useRef(false);

  // Calculate score
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (answers[idx] === q.dapAn) {
      correctCount += 1;
    }
  });

  const totalQuestions = questions.length;
  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Send result to Google Sheet + Telegram Webhook on mount
  useEffect(() => {
    if (hasSentWebhook.current) return;
    hasSentWebhook.current = true;

    const sendPayload = async () => {
      const payload = {
        ten: studentName,
        lop: "7",
        diem: correctCount, // Số câu đúng thô, KHÔNG tự quy đổi thang 10
        tongCau: totalQuestions,
        url: typeof window !== 'undefined' ? window.location.href : '',
      };

      try {
        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbw00EtPyhylfx8ZUg3o7CFvc5g44RK17byvTJqy8kMY6grcfIVpTAT7Enu9NenGnBFR/exec',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          }
        );
        console.log('Đã gửi kết quả bài làm thành công:', response.status);
      } catch (error) {
        // Không cần hiện lỗi ra màn hình nếu request thất bại, chỉ log ra console
        console.warn('Lỗi khi gửi kết quả webhook (đã log, không ảnh hưởng học sinh):', error);
      }
    };

    sendPayload();
  }, [studentName, correctCount, totalQuestions]);

  // Encouraging feedback
  const getFeedback = () => {
    if (correctCount >= 36) {
      return {
        title: 'Xuất sắc tuyệt vời!',
        desc: 'Em nắm vững toàn bộ kiến thức tiếng Anh lớp 7! Tiếp tục phát huy nhé!',
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
      };
    }
    if (correctCount >= 30) {
      return {
        title: 'Làm bài rất tốt!',
        desc: 'Em đã đạt kết quả rất cao! Hãy xem lại các câu sai để hoàn thiện hơn nhé!',
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 border-emerald-200',
      };
    }
    if (correctCount >= 20) {
      return {
        title: 'Khá tốt, cố gắng lên!',
        desc: 'Em đã hoàn thành bài tập với kết quả khá. Hãy ôn tập lại các phần ngữ pháp chưa vững nhé!',
        color: 'text-sky-600',
        bg: 'bg-sky-50 border-sky-200',
      };
    }
    return {
      title: 'Cần nỗ lực thêm nhé!',
      desc: 'Đừng nản lòng! Hãy xem lại đáp án chi tiết bên dưới, ôn kỹ từ vựng và thử làm lại một lần nữa nhé!',
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
    };
  };

  const feedback = getFeedback();

  // Filtered questions
  const filteredQuestions = questions.filter((q, idx) => {
    const isCorrect = answers[idx] === q.dapAn;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div id="result-screen-container" className="w-full max-w-3xl mx-auto px-4 py-6 sm:py-10">
      {/* Top Congratulation Banner */}
      <div 
        id="score-summary-card"
        className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-100 text-center mb-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 text-amber-500 mb-4 ring-8 ring-amber-50">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sky-100 text-sky-800 rounded-full text-sm font-semibold mb-3">
          <User className="w-3.5 h-3.5" />
          <span>Học sinh: {studentName}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">
          Kết Quả Bài Tập Tiếng Anh Lớp 7
        </h1>

        {/* Highlighted exact required message: "Em đúng X/40 câu" */}
        <div 
          id="exact-score-text"
          className="my-5 py-4 px-6 bg-slate-50 border-2 border-sky-100 rounded-2xl inline-block"
        >
          <div className="text-3xl sm:text-4xl font-black text-sky-600 tracking-tight">
            Em đúng {correctCount}/{totalQuestions} câu
          </div>
          <div className="text-sm font-semibold text-slate-500 mt-1">
            Đạt độ chính xác {percentage}%
          </div>
        </div>

        {/* Motivational banner */}
        <div className={`mt-2 p-4 rounded-2xl border ${feedback.bg} text-left sm:text-center max-w-lg mx-auto`}>
          <div className={`font-bold text-base sm:text-lg flex items-center gap-2 justify-start sm:justify-center ${feedback.color}`}>
            <Sparkles className="w-5 h-5" />
            <span>{feedback.title}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {feedback.desc}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80">
            <div className="flex items-center justify-center gap-1.5 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Số câu đúng</span>
            </div>
            <div className="text-2xl font-black text-emerald-700">{correctCount}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80">
            <div className="flex items-center justify-center gap-1.5 text-rose-700 text-xs font-bold uppercase tracking-wider mb-1">
              <XCircle className="w-4 h-4" />
              <span>Số câu sai</span>
            </div>
            <div className="text-2xl font-black text-rose-700">{incorrectCount}</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-sky-50 border border-sky-200/80">
            <div className="flex items-center justify-center gap-1.5 text-sky-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Tổng số câu</span>
            </div>
            <div className="text-2xl font-black text-sky-700">{totalQuestions} câu</div>
          </div>
        </div>

        {/* Restart Button */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
          <button
            id="btn-restart-quiz"
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto min-w-56 py-3.5 px-8 rounded-xl font-bold text-base text-white bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Làm lại từ đầu</span>
          </button>
        </div>
      </div>

      {/* Review Section */}
      <div id="review-questions-section" className="space-y-4">
        {/* Review Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-slate-800 text-sm sm:text-base">
              Chi tiết bài làm ({filteredQuestions.length}/{totalQuestions} câu)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              id="filter-all"
              type="button"
              onClick={() => setFilterMode('all')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Tất cả ({totalQuestions})
            </button>
            <button
              id="filter-correct"
              type="button"
              onClick={() => setFilterMode('correct')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'correct'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>Đúng ({correctCount})</span>
            </button>
            <button
              id="filter-incorrect"
              type="button"
              onClick={() => setFilterMode('incorrect')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'incorrect'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <X className="w-3 h-3" />
              <span>Sai ({incorrectCount})</span>
            </button>
          </div>
        </div>

        {/* Questions Detailed List */}
        <div className="space-y-4">
          {filteredQuestions.map((q) => {
            const originalIndex = q.cau - 1;
            const selectedOptKey = answers[originalIndex];
            const isCorrect = selectedOptKey === q.dapAn;
            
            const optionMap: Record<string, string> = {
              A: q.A,
              B: q.B,
              C: q.C,
              D: q.D,
            };

            return (
              <div
                key={q.cau}
                id={`review-question-${q.cau}`}
                className={`bg-white rounded-2xl p-5 sm:p-6 border-2 transition-all shadow-xs ${
                  isCorrect
                    ? 'border-emerald-200 hover:border-emerald-300'
                    : 'border-rose-200 hover:border-rose-300'
                }`}
              >
                {/* Header: Question number and Correct/Incorrect badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-extrabold text-sm text-slate-700 bg-slate-100 py-1 px-3 rounded-lg">
                    Câu {q.cau}
                  </span>

                  {isCorrect ? (
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Đúng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      Sai
                    </span>
                  )}
                </div>

                {/* Original Question Prompt */}
                <p className="text-base sm:text-lg font-bold text-slate-800 mb-4 leading-relaxed">
                  {q.hoi}
                </p>

                {/* Answers Evaluation Comparison */}
                <div className="space-y-2 text-sm sm:text-base">
                  {/* Student Answer */}
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                      isCorrect
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : 'bg-rose-50/70 border-rose-200 text-rose-900'
                    }`}
                  >
                    <span className="font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 shrink-0 mt-0.5">
                      Em chọn:
                    </span>
                    <span className="font-medium">
                      {selectedOptKey ? (
                        <>
                          <strong className="font-bold mr-1.5">{selectedOptKey}.</strong>
                          {optionMap[selectedOptKey]}
                        </>
                      ) : (
                        <em className="text-slate-400">Chưa chọn đáp án</em>
                      )}
                    </span>
                  </div>

                  {/* Correct Answer (always shown so student can learn) */}
                  {!isCorrect && (
                    <div className="p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-start gap-2.5">
                      <span className="font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-600 text-white shrink-0 mt-0.5">
                        Đáp án đúng:
                      </span>
                      <span className="font-medium">
                        <strong className="font-bold mr-1.5">{q.dapAn}.</strong>
                        {optionMap[q.dapAn]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Repeat Action Button */}
        <div className="py-6 text-center">
          <button
            id="btn-bottom-restart"
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto min-w-56 py-3.5 px-8 rounded-xl font-bold text-base text-white bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-lg shadow-sky-600/25 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Làm lại từ đầu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
