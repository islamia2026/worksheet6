import React, { useRef } from 'react';
import { StudentProfile } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { SCHOOL_INFO } from '../data/questionsData';
import {
  Printer,
  Star,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface CertificateViewProps {
  currentStudent: StudentProfile;
  onBack: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  currentStudent,
  onBack,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  const today = new Date().toLocaleDateString('ar-KW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const completedLessons = currentStudent.completedLessons.length;
  const isHighAchiever = currentStudent.totalPoints >= 300 || completedLessons >= 4;

  const certificateNumber = `KW-JAH-${currentStudent.id.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F8FBFF] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Print Controls (Hidden during print) */}
        <div className="flex items-center justify-between bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border-2 border-[#BCEBDD] shadow-xs print:hidden">
          <button
            onClick={() => {
              sounds.playClick();
              onBack();
            }}
            className="text-xs sm:text-sm font-bold text-[#17436A] bg-[#BCEBDD] hover:bg-[#aee6d6] px-4 py-2 rounded-xl flex items-center gap-1.5 transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرحلة</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="bg-[#17436A] hover:bg-[#0F2D48] text-white border-2 border-[#BCEBDD] px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-xs flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4 text-[#BCEBDD]" />
              <span>طباعة الشهادة / حفظ PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas strictly in Navy #17436A, Mint #BCEBDD, and Sky White/White #F8FBFF/#FFFFFF */}
        <div
          id="printable-certificate"
          ref={certificateRef}
          className="relative bg-[#FFFFFF] rounded-3xl p-6 sm:p-12 border-8 border-double border-[#17436A] shadow-xl overflow-hidden text-center text-[#17436A]"
        >
          {/* Ornate Corner Accents in Navy #17436A */}
          <div className="absolute top-2 right-2 w-16 h-16 border-t-4 border-r-4 border-[#17436A] rounded-tr-xl pointer-events-none"></div>
          <div className="absolute top-2 left-2 w-16 h-16 border-t-4 border-l-4 border-[#17436A] rounded-tl-xl pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-16 h-16 border-b-4 border-r-4 border-[#17436A] rounded-br-xl pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-16 h-16 border-b-4 border-l-4 border-[#17436A] rounded-bl-xl pointer-events-none"></div>

          {/* Watermark Logo Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <SchoolLogo size="xl" showText={false} />
          </div>

          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#BCEBDD] pb-6">
            <div className="text-right text-xs sm:text-sm font-bold text-[#17436A] space-y-0.5">
              <p>دولة الكويت</p>
              <p>وزارة التربية</p>
              <p>الإدارة العامة لمنطقة الجهراء التعليمية</p>
              <p className="text-[#17436A] font-black">مدرسة المطوعة شريفة العمر – م. بنات</p>
            </div>

            <div className="flex flex-col items-center">
              <SchoolLogo size="md" showText={false} />
            </div>

            <div className="text-left text-xs text-[#17436A]/80 space-y-0.5">
              <p className="font-black text-[#17436A]">قسم التربية الإسلامية</p>
              <p>العام الدراسي 2026/2027</p>
              <p>{SCHOOL_INFO.term}</p>
              <p className="text-[10px] text-[#17436A]/70 font-mono">{certificateNumber}</p>
            </div>
          </div>

          {/* Certificate Main Body */}
          <div className="py-8 space-y-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-[#BCEBDD]/40 text-[#17436A] border border-[#BCEBDD] px-4 py-1.5 rounded-full text-xs font-black">
                <Sparkles className="w-4 h-4 text-[#17436A]" />
                <span>شهادة تفوق وتميز في التربية الإسلامية</span>
                <Sparkles className="w-4 h-4 text-[#17436A]" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#17436A] tracking-tight">
                شهادة تميز وتقدير
              </h1>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto text-base sm:text-lg text-[#17436A] leading-relaxed font-bold">
              <p>
                يسر إدارة مدرسة{' '}
                <span className="font-black text-[#17436A]">المطوعة شريفة العمر المتوسطة بنات</span>{' '}
                وقسم التربية الإسلامية أن تمنح هذه الشهادة للطالبة المتميزة:
              </p>

              <div className="py-2">
                <span className="inline-block px-8 py-2.5 bg-[#BCEBDD]/30 border-b-4 border-[#17436A] rounded-2xl text-2xl sm:text-3xl font-black text-[#17436A] shadow-xs">
                  {currentStudent.name}
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#17436A]/80 mt-2">
                  {currentStudent.grade} {currentStudent.section ? `• الشعبة: ${currentStudent.section}` : ''}
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#17436A]/90">
                تقديراً لاجتهادها وتفوقها في مسابقة{' '}
                <strong className="text-[#17436A]">«رحلة التميز في التربية الإسلامية»</strong>،
                وإتمامها بنجاح مراحل المنهج الوزاري المعتمد وجمع النجوم والأوسمة بجدارة وإتقان.
              </p>
            </div>

            {/* Achievement Badges in Certificate */}
            <div className="inline-flex flex-wrap items-center justify-center gap-4 bg-[#F8FBFF] border-2 border-[#BCEBDD] p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-black text-[#17436A]">
                <ShieldCheck className="w-4 h-4 text-[#17436A]" />
                <span>الدروس المنجزة: {completedLessons} من 16</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#BCEBDD]"></div>
              <div className="flex items-center gap-2 text-xs font-black text-[#17436A]">
                <Star className="w-4 h-4 fill-[#BCEBDD] text-[#17436A]" />
                <span>إجمالي النقاط: {currentStudent.totalPoints} نقطة</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#BCEBDD]"></div>
              <div className="flex items-center gap-2 text-xs font-black text-[#17436A]">
                <CheckCircle2 className="w-4 h-4 text-[#17436A]" />
                <span>التقدير: {isHighAchiever ? 'ممتاز مع مرتبة الشرف' : 'جيد جداً'}</span>
              </div>
            </div>
          </div>

          {/* Certificate Signatures and Stamp */}
          <div className="pt-8 border-t-2 border-[#BCEBDD] grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-bold text-[#17436A]">
            <div className="space-y-3">
              <span className="text-[11px] text-[#17436A]/70 block">إعداد المعلمة</span>
              <p className="font-black text-[#17436A] text-xs sm:text-sm">أ. أفراح المزعل</p>
              <div className="w-16 h-0.5 bg-[#BCEBDD] mx-auto"></div>
              <p className="text-[10px] text-[#17436A]/60 font-semibold">معلمة التربية الإسلامية</p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] text-[#17436A]/70 block">رئيسة القسم</span>
              <p className="font-black text-[#17436A] text-xs sm:text-sm">أ. فاطمة الدوسري</p>
              <div className="w-16 h-0.5 bg-[#BCEBDD] mx-auto"></div>
              <p className="text-[10px] text-[#17436A]/60 font-semibold">اعتماد القسم</p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] text-[#17436A]/70 block">الموجهة الفنية</span>
              <p className="font-black text-[#17436A] text-xs sm:text-sm">أ. ريم الظفيري</p>
              <div className="w-16 h-0.5 bg-[#BCEBDD] mx-auto"></div>
              <p className="text-[10px] text-[#17436A]/60 font-semibold">التوجيه الفني</p>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] text-[#17436A]/70 block">المديرة المساعدة</span>
              <p className="font-black text-[#17436A] text-xs sm:text-sm">أ. مشاعل العنزي</p>
              <div className="w-16 h-0.5 bg-[#BCEBDD] mx-auto"></div>
              <p className="text-[10px] text-[#17436A]/60 font-semibold">إدارة المدرسة</p>
            </div>
          </div>

          {/* Stamp and Date */}
          <div className="mt-6 pt-4 border-t border-[#BCEBDD] flex items-center justify-between text-[11px] text-[#17436A]/70 font-semibold">
            <span>تاريخ الإصدار: {today}</span>
            <span className="font-mono text-[10px] text-[#17436A] font-bold">{certificateNumber}</span>
            <span>مدرسة المطوعة شريفة العمر – م. بنات</span>
          </div>
        </div>
      </div>
    </div>
  );
};
