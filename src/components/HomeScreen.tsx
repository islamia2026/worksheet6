import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import schoolLogoSvg from '../assets/school-logo.svg';
import { StudentProfile } from '../types';
import { SCHOOL_INFO, UNITS_DATA } from '../data/questionsData';
import { IslamicSceneDecorations } from './IslamicSceneDecorations';
import {
  Sparkles,
  Award,
  BookOpen,
  CheckCircle2,
  Star,
  ArrowLeft,
  Flame,
  ShieldCheck,
  User,
  Users,
  GraduationCap,
  Play,
  ChevronDown,
  ChevronUp,
  BarChart3,
  RotateCcw,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HomeScreenProps {
  currentStudent: StudentProfile | null;
  onStartJourney: () => void;
  onViewProgress: () => void;
  onViewCertificates: () => void;
  onOpenQuestionBank: () => void;
  onRegisterStudent: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentStudent,
  onStartJourney,
  onViewProgress,
  onViewCertificates,
  onOpenQuestionBank,
  onRegisterStudent,
}) => {
  const [showCurriculumOverview, setShowCurriculumOverview] = useState(false);

  const totalLessons = 16;
  const totalUnits = 4;
  const completedLessonsCount = currentStudent?.completedLessons.length || 0;
  const completedUnitsCount = currentStudent?.completedUnits.length || 0;
  const totalPoints = currentStudent?.totalPoints || 0;

  // Total stars earned
  const totalStars = currentStudent
    ? Object.values(currentStudent.lessonProgress).reduce((acc, lp) => acc + (lp.stars || 0), 0)
    : 0;
  const maxStars = totalLessons * 3; // 48 stars total

  const progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100);

  const handleStartClick = () => {
    sounds.playClick();
    if (!currentStudent) {
      onRegisterStudent();
    } else {
      onStartJourney();
    }
  };

  const handleProgressClick = () => {
    sounds.playClick();
    if (!currentStudent) {
      onRegisterStudent();
    } else {
      onViewProgress();
    }
  };

  const handleCertificatesClick = () => {
    sounds.playClick();
    if (!currentStudent) {
      onRegisterStudent();
    } else {
      onViewCertificates();
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] bg-[#F8FBFF] py-6 sm:py-10 px-3 sm:px-6 overflow-hidden">
      {/* Background Decor: Calm SVG Islamic Scene in Mint Green & Navy */}
      <IslamicSceneDecorations />

      <div className="relative z-10 max-w-2xl mx-auto space-y-5 sm:space-y-6 text-center">
        {/* 1. Official School Logo (Permanent, fixed within project assets) */}
        <div className="flex flex-col items-center space-y-3">
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-[#FFFFFF] rounded-3xl p-4 sm:p-5 shadow-xs border-2 border-[#BCEBDD]"
          >
            <img
              src={schoolLogoSvg}
              alt="شعار مدرسة المطوعة شريفة العمر"
              className="w-36 h-36 sm:w-44 sm:h-44 object-contain select-none drop-shadow-xs"
              loading="eager"
            />
          </motion.div>

          {/* Educational District Pill strictly in Mint Green (#BCEBDD) background and Navy text (#17436A) */}
          <div className="inline-block bg-[#BCEBDD] text-[#17436A] px-6 py-1.5 rounded-full font-black text-xs sm:text-sm border border-[#17436A]/20 shadow-2xs">
            {SCHOOL_INFO.district}
          </div>

          {/* Kuwait & Ministry Badge with Mint Green Accents and Navy Text */}
          <div className="inline-flex items-center gap-1.5 bg-[#FFFFFF] text-[#17436A] border border-[#BCEBDD] px-4 py-1 rounded-full text-xs font-black shadow-2xs">
            <Star className="w-3.5 h-3.5 fill-[#BCEBDD] text-[#17436A]" />
            <span>{SCHOOL_INFO.country} • {SCHOOL_INFO.ministry}</span>
            <Star className="w-3.5 h-3.5 fill-[#BCEBDD] text-[#17436A]" />
          </div>
        </div>

        {/* 2. School Name & Main Title Section (All headings in Navy Blue #17436A) */}
        <div className="space-y-1 pt-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#17436A] tracking-tight leading-tight">
            {SCHOOL_INFO.schoolName}
          </h1>
          <p className="text-sm sm:text-base font-black text-[#17436A]/80">
            - {SCHOOL_INFO.schoolType} -
          </p>
        </div>

        {/* Game Title: Navy Blue #17436A */}
        <div className="pt-1 space-y-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#17436A] tracking-tight leading-snug">
            رحلة التميز في التربية الإسلامية
          </h2>
          <p className="text-sm sm:text-base font-bold text-[#17436A]/90">
            {SCHOOL_INFO.grade} - {SCHOOL_INFO.term}
          </p>
        </div>

        {/* Motto Banner: Mint Green #BCEBDD subtle background with Navy #17436A text */}
        <div className="pt-1">
          <div className="bg-[#BCEBDD]/30 border-2 border-[#BCEBDD] rounded-2xl px-5 py-2.5 inline-flex items-center gap-2 text-xs sm:text-sm md:text-base font-black text-[#17436A] shadow-2xs max-w-full">
            <BookOpen className="w-5 h-5 text-[#17436A] shrink-0" />
            <span>«{SCHOOL_INFO.motto}»</span>
          </div>
        </div>

        {/* 3. Student Registration / Profile Status Bar */}
        <div className="pt-2">
          {currentStudent ? (
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm font-bold">
              {/* Welcome Name Pill: Card White #FFFFFF + Mint Green #BCEBDD border */}
              <div className="bg-[#FFFFFF] border-2 border-[#BCEBDD] text-[#17436A] px-4 py-2 rounded-full flex items-center gap-2 shadow-2xs">
                <div className="w-5 h-5 rounded-full bg-[#17436A] text-[#F8FBFF] flex items-center justify-center text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span>مرحباً بكِ:</span>
                <span className="font-black text-[#17436A]">{currentStudent.name}</span>
              </div>

              {/* Section Pill: Mint Green #BCEBDD element */}
              {currentStudent.section && (
                <div className="bg-[#BCEBDD] border border-[#17436A]/20 text-[#17436A] px-4 py-2 rounded-full flex items-center gap-1.5 shadow-2xs font-bold">
                  <Users className="w-3.5 h-3.5 text-[#17436A]" />
                  <span>الشعبة: {currentStudent.section}</span>
                </div>
              )}

              {/* Switch Student Button: Mint Green #BCEBDD secondary button */}
              <motion.button
                onClick={onRegisterStudent}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="bg-[#BCEBDD] hover:bg-[#aee6d6] border border-[#17436A]/20 text-[#17436A] px-4 py-2 rounded-full font-black text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>(تبديل الطالب)</span>
                <RotateCcw className="w-3.5 h-3.5 text-[#17436A]" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={() => {
                sounds.playClick();
                onRegisterStudent();
              }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="bg-[#17436A] hover:bg-[#0F2D48] text-white border-2 border-[#BCEBDD] px-6 py-2.5 rounded-full font-black text-sm flex items-center justify-center gap-2 mx-auto shadow-sm cursor-pointer"
            >
              <User className="w-4 h-4 text-[#BCEBDD]" />
              <span>اضغط هنا لتسجيل اسمكِ لبدء المغامرة</span>
              <Star className="w-4 h-4 fill-[#BCEBDD] text-[#BCEBDD]" />
            </motion.button>
          )}
        </div>

        {/* 4. Academic Supervision and Preparation Team Card (#FFFFFF card, #BCEBDD border) */}
        <div className="bg-[#FFFFFF] rounded-3xl p-5 sm:p-6 shadow-xs border-2 border-[#BCEBDD] text-center space-y-4">
          <div className="space-y-1 border-b border-[#BCEBDD] pb-3">
            <h3 className="text-base sm:text-lg font-black text-[#17436A] flex items-center justify-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#17436A]" />
              <span>فريق الإشراف والإعداد التعليمي</span>
            </h3>
            <p className="text-xs text-[#17436A]/80 font-bold">
              مدرسة المطوعة شريفة العمر - المتوسطة بنات • قسم التربية الإسلامية
            </p>
          </div>

          {/* 2x2 Grid of Team Cards using Sky White #F8FBFF secondary backgrounds & Mint Green #BCEBDD accents */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
            {/* 1. Assistant Principal */}
            <div className="bg-[#F8FBFF] border border-[#BCEBDD] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="text-[11px] font-black text-[#17436A]/80 block">
                  المديرة المساعدة
                </span>
                <h4 className="text-sm sm:text-base font-black text-[#17436A]">
                  أ. مشاعل العنزي
                </h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#BCEBDD] text-[#17436A] flex items-center justify-center shrink-0 border border-[#17436A]/10 font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* 2. Technical Supervisor */}
            <div className="bg-[#F8FBFF] border border-[#BCEBDD] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="text-[11px] font-black text-[#17436A]/80 block">
                  الموجهة الفنية
                </span>
                <h4 className="text-sm sm:text-base font-black text-[#17436A]">
                  أ. ريم الظفيري
                </h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#BCEBDD] text-[#17436A] flex items-center justify-center shrink-0 border border-[#17436A]/10 font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>

            {/* 3. Head of Department */}
            <div className="bg-[#F8FBFF] border border-[#BCEBDD] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="text-[11px] font-black text-[#17436A]/80 block">
                  رئيسة القسم
                </span>
                <h4 className="text-sm sm:text-base font-black text-[#17436A]">
                  أ. فاطمة الدوسري
                </h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#BCEBDD] text-[#17436A] flex items-center justify-center shrink-0 border border-[#17436A]/10 font-bold">
                <User className="w-5 h-5" />
              </div>
            </div>

            {/* 4. Teacher Preparation */}
            <div className="bg-[#F8FBFF] border border-[#BCEBDD] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-2xs">
              <div>
                <span className="text-[11px] font-black text-[#17436A]/80 block">
                  إعداد وتنفيذ المعلمة
                </span>
                <h4 className="text-sm sm:text-base font-black text-[#17436A]">
                  أ. أفراح المزعل
                </h4>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#BCEBDD] text-[#17436A] flex items-center justify-center shrink-0 border border-[#17436A]/10 font-bold">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* 5. The 3 Action Buttons strictly matching color guidelines with Framer Motion */}
        <div className="space-y-3 pt-2">
          {/* Button 1 (Main Button): Navy Blue #17436A with white text and Mint Green #BCEBDD border */}
          <motion.button
            onClick={handleStartClick}
            whileHover={{ scale: 1.025, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="w-full max-w-md mx-auto py-4 px-6 rounded-full bg-[#17436A] hover:bg-[#0F2D48] text-[#F8FBFF] font-black text-lg sm:text-xl border-2 border-[#BCEBDD] shadow-md shadow-[#17436A]/20 flex items-center justify-between cursor-pointer"
          >
            <motion.div
              animate={{ x: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-8 h-8 rounded-full bg-[#BCEBDD]/25 text-[#BCEBDD] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 stroke-[3] rtl:rotate-0" />
            </motion.div>
            <span className="text-xl sm:text-2xl tracking-wide">ابدأ الرحلة</span>
            <div className="w-8 h-8 rounded-full bg-[#BCEBDD]/25 text-[#BCEBDD] flex items-center justify-center">
              <Play className="w-4 h-4 fill-[#BCEBDD]" />
            </div>
          </motion.button>

          {/* Button 2 (Secondary Button): Mint Green #BCEBDD background, Navy text #17436A */}
          <motion.button
            onClick={handleProgressClick}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="w-full max-w-md mx-auto py-3.5 px-6 rounded-full bg-[#BCEBDD] hover:bg-[#aee6d6] text-[#17436A] border-2 border-[#17436A]/20 font-black text-base sm:text-lg shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <BarChart3 className="w-5 h-5 text-[#17436A]" />
            <span>متابعة تقدمي</span>
          </motion.button>

          {/* Button 3 (Secondary Button): Mint Green #BCEBDD background, Navy text #17436A */}
          <motion.button
            onClick={handleCertificatesClick}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
            className="w-full max-w-md mx-auto py-3.5 px-6 rounded-full bg-[#BCEBDD] hover:bg-[#aee6d6] text-[#17436A] border-2 border-[#17436A]/20 font-black text-base sm:text-lg shadow-xs flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Award className="w-5 h-5 text-[#17436A]" />
            <span>شهاداتي</span>
          </motion.button>
        </div>

        {/* 6. Expandable Curriculum & Stats Section (Preserving all game functions) */}
        <div className="pt-4 border-t border-[#BCEBDD]">
          <motion.button
            onClick={() => {
              sounds.playClick();
              setShowCurriculumOverview(!showCurriculumOverview);
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="bg-[#FFFFFF] hover:bg-[#F8FBFF] border-2 border-[#BCEBDD] text-[#17436A] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#17436A]" />
            <span>
              {showCurriculumOverview
                ? 'إخفاء تفاصيل المنهج وبنك الأسئلة'
                : 'عرض تفاصيل المراحل وبنك الأسئلة (80 سؤالاً)'}
            </span>
            {showCurriculumOverview ? (
              <ChevronUp className="w-4 h-4 text-[#17436A]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#17436A]" />
            )}
          </motion.button>

          <AnimatePresence>
            {showCurriculumOverview && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="mt-5 space-y-5 text-right overflow-hidden"
              >
                {/* Quick Stat Cards: #FFFFFF cards, #BCEBDD borders */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="bg-[#FFFFFF] p-3.5 rounded-2xl border-2 border-[#BCEBDD] shadow-2xs text-center"
                  >
                    <span className="text-[11px] font-bold text-[#17436A]/70">النقاط</span>
                    <h4 className="text-xl font-black text-[#17436A]">{totalPoints}</h4>
                    <span className="text-[10px] text-[#17436A] font-bold">نقطة تميز</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="bg-[#FFFFFF] p-3.5 rounded-2xl border-2 border-[#BCEBDD] shadow-2xs text-center"
                  >
                    <span className="text-[11px] font-bold text-[#17436A]/70">الوحدات</span>
                    <h4 className="text-xl font-black text-[#17436A]">
                      {completedUnitsCount} / {totalUnits}
                    </h4>
                    <span className="text-[10px] text-[#17436A] font-bold">محطات منجزة</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="bg-[#FFFFFF] p-3.5 rounded-2xl border-2 border-[#BCEBDD] shadow-2xs text-center"
                  >
                    <span className="text-[11px] font-bold text-[#17436A]/70">الدروس</span>
                    <h4 className="text-xl font-black text-[#17436A]">
                      {completedLessonsCount} / {totalLessons}
                    </h4>
                    <span className="text-[10px] text-[#17436A] font-bold">مكتملة</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="bg-[#FFFFFF] p-3.5 rounded-2xl border-2 border-[#BCEBDD] shadow-2xs text-center"
                  >
                    <span className="text-[11px] font-bold text-[#17436A]/70">النجوم</span>
                    <h4 className="text-xl font-black text-[#17436A] flex items-center justify-center gap-1">
                      <span>{totalStars}</span>
                      <Star className="w-4 h-4 fill-[#BCEBDD] text-[#17436A]" />
                    </h4>
                    <span className="text-[10px] text-[#17436A] font-bold">من {maxStars} نجمة</span>
                  </motion.div>
                </div>

                {/* Progress Bar (Mint Green #BCEBDD progress fill) */}
                <div className="bg-[#FFFFFF] p-4 rounded-2xl border-2 border-[#BCEBDD] space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#17436A]">
                    <span className="flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-[#17436A]" />
                      مؤشر التقدم في المنهج
                    </span>
                    <span className="font-black">{progressPercentage}% مكتمل</span>
                  </div>
                  <div className="w-full h-3 bg-[#F8FBFF] border border-[#BCEBDD] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#BCEBDD] rounded-full transition-all duration-700"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* 4 Stations Previews */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#17436A] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#17436A]" />
                      <span>المحطات التعليمية الأربع</span>
                    </h3>
                    <button
                      onClick={onOpenQuestionBank}
                      className="text-xs font-bold text-[#17436A] underline hover:text-[#0F2D48] cursor-pointer"
                    >
                      استعراض بنك الأسئلة (80 سؤالاً)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {UNITS_DATA.map((unit) => {
                      const unitDone = unit.lessons.filter((l) =>
                        currentStudent?.completedLessons.includes(l.id)
                      ).length;
                      const isFinished = unitDone === unit.lessons.length;

                      return (
                        <motion.div
                          key={unit.id}
                          onClick={handleStartClick}
                          whileHover={{ scale: 1.025, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          className="bg-[#FFFFFF] p-4 rounded-2xl border-2 border-[#BCEBDD] hover:border-[#17436A] cursor-pointer shadow-2xs hover:shadow-xs space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-white bg-[#17436A] px-2.5 py-0.5 rounded-md">
                              المحطة {unit.id}
                            </span>
                            {isFinished && (
                              <span className="text-[10px] font-bold text-[#17436A] bg-[#BCEBDD] px-2.5 py-0.5 rounded-full border border-[#17436A]/20 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-[#17436A]" />
                                مكتملة
                              </span>
                            )}
                          </div>
                          <h4 className="font-black text-sm text-[#17436A]">{unit.title}</h4>
                          <p className="text-xs font-bold text-[#17436A]/80">{unit.subtitle}</p>
                          <div className="flex items-center justify-between text-[11px] text-[#17436A]/70 pt-1 border-t border-[#BCEBDD]">
                            <span>4 دروس موضوعية</span>
                            <span className="text-[#17436A] font-bold">
                              {unitDone} من 4 دروس
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
