import React, { useState } from 'react';
import { Unit, Lesson, StudentProfile } from '../types';
import { UNITS_DATA } from '../data/questionsData';
import {
  Sparkles,
  Star,
  CheckCircle2,
  Play,
  RotateCcw,
  Compass,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface JourneyMapProps {
  currentStudent: StudentProfile | null;
  onSelectLesson: (unit: Unit, lesson: Lesson) => void;
  onBackToHome: () => void;
  onRegisterStudent: () => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({
  currentStudent,
  onSelectLesson,
  onBackToHome,
  onRegisterStudent,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);

  const selectedUnit = UNITS_DATA.find((u) => u.id === selectedUnitId) || UNITS_DATA[0];

  const getLessonStatus = (lessonId: string) => {
    if (!currentStudent) return { label: 'لم يبدأ', color: 'text-[#17436A]/60 bg-[#F8FBFF] border border-[#17436A]/10', status: 'not_started' };
    const progress = currentStudent.lessonProgress[lessonId];
    if (!progress) return { label: 'لم يبدأ', color: 'text-[#17436A]/60 bg-[#F8FBFF] border border-[#17436A]/10', status: 'not_started' };
    if (progress.completed) return { label: 'مكتمل', color: 'text-[#17436A] bg-[#BCEBDD] border border-[#17436A]/20', status: 'completed' };
    return { label: 'جارٍ', color: 'text-[#17436A] bg-[#F8FBFF] border-2 border-[#17436A]', status: 'in_progress' };
  };

  const getLessonScore = (lessonId: string) => {
    if (!currentStudent) return null;
    return currentStudent.lessonProgress[lessonId] || null;
  };

  const handleLessonClick = (unit: Unit, lesson: Lesson) => {
    sounds.playClick();
    if (!currentStudent) {
      onRegisterStudent();
      return;
    }
    onSelectLesson(unit, lesson);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F8FBFF] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border-2 border-[#BCEBDD] shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17436A]/70">
              <button
                onClick={onBackToHome}
                className="hover:text-[#17436A] transition flex items-center gap-1 font-bold"
              >
                الرئيسية
              </button>
              <span>/</span>
              <span className="text-[#17436A] font-black">خريطة المراحل التعليمية</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#17436A] flex items-center gap-2">
              <Compass className="w-6 h-6 text-[#17436A]" />
              خريطة رحلة التميز (16 محطة معرفية)
            </h2>
            <p className="text-xs sm:text-sm text-[#17436A]/80 font-bold">
              يمكنك اختيار أي درس بحرية للمراجعة والتدرب، مع الحفاظ التام على سجل إنجازاتك.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-[#17436A] hover:bg-[#aee6d6] bg-[#BCEBDD] border border-[#17436A]/20 px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shrink-0"
          >
            <span>العودة للرئيسية</span>
            <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

        {/* 4 Unit Station Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {UNITS_DATA.map((unit) => {
            const isSelected = unit.id === selectedUnitId;
            const completedInUnit = unit.lessons.filter((l) =>
              currentStudent?.completedLessons.includes(l.id)
            ).length;
            const isFinished = completedInUnit === unit.lessons.length;

            return (
              <button
                key={unit.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedUnitId(unit.id);
                }}
                className={`relative p-4 rounded-2xl text-right transition-all border-2 flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#17436A] bg-[#BCEBDD]/30 shadow-xs -translate-y-0.5'
                    : 'border-[#BCEBDD] bg-[#FFFFFF] hover:bg-[#BCEBDD]/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg text-white bg-[#17436A]">
                      المحطة {unit.id}
                    </span>
                    {isFinished && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#17436A] bg-[#BCEBDD] px-2 py-0.5 rounded-full border border-[#17436A]/20">
                        <CheckCircle2 className="w-3 h-3 text-[#17436A]" />
                        منجزة
                      </span>
                    )}
                  </div>
                  <h4 className="font-black text-sm text-[#17436A]">{unit.title}</h4>
                  <p className="text-xs font-bold text-[#17436A]/80 mt-0.5">{unit.subtitle}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#BCEBDD] flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#17436A]/70">إنجاز الدروس</span>
                  <span className={isSelected ? 'text-[#17436A] font-black' : 'text-[#17436A]/80'}>
                    {completedInUnit} من {unit.lessons.length}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Unit Details & Stage Cards */}
        <div className="bg-[#FFFFFF] rounded-3xl p-5 sm:p-8 border-2 border-[#BCEBDD] shadow-xs space-y-6">
          {/* Unit Header in Solid Navy #17436A with White text and Mint accent */}
          <div className="p-6 rounded-2xl text-white bg-[#17436A] border-2 border-[#BCEBDD] relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#BCEBDD] text-[#17436A] px-3 py-1 rounded-full text-xs font-black">
                <Sparkles className="w-3.5 h-3.5" />
                <span>المحطة التعليمية {selectedUnit.id}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#F8FBFF]">{selectedUnit.title}</h3>
              <p className="text-sm font-semibold text-[#F8FBFF]/90">{selectedUnit.description}</p>
            </div>
          </div>

          {/* 4 Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedUnit.lessons.map((lesson, idx) => {
              const statusInfo = getLessonStatus(lesson.id);
              const scoreRecord = getLessonScore(lesson.id);
              const hasCompleted = scoreRecord?.completed;
              const stars = scoreRecord?.stars || 0;

              return (
                <div
                  key={lesson.id}
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    hasCompleted
                      ? 'border-[#BCEBDD] bg-[#BCEBDD]/20'
                      : 'border-[#BCEBDD]/60 hover:border-[#17436A] bg-[#FFFFFF]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#BCEBDD]/40 text-[#17436A]">
                        <span>المرحلة {idx + 1}</span>
                        <span>•</span>
                        <span className="text-[#17436A]">{lesson.field}</span>
                      </span>

                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-black text-[#17436A]">
                        الدرس {idx + 1}: {lesson.title}
                      </h4>
                      <p className="text-xs text-[#17436A]/75 font-semibold mt-1 flex items-center gap-2">
                        <span>5 أسئلة وزارية معتمدة</span>
                        <span>•</span>
                        <span>شامل الإجابات النموذجية</span>
                      </p>
                    </div>

                    {/* Score and Stars Bar */}
                    <div className="bg-[#F8FBFF] border border-[#BCEBDD] rounded-xl p-2.5 flex items-center justify-between text-xs font-bold">
                      <span className="text-[#17436A]/70">أفضل نتيجة:</span>
                      {scoreRecord ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-[#17436A]">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= stars
                                    ? 'fill-[#BCEBDD] text-[#17436A]'
                                    : 'text-[#17436A]/20 fill-transparent'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[#17436A] font-black">
                            {scoreRecord.score} / {scoreRecord.maxScore}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[#17436A]/50 font-normal">لم تختبر بعد</span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4 pt-3 border-t border-[#BCEBDD] flex items-center justify-between gap-3">
                    <span className="text-xs text-[#17436A]/60 font-semibold">
                      {scoreRecord?.attemptsCount ? `المحاولات: ${scoreRecord.attemptsCount}` : 'محاولة جديدة'}
                    </span>

                    <button
                      onClick={() => handleLessonClick(selectedUnit, lesson)}
                      className={`px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition ${
                        hasCompleted
                          ? 'bg-[#BCEBDD] text-[#17436A] border border-[#17436A]/20 hover:bg-[#aee6d6]'
                          : 'bg-[#17436A] hover:bg-[#0F2D48] text-white border-2 border-[#BCEBDD] shadow-xs'
                      }`}
                    >
                      {hasCompleted ? (
                        <>
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>أعد المحاولة</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-[#BCEBDD] text-[#BCEBDD]" />
                          <span>ابدأ الدرس</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Next/Prev Unit navigation */}
          <div className="pt-4 border-t border-[#BCEBDD] flex items-center justify-between">
            <button
              disabled={selectedUnitId <= 1}
              onClick={() => {
                sounds.playClick();
                setSelectedUnitId((prev) => Math.max(1, prev - 1));
              }}
              className="text-xs font-bold text-[#17436A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#BCEBDD]/30 flex items-center gap-1 px-3 py-2 rounded-lg transition"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-180" />
              <span>المحطة السابقة</span>
            </button>

            <span className="text-xs font-black text-[#17436A]">
              المحطة {selectedUnitId} من 4
            </span>

            <button
              disabled={selectedUnitId >= 4}
              onClick={() => {
                sounds.playClick();
                setSelectedUnitId((prev) => Math.min(4, prev + 1));
              }}
              className="text-xs font-bold text-[#17436A] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#BCEBDD]/30 flex items-center gap-1 px-3 py-2 rounded-lg transition"
            >
              <span>المحطة التالية</span>
              <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
