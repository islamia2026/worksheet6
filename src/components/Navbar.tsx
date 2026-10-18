import React from 'react';
import { StudentProfile } from '../types';
import {
  Volume2,
  VolumeX,
  User,
  Award,
  Settings,
  BookOpen,
  Users,
  Home,
  Star,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  currentStudent: StudentProfile | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenProfileModal: () => void;
  onOpenSettings: () => void;
  onOpenCertificates: () => void;
  onOpenQuestionBank?: () => void;
  onGoHome: () => void;
  onGoMap?: () => void;
  activeScreen: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStudent,
  soundEnabled,
  onToggleSound,
  onOpenProfileModal,
  onOpenSettings,
  onOpenCertificates,
  onGoHome,
  activeScreen,
}) => {
  return (
    <>
      {/* Top Header Bar: Clean, spacious, uncrowded without school/competition text */}
      <header className="sticky top-0 z-40 bg-[#FFFFFF] border-b border-[#BCEBDD] shadow-2xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Right side in RTL: Clean Educational Icon Button linking to Home */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => {
                  sounds.playClick();
                  onGoHome();
                }}
                title="الصفحة الرئيسية"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#BCEBDD] hover:bg-[#a8e3d2] text-[#17436A] flex items-center justify-center font-black shadow-2xs transition-all hover:scale-105 active:scale-95"
                aria-label="الرئيسية"
              >
                <BookOpen className="w-5 h-5 text-[#17436A]" />
              </button>

              {/* Desktop Navigation Shortcuts: Only Home & Certificates */}
              <nav className="hidden sm:flex items-center gap-1.5 bg-[#F8FBFF] p-1 rounded-2xl border border-[#BCEBDD] text-xs sm:text-sm font-bold text-[#17436A]">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onGoHome();
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeScreen === 'home'
                      ? 'bg-[#BCEBDD] text-[#17436A] shadow-xs font-black'
                      : 'hover:bg-[#BCEBDD]/40'
                  }`}
                >
                  <Home className="w-4 h-4 text-[#17436A]" />
                  <span>الرئيسية</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenCertificates();
                  }}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeScreen === 'certificate'
                      ? 'bg-[#BCEBDD] text-[#17436A] shadow-xs font-black'
                      : 'hover:bg-[#BCEBDD]/40'
                  }`}
                >
                  <Award className="w-4 h-4 text-[#17436A]" />
                  <span>شهاداتي</span>
                </button>
              </nav>
            </div>

            {/* Left side in RTL: Points, Student Profile, Audio & Settings */}
            <div className="flex items-center gap-1.5 sm:gap-2.5">
              {currentStudent ? (
                <>
                  {/* Score Pill strictly with Mint Green (#BCEBDD) and Navy Blue (#17436A) */}
                  <div className="hidden xs:flex items-center gap-1.5 bg-[#BCEBDD]/50 border border-[#17436A]/20 text-[#17436A] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs sm:text-sm font-black shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-[#17436A] text-[#17436A]" />
                    <span>{currentStudent.totalPoints}</span>
                    <span className="text-[10px] text-[#17436A]/80 font-normal">نقطة</span>
                  </div>

                  {/* Student Switcher / Profile Badge */}
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenProfileModal();
                    }}
                    title="تغيير الطالب أو إدارة الحساب"
                    className="flex items-center gap-1.5 bg-[#BCEBDD]/35 hover:bg-[#BCEBDD]/60 border border-[#BCEBDD] text-[#17436A] px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#17436A] text-[#F8FBFF] flex items-center justify-center font-black text-xs shrink-0">
                      {currentStudent.name.charAt(0) || <User className="w-3.5 h-3.5" />}
                    </div>
                    <span className="max-w-[70px] sm:max-w-[120px] truncate text-xs font-black leading-none text-[#17436A]">
                      {currentStudent.name}
                    </span>
                    <Users className="w-3 h-3 text-[#17436A]/70 shrink-0 hidden sm:inline" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onOpenProfileModal();
                  }}
                  className="bg-[#17436A] hover:bg-[#0F2D48] text-[#F8FBFF] border border-[#BCEBDD] px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-black shadow-sm transition-all flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5 text-[#BCEBDD]" />
                  <span className="hidden sm:inline">تسجيل الطالب</span>
                  <span className="sm:hidden">تسجيل</span>
                </button>
              )}

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  onToggleSound();
                  sounds.playClick();
                }}
                title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
                className="p-1.5 sm:p-2 text-[#17436A] hover:bg-[#BCEBDD]/30 rounded-xl transition-colors"
                aria-label="تبديل الصوت"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#17436A]" />
                ) : (
                  <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-[#17436A]/40" />
                )}
              </button>

              {/* Settings button */}
              <button
                onClick={() => {
                  sounds.playClick();
                  onOpenSettings();
                }}
                title="الإعدادات والشعار"
                className="p-1.5 sm:p-2 text-[#17436A] hover:bg-[#BCEBDD]/30 rounded-xl transition-colors"
                aria-label="الإعدادات"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-[#17436A]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar: Only Home & Certificates */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#FFFFFF] border-t border-[#BCEBDD] shadow-lg px-6 py-2 flex items-center justify-around print:hidden">
        <button
          onClick={() => {
            sounds.playClick();
            onGoHome();
          }}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all ${
            activeScreen === 'home'
              ? 'text-[#17436A] bg-[#BCEBDD]/50 font-black'
              : 'text-[#17436A]/60 font-medium'
          }`}
        >
          <Home className="w-5 h-5 text-[#17436A]" />
          <span className="text-[11px] mt-0.5">الرئيسية</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenCertificates();
          }}
          className={`flex flex-col items-center justify-center px-4 py-1.5 rounded-xl transition-all ${
            activeScreen === 'certificate'
              ? 'text-[#17436A] bg-[#BCEBDD]/50 font-black'
              : 'text-[#17436A]/60 font-medium'
          }`}
        >
          <Award className="w-5 h-5 text-[#17436A]" />
          <span className="text-[11px] mt-0.5">شهاداتي</span>
        </button>
      </nav>
    </>
  );
};
