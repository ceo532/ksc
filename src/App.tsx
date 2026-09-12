import { useState } from 'react';
import { QUESTIONS } from './data/questions.ts';
import { ScreenState, StudentName } from './types.ts';
import { NameSelection } from './components/NameSelection.tsx';
import { QuizScreen } from './components/QuizScreen.tsx';
import { ResultScreen } from './components/ResultScreen.tsx';
import { BookOpen } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('SELECT_NAME');
  const [selectedStudent, setSelectedStudent] = useState<StudentName | ''>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Handlers
  const handleSelectStudent = (name: StudentName) => {
    setSelectedStudent(name);
  };

  const handleStartQuiz = () => {
    if (!selectedStudent) return;
    setAnswers({});
    setCurrentIndex(0);
    setScreen('QUIZ');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectAnswer = (questionIndex: number, optionKey: 'A' | 'B' | 'C' | 'D') => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionKey,
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < QUESTIONS.length) {
      setCurrentIndex(index);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitQuiz = () => {
    setScreen('RESULT');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSelectedStudent('');
    setScreen('SELECT_NAME');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 selection:bg-sky-200 selection:text-sky-900">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-none">
                English 7 Quiz
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Trắc nghiệm Tiếng Anh Lớp 7
              </span>
            </div>
          </div>

          {screen !== 'SELECT_NAME' && selectedStudent && (
            <div className="flex items-center gap-2 bg-sky-50 text-sky-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border border-sky-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="truncate max-w-[120px] sm:max-w-none">{selectedStudent}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-start py-4 sm:py-6">
        {screen === 'SELECT_NAME' && (
          <NameSelection
            selectedStudent={selectedStudent}
            onSelectStudent={handleSelectStudent}
            onStartQuiz={handleStartQuiz}
          />
        )}

        {screen === 'QUIZ' && selectedStudent && (
          <QuizScreen
            questions={QUESTIONS}
            studentName={selectedStudent}
            currentIndex={currentIndex}
            answers={answers}
            onSelectAnswer={handleSelectAnswer}
            onNextQuestion={handleNextQuestion}
            onPrevQuestion={handlePrevQuestion}
            onJumpToQuestion={handleJumpToQuestion}
            onSubmitQuiz={handleSubmitQuiz}
          />
        )}

        {screen === 'RESULT' && selectedStudent && (
          <ResultScreen
            questions={QUESTIONS}
            studentName={selectedStudent}
            answers={answers}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>© 2026 Bài Tập Trắc Nghiệm Tiếng Anh Lớp 7 • Dành cho học sinh rèn luyện kiến thức</p>
      </footer>
    </div>
  );
}
