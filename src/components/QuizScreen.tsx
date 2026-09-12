import React from 'react';
import { Question, StudentName } from '../types.ts';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Send, 
  User, 
  HelpCircle,
  Clock
} from 'lucide-react';

interface QuizScreenProps {
  questions: Question[];
  studentName: StudentName;
  currentIndex: number;
  answers: Record<number, string>;
  onSelectAnswer: (questionIndex: number, optionKey: 'A' | 'B' | 'C' | 'D') => void;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onJumpToQuestion: (index: number) => void;
  onSubmitQuiz: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({
  questions,
  studentName,
  currentIndex,
  answers,
  onSelectAnswer,
  onNextQuestion,
  onPrevQuestion,
  onJumpToQuestion,
  onSubmitQuiz,
}) => {
  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const currentAnswer = answers[currentIndex];
  
  // Calculate progress
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const options: Array<{ key: 'A' | 'B' | 'C' | 'D'; text: string }> = [
    { key: 'A', text: currentQ.A },
    { key: 'B', text: currentQ.B },
    { key: 'C', text: currentQ.C },
    { key: 'D', text: currentQ.D },
  ];

  return (
    <div id="quiz-screen-container" className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-8">
      {/* Top Header with Student Info and Progress */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Học sinh</span>
              <span className="text-sm sm:text-base font-bold text-slate-800">{studentName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Tiến trình</span>
              <span className="text-sm sm:text-base font-extrabold text-sky-600">
                Câu {currentIndex + 1}/{totalQuestions}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Đã làm: {answeredCount}/{totalQuestions}</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            id="quiz-progress-bar"
            className="bg-sky-500 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div 
        id={`question-card-${currentQ.cau}`}
        className="bg-white rounded-2xl p-5 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-6 transition-all"
      >
        {/* Question Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-sky-100 text-sky-800 border border-sky-200">
            <HelpCircle className="w-3.5 h-3.5" />
            Câu {currentQ.cau} / {totalQuestions}
          </span>
          <span className="text-xs text-slate-400 font-medium sm:hidden">
            Đã làm: {answeredCount}/{totalQuestions}
          </span>
        </div>

        {/* Question Text (Exact original English) */}
        <div className="mb-6">
          <h2 
            id={`question-text-${currentQ.cau}`}
            className="text-lg sm:text-xl font-bold text-slate-800 leading-relaxed"
          >
            {currentQ.hoi}
          </h2>
        </div>

        {/* 4 Options (A, B, C, D) */}
        <div className="space-y-3 sm:space-y-3.5">
          {options.map((opt) => {
            const isSelected = currentAnswer === opt.key;
            return (
              <button
                key={opt.key}
                id={`option-${currentQ.cau}-${opt.key}`}
                type="button"
                onClick={() => onSelectAnswer(currentIndex, opt.key)}
                className={`w-full text-left p-4 sm:p-4.5 rounded-xl border-2 transition-all flex items-center gap-3.5 cursor-pointer group ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/80 shadow-md shadow-sky-500/10'
                    : 'border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/80'
                }`}
              >
                {/* Option Letter Badge */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all shrink-0 ${
                    isSelected
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 group-hover:bg-sky-100 group-hover:text-sky-700'
                  }`}
                >
                  {opt.key}
                </div>

                {/* Option Text (Exact original English) */}
                <span
                  className={`text-base sm:text-lg font-medium flex-1 leading-snug ${
                    isSelected ? 'text-sky-950 font-semibold' : 'text-slate-700'
                  }`}
                >
                  {opt.text}
                </span>

                {/* Selection Indicator */}
                <div className="shrink-0">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Reminder if not yet selected */}
        {!currentAnswer && (
          <p className="mt-4 text-xs sm:text-sm text-amber-600 font-medium bg-amber-50 py-2 px-3 rounded-lg border border-amber-200/60 flex items-center gap-1.5">
            <Clock className="w-4 h-4 shrink-0" />
            Em hãy chọn 1 đáp án để tiếp tục câu tiếp theo nhé!
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            id="btn-prev-question"
            type="button"
            disabled={currentIndex === 0}
            onClick={onPrevQuestion}
            className={`py-3 px-4 sm:px-5 rounded-xl text-sm sm:text-base font-semibold flex items-center gap-2 transition-all ${
              currentIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400 bg-slate-100'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Câu trước</span>
          </button>

          {isLastQuestion ? (
            <button
              id="btn-submit-quiz"
              type="button"
              disabled={!currentAnswer}
              onClick={onSubmitQuiz}
              className={`py-3.5 px-6 sm:px-8 rounded-xl text-base font-bold flex items-center gap-2.5 transition-all shadow-lg ${
                currentAnswer
                  ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-600/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Nộp bài</span>
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-next-question"
              type="button"
              disabled={!currentAnswer}
              onClick={onNextQuestion}
              className={`py-3.5 px-6 sm:px-7 rounded-xl text-base font-bold flex items-center gap-2 transition-all shadow-md ${
                currentAnswer
                  ? 'bg-sky-600 hover:bg-sky-700 active:scale-95 text-white shadow-sky-600/25 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Câu tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Question Quick Jump Matrix */}
      <div 
        id="question-matrix-container"
        className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider">
            Danh sách 40 câu hỏi
          </h3>
          <span className="text-xs text-slate-500">
            Bấm vào số câu để xem lại
          </span>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {questions.map((q, idx) => {
            const isAnswered = answers[idx] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.cau}
                id={`jump-question-${q.cau}`}
                type="button"
                onClick={() => onJumpToQuestion(idx)}
                title={`Câu ${q.cau}${isAnswered ? ' (Đã chọn)' : ' (Chưa làm)'}`}
                className={`h-8 sm:h-9 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  isCurrent
                    ? 'ring-2 ring-sky-500 ring-offset-1 bg-sky-500 text-white font-extrabold shadow-sm'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {q.cau}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-sky-500 inline-block"></span>
            <span>Đang làm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block"></span>
            <span>Đã chọn</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block"></span>
            <span>Chưa làm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
