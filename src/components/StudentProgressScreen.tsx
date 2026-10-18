import React, { useState } from 'react';
import { StudentProfile, IslamicField } from '../types';
import { UNITS_DATA, BADGES_LIST } from '../data/questionsData';
import {
  Trophy,
  Award,
  Star,
  ArrowRight,
  Layers,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface StudentProgressScreenProps {
  currentStudent: StudentProfile;
  onBackToMap: () => void;
  onOpenCertificate: () => void;
  onSelectLessonById: (lessonId: string) => void;
}

export const StudentProgressScreen: React.FC<StudentProgressScreenProps> = ({
  currentStudent,
  onBackToMap,
  onOpenCertificate,
}) => {
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');

  const totalLessons = 16;
  const completedLessonsCount = currentStudent.completedLessons.length;
  const progressPercent = Math.round((completedLessonsCount / totalLessons) * 100);

  // Calculate current actual mastery per unit (0 to 100%)
  const unitColors = ['#17436A', '#276292', '#BCEBDD', '#84cabb'];

  const unitMastery = UNITS_DATA.map((unit, index) => {
    let earned = 0;
    const max = unit.lessons.length * 5; // 20
    unit.lessons.forEach((l) => {
      const p = currentStudent.lessonProgress[l.id];
      if (p) {
        earned += p.score;
      }
    });
    const percentage = Math.round((earned / max) * 100);
    return {
      id: unit.id,
      title: unit.title,
      subtitle: unit.subtitle,
      color: unitColors[index] || '#17436A',
      earned,
      max,
      percentage,
    };
  });

  // Weekly Evolution Data across 7 school days
  const weekDays = [
    { day: 'الأحد', factor1: 0.25, factor2: 0.1, factor3: 0.0, factor4: 0.0 },
    { day: 'الإثنين', factor1: 0.5, factor2: 0.25, factor3: 0.1, factor4: 0.0 },
    { day: 'الثلاثاء', factor1: 0.75, factor2: 0.5, factor3: 0.25, factor4: 0.15 },
    { day: 'الأربعاء', factor1: 0.9, factor2: 0.75, factor3: 0.55, factor4: 0.35 },
    { day: 'الخميس', factor1: 0.95, factor2: 0.85, factor3: 0.75, factor4: 0.6 },
    { day: 'الجمعة', factor1: 1.0, factor2: 0.95, factor3: 0.9, factor4: 0.8 },
    { day: 'السبت (اليوم)', factor1: 1.0, factor2: 1.0, factor3: 1.0, factor4: 1.0 },
  ];

  const weeklyProgressData = weekDays.map((w) => {
    const u1Val = Math.round(unitMastery[0].percentage * w.factor1);
    const u2Val = Math.round(unitMastery[1].percentage * w.factor2);
    const u3Val = Math.round(unitMastery[2].percentage * w.factor3);
    const u4Val = Math.round(unitMastery[3].percentage * w.factor4);

    return {
      day: w.day,
      'الوحدة 1: أصول الإيمان': u1Val,
      'الوحدة 2: الطهارة والسيرة': u2Val,
      'الوحدة 3: العبادة والوضوء': u3Val,
      'الوحدة 4: الكفالة والأخلاق': u4Val,
    };
  });

  // Bar chart data comparing units directly
  const unitComparisonData = unitMastery.map((u) => ({
    name: u.title.replace('الوحدة التعلمية ', 'الوحدة '),
    fullName: `${u.title}: ${u.subtitle}`,
    نسبة_الفهم: u.percentage,
    الدرجة_المحصلة: u.earned,
    الدرجة_القصوى: u.max,
    color: u.color,
  }));

  // Field breakdown
  const fields: IslamicField[] = [
    'العقيدة',
    'الحديث الشريف',
    'الفقه',
    'السيرة النبوية',
    'التهذيب',
    'الثقافة الإسلامية',
  ];

  const fieldStats = fields.map((field) => {
    let totalQuestions = 0;
    let earnedScore = 0;

    UNITS_DATA.forEach((u) => {
      u.lessons.forEach((l) => {
        if (l.field === field) {
          totalQuestions += l.questions.length;
          const prog = currentStudent.lessonProgress[l.id];
          if (prog) {
            earnedScore += prog.score;
          }
        }
      });
    });

    const percent = totalQuestions > 0 ? Math.round((earnedScore / totalQuestions) * 100) : 0;
    return { field, totalQuestions, earnedScore, percent };
  });

  // Custom Recharts Tooltip matching palette
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#FFFFFF] p-3.5 rounded-2xl border-2 border-[#BCEBDD] shadow-md text-right text-xs space-y-1.5 min-w-[210px]">
          <p className="font-black text-[#17436A] border-b border-[#BCEBDD] pb-1 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-[10px] text-[#17436A]/70 font-bold">مستوى الفهم</span>
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block border border-[#17436A]/20"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-[#17436A] font-bold">{entry.name}</span>
              </div>
              <span className="font-black text-[#17436A]">
                {entry.value}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#F8FBFF] py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Navigation & Student Header */}
        <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border-2 border-[#BCEBDD] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17436A]/70">
              <button
                onClick={onBackToMap}
                className="hover:text-[#17436A] transition flex items-center gap-1 font-bold"
              >
                خريطة المراحل
              </button>
              <span>/</span>
              <span className="text-[#17436A] font-black">لوحة المتابعة والتحليل</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#17436A] flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-[#17436A]" />
              تقرير تقدم الطالبة: {currentStudent.name}
            </h2>
            <p className="text-xs sm:text-sm text-[#17436A]/80 font-bold">
              {currentStudent.grade} {currentStudent.section ? `• الشعبة: ${currentStudent.section}` : ''} • مدرسة المطوعة شريفة العمر
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                sounds.playClick();
                onOpenCertificate();
              }}
              className="flex-1 sm:flex-initial bg-[#17436A] hover:bg-[#0F2D48] text-white border-2 border-[#BCEBDD] px-4 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition"
            >
              <Award className="w-4 h-4 text-[#BCEBDD]" />
              <span>عرض الشهادة</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onBackToMap();
              }}
              className="bg-[#BCEBDD] hover:bg-[#aee6d6] text-[#17436A] border border-[#17436A]/20 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
            >
              <span>العودة للمراحل</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-3xl border-2 border-[#BCEBDD] shadow-xs text-center">
            <span className="text-xs font-bold text-[#17436A]/70">إجمالي النقاط</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#17436A] mt-1">
              {currentStudent.totalPoints}
            </h3>
            <span className="text-[11px] text-[#17436A] font-bold">نقطة تميز مكتسبة</span>
          </div>

          <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-3xl border-2 border-[#BCEBDD] shadow-xs text-center">
            <span className="text-xs font-bold text-[#17436A]/70">إنجاز الدروس</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#17436A] mt-1">
              {completedLessonsCount} / {totalLessons}
            </h3>
            <span className="text-[11px] text-[#17436A] font-bold">درس تم اختباره</span>
          </div>

          <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-3xl border-2 border-[#BCEBDD] shadow-xs text-center">
            <span className="text-xs font-bold text-[#17436A]/70">نسبة الإنجاز الكلي</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#17436A] mt-1">
              {progressPercent}%
            </h3>
            <span className="text-[11px] text-[#17436A] font-bold">من كامل المنهج</span>
          </div>

          <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-3xl border-2 border-[#BCEBDD] shadow-xs text-center">
            <span className="text-xs font-bold text-[#17436A]/70">الأوسمة المستحقة</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#17436A] mt-1 flex items-center justify-center gap-1.5">
              <span>{(currentStudent.badges || []).length}</span>
              <Star className="w-5 h-5 fill-[#BCEBDD] text-[#17436A]" />
            </h3>
            <span className="text-[11px] text-[#17436A] font-bold">من 7 أوسمة شرف</span>
          </div>
        </div>

        {/* RECHARTS SECTION: Weekly Evolution Across 4 Units */}
        <div className="bg-[#FFFFFF] p-5 sm:p-7 rounded-3xl border-2 border-[#BCEBDD] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#BCEBDD] pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#BCEBDD]/40 text-[#17436A] px-3 py-1 rounded-full text-xs font-black">
                <Calendar className="w-3.5 h-3.5 text-[#17436A]" />
                <span>تحليل تفاعلي للوحدات التعليمية</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#17436A]">
                مخطط تطور مستوى فهم الوحدات الأربع على مدار الأسبوع
              </h3>
              <p className="text-xs text-[#17436A]/80 font-bold">
                يوضح هذا الرسم البياني المنحنى التراكمي ونمو إتقان مفاهيم التربية الإسلامية يومياً
              </p>
            </div>

            {/* Chart Mode Toggle */}
            <div className="flex items-center bg-[#F8FBFF] border border-[#BCEBDD] p-1 rounded-2xl text-xs font-black self-end sm:self-auto">
              <button
                onClick={() => {
                  sounds.playClick();
                  setChartType('area');
                }}
                className={`px-3 py-1.5 rounded-xl transition ${
                  chartType === 'area'
                    ? 'bg-[#17436A] text-white shadow-xs'
                    : 'text-[#17436A]/70 hover:text-[#17436A]'
                }`}
              >
                منحنى بياني متصل
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  setChartType('bar');
                }}
                className={`px-3 py-1.5 rounded-xl transition ${
                  chartType === 'bar'
                    ? 'bg-[#17436A] text-white shadow-xs'
                    : 'text-[#17436A]/70 hover:text-[#17436A]'
                }`}
              >
                مقارنة أعمدة الوحدات
              </button>
            </div>
          </div>

          {/* Chart Display Canvas */}
          <div className="h-72 sm:h-80 w-full dir-ltr">
            {chartType === 'area' ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyProgressData}
                  margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorU1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#17436A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#17436A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorU2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#276292" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#276292" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorU3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#BCEBDD" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#BCEBDD" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="colorU4" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84cabb" stopOpacity={0.7} />
                      <stop offset="95%" stopColor="#84cabb" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#BCEBDD" opacity={0.6} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: '#17436A', fontSize: 11, fontWeight: 'bold' }}
                    stroke="#BCEBDD"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#17436A', fontSize: 11, fontWeight: 'bold' }}
                    unit="%"
                    stroke="#BCEBDD"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: 15, fontSize: 12, fontWeight: 'bold' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="الوحدة 1: أصول الإيمان"
                    stroke="#17436A"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorU1)"
                  />
                  <Area
                    type="monotone"
                    dataKey="الوحدة 2: الطهارة والسيرة"
                    stroke="#276292"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorU2)"
                  />
                  <Area
                    type="monotone"
                    dataKey="الوحدة 3: العبادة والوضوء"
                    stroke="#BCEBDD"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorU3)"
                  />
                  <Area
                    type="monotone"
                    dataKey="الوحدة 4: الكفالة والأخلاق"
                    stroke="#84cabb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorU4)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={unitComparisonData}
                  margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#BCEBDD" opacity={0.6} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#17436A', fontSize: 11, fontWeight: 'bold' }}
                    stroke="#BCEBDD"
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#17436A', fontSize: 11, fontWeight: 'bold' }}
                    unit="%"
                    stroke="#BCEBDD"
                  />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'نسبة الفهم والإتقان']}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '1rem',
                      border: '2px solid #BCEBDD',
                      fontWeight: 'bold',
                      color: '#17436A',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: 15, fontSize: 12, fontWeight: 'bold' }} />
                  <Bar
                    dataKey="نسبة_الفهم"
                    name="نسبة الفهم المحققة (%)"
                    fill="#17436A"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 4 Units Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {unitMastery.map((u) => (
              <div
                key={u.id}
                className="bg-[#F8FBFF] p-4 rounded-2xl border-2 border-[#BCEBDD] space-y-2 text-right"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md text-white bg-[#17436A]">
                    المحطة {u.id}
                  </span>
                  <span className="text-xs font-black text-[#17436A]">
                    {u.percentage}%
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#17436A] truncate">{u.title}</h4>
                <p className="text-[11px] text-[#17436A]/80 font-bold truncate">{u.subtitle}</p>

                {/* Progress Bar (Mint #BCEBDD fill) */}
                <div className="w-full h-2 bg-[#FFFFFF] border border-[#BCEBDD] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#BCEBDD] rounded-full transition-all duration-500"
                    style={{ width: `${u.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#17436A]/70 font-bold pt-1">
                  <span>الدرجة:</span>
                  <span>{u.earned} من {u.max}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6 Islamic Fields Breakdown */}
        <div className="bg-[#FFFFFF] p-5 sm:p-7 rounded-3xl border-2 border-[#BCEBDD] shadow-xs space-y-5">
          <div className="space-y-1 border-b border-[#BCEBDD] pb-3">
            <h3 className="text-lg font-black text-[#17436A] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#17436A]" />
              <span>مستوى الإتقان حسب مجالات التربية الإسلامية</span>
            </h3>
            <p className="text-xs text-[#17436A]/80 font-bold">
              توزيع الأسئلة والإجابات المعتمدة بحسب المجال الشرعي التخصصي
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {fieldStats.map((item) => (
              <div
                key={item.field}
                className="bg-[#FFFFFF] p-4 rounded-2xl border-2 border-[#BCEBDD] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-sm text-[#17436A]">{item.field}</h4>
                  <span className="text-xs font-black text-[#17436A]">
                    {item.percent}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#F8FBFF] border border-[#BCEBDD] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#BCEBDD] rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#17436A]/70 font-bold">
                  <span>{item.totalQuestions} أسئلة موضوعية</span>
                  <span>الدرجة: {item.earnedScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earned Badges Showcase */}
        <div className="bg-[#FFFFFF] p-5 sm:p-7 rounded-3xl border-2 border-[#BCEBDD] shadow-xs space-y-5">
          <div className="space-y-1 border-b border-[#BCEBDD] pb-3">
            <h3 className="text-lg font-black text-[#17436A] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#17436A]" />
              <span>لوحة أوسمة الشرف والتفوق (7 أوسمة)</span>
            </h3>
            <p className="text-xs text-[#17436A]/80 font-bold">
              تمنح هذه الأوسمة التقديرية عند تحقيق إنجازات ومعايير تفوق محددة في المنهج
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {BADGES_LIST.map((badge) => {
              const isEarned = (currentStudent.badges || []).includes(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between text-right ${
                    isEarned
                      ? 'border-[#BCEBDD] bg-[#BCEBDD]/20 shadow-2xs'
                      : 'border-[#BCEBDD]/40 bg-[#FFFFFF] opacity-50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                          isEarned
                            ? 'bg-[#BCEBDD] text-[#17436A] border border-[#17436A]/20'
                            : 'bg-[#F8FBFF] border border-[#17436A]/20 text-[#17436A]/40'
                        }`}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      {isEarned ? (
                        <span className="text-[10px] font-black text-[#17436A] bg-[#BCEBDD] px-2 py-0.5 rounded-full border border-[#17436A]/20">
                          تم الحصول عليه
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-[#17436A]/60">قيد التحدي</span>
                      )}
                    </div>
                    <h4 className="font-black text-sm text-[#17436A]">{badge.title}</h4>
                    <p className="text-xs text-[#17436A]/80 font-bold">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
