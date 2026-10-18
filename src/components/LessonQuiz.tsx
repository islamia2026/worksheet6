import React, { useState } from 'react';
import { Lesson, Unit, Question, StudentProfile } from '../types';
import { updateLessonProgressInStudent } from '../utils/storage';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Star,
  Trophy,
  Check,
  X,
  BookOpen,
} from 'lucide-react';

interface LessonQuizProps {
  unit: Unit;
  lesson: Lesson;
  currentStudent: StudentProfile;
  onFinishLesson: (updatedStudent: StudentProfile) => void;
  onBackToMap: () => void;
  onGoNextLesson?: () => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({
  unit,
  lesson,
  currentStudent,
  onFinishLesson,
  onBackToMap,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [showReview, setShowReview] = useState<boolean>(false);

  // Results calculation
  const [score, setScore] = useState(0);
  const [answersRecord, setAnswersRecord] = useState<
    Record<number, { userAnswer: string; isCorrect: boolean }>
  >({});

  const question = lesson.questions[currentQuestionIndex];
  const totalQuestions = lesson.questions.length; // 5

  // Check correctness helper
  const checkAnswerMatch = (q: Question, userAnswer: string): boolean => {
    if (!userAnswer) return false;
    const cleanUser = userAnswer.trim().toLowerCase().replace(/[()]/g, '');
    const cleanCorrect = q.correctAnswer.trim().toLowerCase().replace(/[()]/g, '');

    // For True/False
    if (q.type === 'true_false') {
      if (cleanCorrect.includes('✓') || cleanCorrect.includes('صح') || cleanCorrect.includes('صحيح')) {
        return cleanUser.includes('✓') || cleanUser.includes('صح') || cleanUser.includes('صحيح');
      }
      if (cleanCorrect.includes('✗') || cleanCorrect.includes('خطأ')) {
        return cleanUser.includes('✗') || cleanUser.includes('خطأ');
      }
    }

    // Direct match or partial canonical match
    if (cleanUser === cleanCorrect) return true;
    if (cleanCorrect.includes(cleanUser) && cleanUser.length > 2) return true;
    if (cleanUser.includes(cleanCorrect) && cleanCorrect.length > 2) return true;

    return false;
  };

  const handleSelectOption = (option: string) => {
    if (isAnswerSubmitted) return;
    sounds.playClick();
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handleSubmitAnswer = () => {
    const userAnswer = selectedAnswers[currentQuestionIndex];
    if (!userAnswer) return;

    const isCorrect = checkAnswerMatch(question, userAnswer);
    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    setIsAnswerSubmitted(true);
    setAnswersRecord((prev) => ({
      ...prev,
      [currentQuestionIndex]: { userAnswer, isCorrect },
    }));

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    let finalScore = 0;
    const finalAnswers: Record<number, { userAnswer: string; isCorrect: boolean }> = {};

    lesson.questions.forEach((q, idx) => {
      const uAns = selectedAnswers[idx] || '';
      const correct = checkAnswerMatch(q, uAns);
      if (correct) finalScore += 1;
      finalAnswers[idx] = { userAnswer: uAns, isCorrect: correct };
    });

    setScore(finalScore);
    setAnswersRecord(finalAnswers);
    setIsQuizCompleted(true);

    if (finalScore >= 4) {
      sounds.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#17436A', '#BCEBDD', '#F8FBFF'],
      });
    }

    updateLessonProgressInStudent(
      currentStudent,
      lesson.id,
      unit.id,
      finalScore,
      totalQuestions,
      finalAnswers
    );

    onFinishLesson(currentStudent);
  };

  const handleRestartQuiz = () => {
    sounds.playClick();
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted(false);
    setIsQuizCompleted(false);
    setShowReview(false);
    setScore(0);
    setAnswersRecord({});
  };

  // Render question interactive options
  const renderInteractiveOptions = () => {
    const currentAnswer = selectedAnswers[currentQuestionIndex] || '';

    // 1. Multiple Choice (اختيار من متعدد)
    if (question.type === 'multiple_choice' && question.options) {
      const letters = ['أ', 'ب', 'ج', 'د'];
      return (
        <div className="space-y-3 mt-4">
          {question.options.map((opt, i) => {
            const isSelected = currentAnswer === opt;
            const isCorrect = isAnswerSubmitted && checkAnswerMatch(question, opt);
            const isWrongSelected = isAnswerSubmitted && isSelected && !isCorrect;

            let btnStyle =
              'border-[#BCEBDD] bg-[#FFFFFF] hover:bg-[#BCEBDD]/15 text-[#17436A]';
            if (isSelected && !isAnswerSubmitted) {
              btnStyle = 'border-[#17436A] bg-[#BCEBDD]/35 text-[#17436A] font-black';
            } else if (isCorrect) {
              btnStyle = 'border-[#17436A] bg-[#BCEBDD] text-[#17436A] font-black';
            } else if (isWrongSelected) {
              btnStyle = 'border-[#17436A] bg-[#17436A]/10 text-[#17436A] font-bold line-through';
            }

            return (
              <button
                key={i}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(opt)}
                className={`w-full p-4 rounded-2xl border-2 text-right transition-all flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                      isSelected
                        ? 'bg-[#17436A] text-white'
                        : 'bg-[#BCEBDD] text-[#17436A]'
                    }`}
                  >
                    {letters[i] || `${i + 1}`}
                  </span>
                  <span className="text-sm sm:text-base font-bold">{opt}</span>
                </div>
                {isCorrect && <CheckCircle2 className="w-5 h-5 text-[#17436A] shrink-0" />}
                {isWrongSelected && <XCircle className="w-5 h-5 text-[#17436A] shrink-0" />}
              </button>
            );
          })}
        </div>
      );
    }

    // 2. True / False (صح وخطأ)
    if (question.type === 'true_false') {
      const options = [
        { label: 'صحيح (✓)', value: '✓', isTrue: true },
        { label: 'خطأ (✗)', value: '✗', isTrue: false },
      ];

      return (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {options.map((opt) => {
            const isSelected = currentAnswer === opt.value;
            const isCorrect = isAnswerSubmitted && checkAnswerMatch(question, opt.value);
            const isWrongSelected = isAnswerSubmitted && isSelected && !isCorrect;

            let btnStyle = 'border-[#BCEBDD] bg-[#FFFFFF] hover:bg-[#BCEBDD]/20 text-[#17436A]';
            if (isSelected && !isAnswerSubmitted) {
              btnStyle = 'border-[#17436A] bg-[#BCEBDD]/40 text-[#17436A] font-black';
            } else if (isCorrect) {
              btnStyle = 'border-[#17436A] bg-[#BCEBDD] text-[#17436A] font-black';
            } else if (isWrongSelected) {
              btnStyle = 'border-[#17436A] bg-[#17436A]/10 text-[#17436A] font-bold line-through';
            }

            return (
              <button
                key={opt.value}
                disabled={isAnswerSubmitted}
                onClick={() => handleSelectOption(opt.value)}
                className={`py-6 px-4 rounded-2xl border-2 font-black text-base sm:text-lg flex flex-col items-center justify-center gap-2 transition-all ${btnStyle}`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                    opt.isTrue ? 'bg-[#BCEBDD] text-[#17436A]' : 'bg-[#F8FBFF] border border-[#17436A]/20 text-[#17436A]'
                  }`}
                >
                  {opt.isTrue ? <Check className="w-6 h-6 stroke-[3]" /> : <X className="w-6 h-6 stroke-[3]" />}
                </div>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      );
    }

    // 3. Fill in the Blank (إكمال فراغ) or Terminology (مصطلح)
    const availableChips =
      question.fillOptions || question.options || [question.correctAnswer];

    return (
      <div className="space-y-4 mt-4">
        <div>
          <label className="block text-xs font-bold text-[#17436A]/80 mb-2">
            اختر الإجابة المناسبة من بنك الخيارات المعتمدة:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {availableChips.map((chip, idx) => {
              const isSelected = currentAnswer === chip;
              const isCorrect = isAnswerSubmitted && checkAnswerMatch(question, chip);
              const isWrongSelected = isAnswerSubmitted && isSelected && !isCorrect;

              let chipStyle =
                'border-[#BCEBDD] bg-[#FFFFFF] text-[#17436A] hover:bg-[#BCEBDD]/20';
              if (isSelected && !isAnswerSubmitted) {
                chipStyle = 'border-[#17436A] bg-[#BCEBDD]/40 text-[#17436A] font-black';
              } else if (isCorrect) {
                chipStyle = 'border-[#17436A] bg-[#BCEBDD] text-[#17436A] font-black';
              } else if (isWrongSelected) {
                chipStyle = 'border-[#17436A] bg-[#17436A]/10 text-[#17436A] font-bold line-through';
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleSelectOption(chip)}
                  className={`p-3.5 rounded-xl border-2 text-right text-sm sm:text-base transition-all flex items-center justify-between gap-2 ${chipStyle}`}
                >
                  <span className="font-bold">{chip}</span>
                  {isCorrect && <CheckCircle2 className="w-4 h-4 text-[#17436A] shrink-0" />}
                  {isWrongSelected && <XCircle className="w-4 h-4 text-[#17436A] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Completion Screen
  if (isQuizCompleted && !showReview) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = score >= 3;
    let starsCount = 0;
    if (score === 5) starsCount = 3;
    else if (score === 4) starsCount = 2;
    else if (score >= 3) starsCount = 1;

    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#F8FBFF] py-8 sm:py-10 px-3 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#BCEBDD] shadow-xs text-center space-y-6">
          {/* Trophy / Result Icon */}
          <div className="relative inline-block">
            <div
              className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center border-2 ${
                passed
                  ? 'bg-[#BCEBDD] border-[#17436A]/20 text-[#17436A]'
                  : 'bg-[#F8FBFF] border-2 border-[#17436A]/30 text-[#17436A]'
              }`}
            >
              {passed ? (
                <Trophy className="w-12 h-12 text-[#17436A]" />
              ) : (
                <RotateCcw className="w-10 h-10 text-[#17436A]" />
              )}
            </div>
            {passed && (
              <span className="absolute -top-2 -right-2 bg-[#17436A] text-[#F8FBFF] p-1.5 rounded-full border border-[#BCEBDD] shadow-xs">
                <Check className="w-4 h-4 stroke-[3]" />
              </span>
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-[#17436A] bg-[#BCEBDD] px-3 py-1 rounded-full">{lesson.field}</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#17436A] pt-2">
              {passed ? 'أحسنتِ صنعاً! إنجاز متميز' : 'محاولة طيبة، واصلي التدرب!'}
            </h2>
            <p className="text-sm text-[#17436A]/80 font-bold">
              نتيجة الدرس: {lesson.title}
            </p>
          </div>

          {/* Stars strictly in Mint Green #BCEBDD and Navy #17436A */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`w-8 h-8 ${
                  s <= starsCount
                    ? 'fill-[#BCEBDD] text-[#17436A]'
                    : 'text-[#17436A]/20 fill-transparent'
                }`}
              />
            ))}
          </div>

          {/* Score Card */}
          <div className="bg-[#F8FBFF] border-2 border-[#BCEBDD] rounded-2xl p-5 max-w-sm mx-auto space-y-2">
            <div className="flex items-center justify-between text-sm font-bold text-[#17436A]">
              <span>الدرجة المحققة:</span>
              <span className="text-xl font-black text-[#17436A]">
                {score} من {totalQuestions}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#17436A]/80">
              <span>نسبة الإتقان:</span>
              <span className="font-black text-[#17436A]">{percentage}%</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-[#17436A]/80">
              <span>النقاط المكتسبة:</span>
              <span className="font-black text-[#17436A]">+{score * 10} نقطة</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#BCEBDD]">
            {/* Primary button: Navy #17436A with white text and mint border */}
            <button
              onClick={() => {
                sounds.playClick();
                onBackToMap();
              }}
              className="w-full sm:w-auto bg-[#17436A] hover:bg-[#0F2D48] text-white border-2 border-[#BCEBDD] px-6 py-3 rounded-full font-black text-sm flex items-center justify-center gap-2 shadow-xs transition"
            >
              <span>متابعة الرحلة في الخريطة</span>
              <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
            </button>

            {/* Secondary button: Mint #BCEBDD */}
            <button
              onClick={() => {
                sounds.playClick();
                setShowReview(true);
              }}
              className="w-full sm:w-auto bg-[#BCEBDD] hover:bg-[#aee6d6] text-[#17436A] border border-[#17436A]/20 px-5 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <HelpCircle className="w-4 h-4" />
              <span>مراجعة الإجابات النموذجية</span>
            </button>

            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto bg-[#FFFFFF] hover:bg-[#BCEBDD]/20 border-2 border-[#BCEBDD] text-[#17436A] px-5 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review Screen
  if (showReview) {
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#F8FBFF] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border-2 border-[#BCEBDD] shadow-xs flex items-center justify-between">
            <h3 className="text-lg font-black text-[#17436A] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#17436A]" />
              مراجعة الإجابات النموذجية: {lesson.title}
            </h3>
            <button
              onClick={() => setShowReview(false)}
              className="text-xs font-bold text-[#17436A] bg-[#BCEBDD] hover:bg-[#aee6d6] px-3.5 py-1.5 rounded-xl transition"
            >
              العودة للنتيجة
            </button>
          </div>

          <div className="space-y-4">
            {lesson.questions.map((q, idx) => {
              const rec = answersRecord[idx];
              const isCorrect = rec?.isCorrect;

              return (
                <div
                  key={q.id}
                  className={`bg-[#FFFFFF] p-5 rounded-2xl border-2 space-y-3 ${
                    isCorrect ? 'border-[#BCEBDD]' : 'border-[#17436A]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white bg-[#17436A] px-2.5 py-1 rounded-lg">
                      السؤال {idx + 1}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-[#BCEBDD] text-[#17436A]'
                          : 'bg-[#F8FBFF] border border-[#17436A]/30 text-[#17436A]'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#17436A]" />
                          <span>إجابة صحيحة</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-[#17436A]" />
                          <span>إجابة خاطئة</span>
                        </>
                      )}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-black text-[#17436A]">
                    {q.prompt}
                  </h4>

                  <div className="bg-[#F8FBFF] p-3 rounded-xl border border-[#BCEBDD] text-xs space-y-1.5 font-bold">
                    <div className="flex items-center justify-between">
                      <span className="text-[#17436A]/70">إجابتك:</span>
                      <span className={isCorrect ? 'text-[#17436A] font-black' : 'text-[#17436A] font-black line-through'}>
                        {rec?.userAnswer || '(لم تتم الإجابة)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-t border-[#BCEBDD] pt-1">
                      <span className="text-[#17436A]">الإجابة النموذجية المعتمدة:</span>
                      <span className="text-[#17436A] font-black bg-[#BCEBDD] px-2 py-0.5 rounded-md">
                        {q.correctAnswer}
                      </span>
                    </div>
                  </div>

                  {q.explanation && (
                    <p className="text-xs text-[#17436A]/85 font-bold bg-[#BCEBDD]/25 p-2.5 rounded-xl border border-[#BCEBDD]">
                      💡 الشرح: {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onBackToMap()}
              className="bg-[#17436A] hover:bg-[#0F2D48] text-white border-2 border-[#BCEBDD] px-6 py-2.5 rounded-full font-black text-sm shadow-xs transition"
            >
              العودة لخريطة المراحل
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Question View
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);
  const currentAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F8FBFF] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Quiz Header Bar */}
        <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border-2 border-[#BCEBDD] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                onBackToMap();
              }}
              className="text-xs font-bold text-[#17436A] bg-[#BCEBDD] hover:bg-[#aee6d6] px-3 py-1.5 rounded-xl transition flex items-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>الخروج للخريطة</span>
            </button>
          </div>

          <div className="text-center">
            <span className="text-[11px] font-black text-[#17436A] bg-[#BCEBDD] px-2.5 py-0.5 rounded-md">
              {lesson.field}
            </span>
            <h3 className="text-sm font-black text-[#17436A] mt-0.5 truncate max-w-[200px] sm:max-w-xs">
              {lesson.title}
            </h3>
          </div>

          <div className="text-left">
            <span className="text-xs font-black text-[#17436A] bg-[#BCEBDD]/50 border border-[#17436A]/20 px-2.5 py-1 rounded-xl">
              سؤال {currentQuestionIndex + 1} من {totalQuestions}
            </span>
          </div>
        </div>

        {/* Progress Bar (Mint #BCEBDD fill) */}
        <div className="w-full h-2.5 bg-[#FFFFFF] border border-[#BCEBDD] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#BCEBDD] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-[#FFFFFF] rounded-3xl p-6 sm:p-8 border-2 border-[#BCEBDD] shadow-xs space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white bg-[#17436A] px-3 py-1 rounded-lg">
                السؤال رقم {currentQuestionIndex + 1}
              </span>
              <span className="text-xs font-bold text-[#17436A]/75">
                {question.type === 'multiple_choice'
                  ? 'اختيار من متعدد'
                  : question.type === 'true_false'
                  ? 'صح أم خطأ'
                  : 'إكمال الفراغ والمصطلحات'}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-[#17436A] leading-relaxed">
              {question.prompt}
            </h2>
          </div>

          {/* Question Interactive Options */}
          {renderInteractiveOptions()}

          {/* Feedback Banner if Submitted */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-bold border-2 animate-in fade-in duration-200 ${
                checkAnswerMatch(question, currentAnswer)
                  ? 'bg-[#BCEBDD] text-[#17436A] border-[#17436A]/20'
                  : 'bg-[#F8FBFF] text-[#17436A] border-2 border-[#17436A]/40'
              }`}
            >
              <div className="flex items-center gap-2">
                {checkAnswerMatch(question, currentAnswer) ? (
                  <CheckCircle2 className="w-5 h-5 text-[#17436A] shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#17436A] shrink-0" />
                )}
                <span>
                  {checkAnswerMatch(question, currentAnswer)
                    ? 'ممتاز! إجابة صحيحة نموذجية (+1 نقطة)'
                    : `إجابة غير صحيحة. الإجابة النموذجية المعتمدة هي: (${question.correctAnswer})`}
                </span>
              </div>
              {question.explanation && (
                <p className="mt-2 text-xs font-semibold opacity-90 border-t border-current/20 pt-1.5">
                  💡 {question.explanation}
                </p>
              )}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="pt-4 border-t border-[#BCEBDD] flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#17436A]/60">
              {isAnswerSubmitted
                ? currentQuestionIndex + 1 === totalQuestions
                  ? 'السؤال الأخير'
                  : 'جاهز للانتقال للسؤال التالي'
                : 'حدد إجابتك ثم اضغط تأكيد'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                disabled={!currentAnswer}
                onClick={handleSubmitAnswer}
                className="bg-[#17436A] hover:bg-[#0F2D48] disabled:opacity-40 disabled:cursor-not-allowed text-white border-2 border-[#BCEBDD] px-6 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-xs transition"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="bg-[#17436A] hover:bg-[#0F2D48] text-white border-2 border-[#BCEBDD] px-6 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-xs transition flex items-center gap-2"
              >
                <span>
                  {currentQuestionIndex + 1 < totalQuestions ? 'السؤال التالي' : 'عرض النتيجة النهائية'}
                </span>
                <ArrowLeft className="w-4 h-4 rtl:rotate-0" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
