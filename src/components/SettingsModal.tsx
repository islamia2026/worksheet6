import React, { useState } from 'react';
import { AppSettings, StudentProfile } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { SCHOOL_INFO } from '../data/questionsData';
import {
  Settings,
  Volume2,
  VolumeX,
  X,
  Check,
  Users,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  currentStudent: StudentProfile | null;
  onOpenStudentModal: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  currentStudent,
  onOpenStudentModal,
}) => {
  const [saveMessage, setSaveMessage] = useState('');

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    sounds.setEnabled(next);
    onUpdateSettings({ ...settings, soundEnabled: next });
    if (next) {
      sounds.playCorrect();
      setSaveMessage('تم تفعيل المؤثرات الصوتية');
    } else {
      setSaveMessage('تم كتم المؤثرات الصوتية');
    }
    setTimeout(() => setSaveMessage(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17436A]/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-3xl shadow-xl border-2 border-[#BCEBDD] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#17436A] text-white p-5 flex items-center justify-between border-b-2 border-[#BCEBDD]">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#BCEBDD]" />
            <h3 className="text-lg font-black text-white">إعدادات التطبيق</h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {saveMessage && (
            <div className="p-3 bg-[#BCEBDD] border border-[#17436A]/20 text-[#17436A] rounded-xl text-xs font-black flex items-center gap-2">
              <Check className="w-4 h-4 text-[#17436A]" />
              <span>{saveMessage}</span>
            </div>
          )}

          {/* Sound Setting */}
          <div className="flex items-center justify-between p-4 bg-[#F8FBFF] rounded-2xl border-2 border-[#BCEBDD]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#BCEBDD] flex items-center justify-center text-[#17436A]">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-[#17436A]" />
                ) : (
                  <VolumeX className="w-5 h-5 text-[#17436A]/40" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-black text-[#17436A]">المؤثرات الصوتية التفاعلية</h4>
                <p className="text-xs text-[#17436A]/75 font-semibold">أصوات الإجابات الصحيحة ونغمات الفوز والنجوم</p>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                settings.soundEnabled ? 'bg-[#17436A]' : 'bg-[#BCEBDD]'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.soundEnabled ? '-translate-x-6' : 'translate-x-0'
                }`}
              ></div>
            </button>
          </div>

          {/* Student Profile Shortcut */}
          <div className="p-4 bg-[#F8FBFF] rounded-2xl border-2 border-[#BCEBDD] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#BCEBDD] flex items-center justify-center text-[#17436A]">
                  <Users className="w-5 h-5 text-[#17436A]" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#17436A]">الملف الشخصي للطالب</h4>
                  <p className="text-xs text-[#17436A]/75 font-semibold">
                    {currentStudent ? `الطالب النشط: ${currentStudent.name}` : 'لا يوجد طالب مسجل حالياً'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playClick();
                  onClose();
                  onOpenStudentModal();
                }}
                className="text-xs font-black bg-[#17436A] hover:bg-[#0F2D48] text-white px-3 py-1.5 rounded-xl border border-[#BCEBDD] transition cursor-pointer"
              >
                إدارة الملفات
              </button>
            </div>
          </div>

          {/* School Badge Card (Fixed, Permanent Official Emblem) */}
          <div className="p-4 bg-[#F8FBFF] rounded-2xl border-2 border-[#BCEBDD] flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-block bg-[#BCEBDD] text-[#17436A] px-3 py-0.5 rounded-full font-black text-[11px] border border-[#17436A]/20">
                الشعار الرسمي المعتمد
              </div>
              <h4 className="text-sm font-black text-[#17436A]">
                مدرسة {SCHOOL_INFO.schoolName}
              </h4>
              <p className="text-xs text-[#17436A]/75 font-semibold">
                {SCHOOL_INFO.district} • {SCHOOL_INFO.schoolType}
              </p>
            </div>

            <div className="p-2.5 bg-[#FFFFFF] rounded-2xl border-2 border-[#BCEBDD] shrink-0 shadow-2xs">
              <SchoolLogo size="sm" showText={false} />
            </div>
          </div>

          {/* School and App Information */}
          <div className="text-[11px] text-[#17436A]/75 bg-[#FFFFFF] p-3.5 rounded-xl border border-[#BCEBDD] text-center space-y-1 font-semibold">
            <p className="font-black text-[#17436A]">
              {SCHOOL_INFO.country} • {SCHOOL_INFO.ministry}
            </p>
            <p>{SCHOOL_INFO.district} • {SCHOOL_INFO.schoolName} – {SCHOOL_INFO.schoolType}</p>
            <p className="text-[#17436A] font-black">رحلة التميز في التربية الإسلامية • الصف السادس</p>
          </div>
        </div>
      </div>
    </div>
  );
};
