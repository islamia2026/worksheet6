import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { createStudent, getAllStudents, setActiveStudentId, deleteStudent } from '../utils/storage';
import { UserPlus, Users, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfile | null;
  onStudentChanged: (student: StudentProfile) => void;
  forceRegistration?: boolean;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onStudentChanged,
  forceRegistration = false,
}) => {
  const [tab, setTab] = useState<'new' | 'list'>('new');
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('الصف السادس');
  const [section, setSection] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const existingStudents = getAllStudents();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('يرجى إدخال اسم الطالب أو الطالبة كاملاً لمتابعة الرحلة');
      sounds.playWrong();
      return;
    }
    setError('');
    const newStudent = createStudent(fullName, grade, section);
    sounds.playVictory();
    onStudentChanged(newStudent);
    setFullName('');
    setSection('');
    onClose();
  };

  const handleSelectStudent = (student: StudentProfile) => {
    setActiveStudentId(student.id);
    sounds.playClick();
    onStudentChanged(student);
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الملف؟')) {
      deleteStudent(id);
      sounds.playWrong();
      const updated = getAllStudents();
      if (updated.length > 0) {
        onStudentChanged(updated[0]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17436A]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-3xl shadow-xl border-2 border-[#BCEBDD] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Banner in #17436A with #BCEBDD border */}
        <div className="bg-[#17436A] p-6 text-white text-center relative overflow-hidden border-b-2 border-[#BCEBDD]">
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-xl font-black text-white">تسجيل الطالب في رحلة التميز</h2>
            <p className="text-xs text-[#BCEBDD] mt-1 font-bold">
              مدرسة المطوعة شريفة العمر – المتوسطة بنات | منطقة الجهراء
            </p>
          </div>
        </div>

        {/* Tab switchers if there are existing profiles */}
        {existingStudents.length > 0 && (
          <div className="flex border-b-2 border-[#BCEBDD] bg-[#F8FBFF] text-sm font-bold">
            <button
              onClick={() => {
                setTab('new');
                sounds.playClick();
              }}
              className={`flex-1 py-3 text-center flex items-center justify-center gap-2 border-b-2 transition-colors ${
                tab === 'new'
                  ? 'border-[#17436A] text-[#17436A] bg-[#FFFFFF] font-black'
                  : 'border-transparent text-[#17436A]/70 hover:text-[#17436A]'
              }`}
            >
              <UserPlus className="w-4 h-4 text-[#17436A]" />
              طالب جديد
            </button>
            <button
              onClick={() => {
                setTab('list');
                sounds.playClick();
              }}
              className={`flex-1 py-3 text-center flex items-center justify-center gap-2 border-b-2 transition-colors ${
                tab === 'list'
                  ? 'border-[#17436A] text-[#17436A] bg-[#FFFFFF] font-black'
                  : 'border-transparent text-[#17436A]/70 hover:text-[#17436A]'
              }`}
            >
              <Users className="w-4 h-4 text-[#17436A]" />
              اختيار ملف سابق ({existingStudents.length})
            </button>
          </div>
        )}

        <div className="p-6">
          {tab === 'new' ? (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-black text-[#17436A] mb-1.5">
                  الاسم الكامل للطالب أو الطالبة <span className="text-[#17436A]">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: شريفة أحمد الكندري"
                  className="w-full px-4 py-3 text-base rounded-xl border-2 border-[#BCEBDD] text-[#17436A] bg-[#FFFFFF] focus:outline-none focus:border-[#17436A] transition font-bold"
                  autoFocus
                />
                {error && <p className="text-xs text-[#17436A] font-black mt-1.5 bg-[#BCEBDD]/40 p-2 rounded-lg border border-[#17436A]/20">{error}</p>}
                <p className="text-[11px] text-[#17436A]/70 mt-1 font-semibold">
                  سيظهر هذا الاسم رسمياً في لوحة الإنجازات والشهادات الصادرة.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17436A] mb-1">
                    الصف (افتراضي)
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border-2 border-[#BCEBDD] bg-[#F8FBFF] text-[#17436A] focus:outline-none focus:border-[#17436A] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17436A] mb-1">
                    الشعبة / الفصل (اختياري)
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="مثال: 6 / 1"
                    className="w-full px-3 py-2.5 text-sm rounded-xl border-2 border-[#BCEBDD] bg-[#FFFFFF] text-[#17436A] focus:outline-none focus:border-[#17436A] font-bold"
                  />
                </div>
              </div>

              <div className="bg-[#BCEBDD]/30 rounded-2xl p-3.5 border-2 border-[#BCEBDD] flex items-start gap-2 text-xs text-[#17436A] leading-relaxed font-bold">
                <Sparkles className="w-4 h-4 text-[#17436A] shrink-0 mt-0.5" />
                <span>
                  نحن نحرص على خصوصيتك: لا نطلب الرقم المدني أو أي بيانات حساسة. يتم حفظ تقدمك على جهازك بأمان.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                {!forceRegistration && currentStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                    }}
                    className="px-4 py-2.5 rounded-xl text-[#17436A] hover:bg-[#BCEBDD]/30 text-sm font-black transition"
                  >
                    إلغاء
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-1 bg-[#17436A] hover:bg-[#0F2D48] text-white py-3 px-6 rounded-xl font-black text-base border-2 border-[#BCEBDD] shadow-xs flex items-center justify-center gap-2 transition"
                >
                  <span>ابدأ المغامرة</span>
                  <ArrowRight className="w-5 h-5 rtl:rotate-180 text-[#BCEBDD]" />
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[#17436A]/80 mb-2 font-black">
                اختر الحساب المسجل سابقاً للمتابعة من حيث توقفت:
              </p>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {existingStudents.map((student) => {
                  const isCurrent = currentStudent?.id === student.id;
                  return (
                    <div
                      key={student.id}
                      onClick={() => handleSelectStudent(student)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'border-[#17436A] bg-[#BCEBDD]/30 shadow-xs'
                          : 'border-[#BCEBDD] hover:border-[#17436A] hover:bg-[#F8FBFF]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white bg-[#17436A]">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-[#17436A] text-sm">{student.name}</h4>
                            {isCurrent && (
                              <span className="text-[10px] bg-[#BCEBDD] text-[#17436A] border border-[#17436A]/20 px-2 py-0.5 rounded-full font-black">
                                النشط حالياً
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#17436A]/75 font-semibold">
                            {student.grade} {student.section ? `• شعبة ${student.section}` : ''} •{' '}
                            {student.totalPoints} نقطة • {student.completedLessons.length} دروس مكتملة
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, student.id)}
                          title="حذف الملف"
                          className="p-1.5 text-[#17436A]/40 hover:text-[#17436A] rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#BCEBDD] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setTab('new');
                    sounds.playClick();
                  }}
                  className="text-xs text-[#17436A] font-black flex items-center gap-1 hover:underline"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#17436A]" />
                  تسجيل طالب إضافي جديد
                </button>
                {!forceRegistration && (
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      onClose();
                    }}
                    className="px-4 py-2 text-xs font-bold text-[#17436A] hover:bg-[#BCEBDD]/30 rounded-xl transition"
                  >
                    إغلاق
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
