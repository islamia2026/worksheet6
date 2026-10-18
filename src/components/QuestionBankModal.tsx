import React, { useState } from 'react';
import { UNITS_DATA } from '../data/questionsData';
import { IslamicField, Question } from '../types';
import {
  BookOpen,
  Search,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all');
  const [selectedField, setSelectedField] = useState<IslamicField | 'all'>('all');
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  // Flatten all 80 questions with lesson and unit info
  const allQuestions: (Question & { lessonTitle: string; unitTitle: string })[] = [];
  UNITS_DATA.forEach((u) => {
    u.lessons.forEach((l) => {
      l.questions.forEach((q) => {
        allQuestions.push({
          ...q,
          lessonTitle: l.title,
          unitTitle: u.title,
        });
      });
    });
  });

  const filteredQuestions = allQuestions.filter((q) => {
    const matchesUnit = selectedUnit === 'all' || q.unitId === selectedUnit;
    const matchesField = selectedField === 'all' || q.field === selectedField;
    const matchesSearch =
      !searchQuery.trim() ||
      q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesUnit && matchesField && matchesSearch;
  });

  const toggleReveal = (id: string) => {
    sounds.playClick();
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const fields: IslamicField[] = [
    'العقيدة',
    'الحديث الشريف',
    'الفقه',
    'السيرة النبوية',
    'التهذيب',
    'الثقافة الإسلامية',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#17436A]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFFFFF] rounded-3xl shadow-xl border-2 border-[#BCEBDD] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#17436A] text-white p-5 sm:p-6 flex items-center justify-between border-b-2 border-[#BCEBDD]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#BCEBDD] text-[#17436A] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5 text-[#17436A]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                بنك الأسئلة الوزاري الشامل (80 سؤالاً)
              </h2>
              <p className="text-xs text-[#BCEBDD] font-bold">
                منهج التربية الإسلامية للصف السادس – الفصل الأول مع الإجابات النموذجية المعتمدة
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 sm:p-5 bg-[#F8FBFF] border-b-2 border-[#BCEBDD] space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#17436A]/50 absolute right-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في نص السؤال، أو الإجابة، أو اسم الدرس..."
                className="w-full pr-10 pl-4 py-2.5 bg-[#FFFFFF] border-2 border-[#BCEBDD] text-[#17436A] rounded-xl text-sm focus:outline-none focus:border-[#17436A] font-bold"
              />
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setShowAllAnswers(!showAllAnswers);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#FFFFFF] border-2 border-[#BCEBDD] hover:border-[#17436A] text-[#17436A] text-xs font-black rounded-xl flex items-center justify-center gap-2 transition"
            >
              {showAllAnswers ? (
                <>
                  <EyeOff className="w-4 h-4 text-[#17436A]" />
                  <span>إخفاء جميع الإجابات للمراجعة</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 text-[#17436A]" />
                  <span>إظهار جميع الإجابات النموذجية</span>
                </>
              )}
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-[#17436A]/75">الوحدات:</span>
            <button
              onClick={() => setSelectedUnit('all')}
              className={`px-2.5 py-1 rounded-lg font-black transition ${
                selectedUnit === 'all'
                  ? 'bg-[#17436A] text-white'
                  : 'bg-[#FFFFFF] border border-[#BCEBDD] text-[#17436A] hover:bg-[#BCEBDD]/30'
              }`}
            >
              الكل
            </button>
            {[1, 2, 3, 4].map((u) => (
              <button
                key={u}
                onClick={() => setSelectedUnit(u)}
                className={`px-2.5 py-1 rounded-lg font-black transition ${
                  selectedUnit === u
                    ? 'bg-[#17436A] text-white'
                    : 'bg-[#FFFFFF] border border-[#BCEBDD] text-[#17436A] hover:bg-[#BCEBDD]/30'
                }`}
              >
                الوحدة {u}
              </button>
            ))}

            <div className="h-4 w-px bg-[#BCEBDD] mx-1"></div>

            <span className="font-bold text-[#17436A]/75">المجال:</span>
            <button
              onClick={() => setSelectedField('all')}
              className={`px-2.5 py-1 rounded-lg font-black transition ${
                selectedField === 'all'
                  ? 'bg-[#17436A] text-white'
                  : 'bg-[#FFFFFF] border border-[#BCEBDD] text-[#17436A] hover:bg-[#BCEBDD]/30'
              }`}
            >
              الكل
            </button>
            {fields.map((f) => (
              <button
                key={f}
                onClick={() => setSelectedField(f)}
                className={`px-2.5 py-1 rounded-lg font-black transition ${
                  selectedField === f
                    ? 'bg-[#BCEBDD] text-[#17436A] border border-[#17436A]/20'
                    : 'bg-[#FFFFFF] border border-[#BCEBDD] text-[#17436A] hover:bg-[#BCEBDD]/30'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#F8FBFF]">
          <div className="flex items-center justify-between text-xs font-bold text-[#17436A]/70 pb-2">
            <span>الأسئلة المعروضة: {filteredQuestions.length} سؤالاً</span>
            <span>مرتبة حسب الوحدات والدروس المعتمدة في المنهج</span>
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="py-12 text-center text-[#17436A]/40">
              <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-black">لا توجد أسئلة تطابق البحث المحدد.</p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isAnswerRevealed = showAllAnswers || !!revealedIds[q.id];

              return (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl border-2 border-[#BCEBDD] bg-[#FFFFFF] hover:border-[#17436A] transition space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black bg-[#17436A] text-white px-2.5 py-0.5 rounded-lg">
                        {q.unitTitle}
                      </span>
                      <span className="text-[11px] font-bold text-[#17436A]/80">
                        الدرس: {q.lessonTitle}
                      </span>
                      <span className="text-[11px] font-bold text-[#17436A] bg-[#BCEBDD] px-2 py-0.5 rounded-md">
                        {q.field}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleReveal(q.id)}
                      className="text-xs font-black text-[#17436A] bg-[#BCEBDD]/40 hover:bg-[#BCEBDD] px-3 py-1 rounded-xl transition flex items-center gap-1"
                    >
                      {isAnswerRevealed ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>إخفاء الحل</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>كشف الحل</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-[#17436A] leading-relaxed">
                    <span className="text-[#17436A] font-black ml-1.5">
                      س{q.questionNumber}:
                    </span>
                    {q.prompt}
                  </p>

                  {/* Options if applicable */}
                  {q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#17436A] bg-[#F8FBFF] border border-[#BCEBDD] p-2.5 rounded-xl font-semibold">
                      {q.options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="font-black text-[#17436A]">({['أ', 'ب', 'ج', 'د'][i]}):</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Model Answer Box */}
                  {isAnswerRevealed && (
                    <div className="p-3 bg-[#BCEBDD] border border-[#17436A]/20 rounded-xl text-xs text-[#17436A] flex items-start gap-2 animate-in fade-in font-bold">
                      <CheckCircle2 className="w-4 h-4 text-[#17436A] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-[#17436A]">الإجابة النموذجية المعتمدة: </span>
                        <span className="font-bold underline">{q.correctAnswer}</span>
                        {q.explanation && (
                          <p className="text-[11px] text-[#17436A]/90 mt-1">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
