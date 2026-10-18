import React, { useState, useEffect } from 'react';
import { Unit, Lesson, StudentProfile, AppSettings } from './types';
import { UNITS_DATA } from './data/questionsData';
import {
  getActiveStudent,
  loadSettings,
  saveSettings,
  saveStudentProfile,
} from './utils/storage';
import { sounds } from './utils/soundEffects';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { JourneyMap } from './components/JourneyMap';
import { LessonQuiz } from './components/LessonQuiz';
import { StudentProgressScreen } from './components/StudentProgressScreen';
import { CertificateView } from './components/CertificateView';
import { StudentRegistrationModal } from './components/StudentRegistrationModal';
import { SettingsModal } from './components/SettingsModal';
import { QuestionBankModal } from './components/QuestionBankModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'map' | 'quiz' | 'progress' | 'certificate'
  >('home');
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings>(loadSettings());

  // Active quiz state
  const [activeUnit, setActiveUnit] = useState<Unit>(UNITS_DATA[0]);
  const [activeLesson, setActiveLesson] = useState<Lesson>(UNITS_DATA[0].lessons[0]);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [forceStudentRegistration, setForceStudentRegistration] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);

  // Load student on mount
  useEffect(() => {
    const student = getActiveStudent();
    if (student) {
      setCurrentStudent(student);
    }
    sounds.setEnabled(settings.soundEnabled);
  }, []);

  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    sounds.setEnabled(newSettings.soundEnabled);
  };

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    handleUpdateSettings({ ...settings, soundEnabled: next });
  };

  const handleSelectLesson = (unit: Unit, lesson: Lesson) => {
    setActiveUnit(unit);
    setActiveLesson(lesson);
    setCurrentScreen('quiz');
  };

  const handleSelectLessonById = (lessonId: string) => {
    for (const unit of UNITS_DATA) {
      const found = unit.lessons.find((l) => l.id === lessonId);
      if (found) {
        setActiveUnit(unit);
        setActiveLesson(found);
        setCurrentScreen('quiz');
        return;
      }
    }
  };

  const handleFinishLesson = (updatedStudent: StudentProfile) => {
    setCurrentStudent(updatedStudent);
  };

  const handleStudentRegistered = (student: StudentProfile) => {
    setCurrentStudent(student);
    setIsStudentModalOpen(false);
    setForceStudentRegistration(false);
  };

  const handleRequireStudentThenAction = (action: () => void) => {
    if (!currentStudent) {
      setForceStudentRegistration(true);
      setIsStudentModalOpen(true);
    } else {
      action();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FBFF] text-[#17436A] flex flex-col font-['Cairo',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentStudent={currentStudent}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenProfileModal={() => {
          setForceStudentRegistration(false);
          setIsStudentModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenCertificates={() =>
          handleRequireStudentThenAction(() => setCurrentScreen('certificate'))
        }
        onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
        onGoHome={() => setCurrentScreen('home')}
        onGoMap={() => handleRequireStudentThenAction(() => setCurrentScreen('map'))}
        activeScreen={currentScreen}
      />

      {/* Main Content View Switcher with Framer Motion Transitions */}
      <main className="flex-1 pb-16 md:pb-0 overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentScreen === 'home' && (
            <motion.div
              key="screen-home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            >
              <HomeScreen
                currentStudent={currentStudent}
                onStartJourney={() =>
                  handleRequireStudentThenAction(() => setCurrentScreen('map'))
                }
                onViewProgress={() =>
                  handleRequireStudentThenAction(() => setCurrentScreen('progress'))
                }
                onViewCertificates={() =>
                  handleRequireStudentThenAction(() => setCurrentScreen('certificate'))
                }
                onOpenQuestionBank={() => setIsQuestionBankOpen(true)}
                onRegisterStudent={() => {
                  setForceStudentRegistration(true);
                  setIsStudentModalOpen(true);
                }}
              />
            </motion.div>
          )}

          {currentScreen === 'map' && (
            <motion.div
              key="screen-map"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            >
              <JourneyMap
                currentStudent={currentStudent}
                onSelectLesson={handleSelectLesson}
                onBackToHome={() => setCurrentScreen('home')}
                onRegisterStudent={() => {
                  setForceStudentRegistration(true);
                  setIsStudentModalOpen(true);
                }}
              />
            </motion.div>
          )}

          {currentScreen === 'quiz' && currentStudent && (
            <motion.div
              key={`screen-quiz-${activeLesson.id}`}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -10 }}
              transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            >
              <LessonQuiz
                unit={activeUnit}
                lesson={activeLesson}
                currentStudent={currentStudent}
                onFinishLesson={handleFinishLesson}
                onBackToMap={() => setCurrentScreen('map')}
              />
            </motion.div>
          )}

          {currentScreen === 'progress' && currentStudent && (
            <motion.div
              key="screen-progress"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            >
              <StudentProgressScreen
                currentStudent={currentStudent}
                onBackToMap={() => setCurrentScreen('map')}
                onOpenCertificate={() => setCurrentScreen('certificate')}
                onSelectLessonById={handleSelectLessonById}
              />
            </motion.div>
          )}

          {currentScreen === 'certificate' && currentStudent && (
            <motion.div
              key="screen-certificate"
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -15 }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            >
              <CertificateView
                currentStudent={currentStudent}
                onBack={() => setCurrentScreen('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Modals */}
      <StudentRegistrationModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        currentStudent={currentStudent}
        onStudentChanged={handleStudentRegistered}
        forceRegistration={forceStudentRegistration}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        currentStudent={currentStudent}
        onOpenStudentModal={() => {
          setForceStudentRegistration(false);
          setIsStudentModalOpen(true);
        }}
      />

      <QuestionBankModal
        isOpen={isQuestionBankOpen}
        onClose={() => setIsQuestionBankOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-[#FFFFFF] border-t border-[#BCEBDD] py-6 px-4 text-center text-xs text-[#17436A]/75 space-y-2 print:hidden">
        <p className="font-black text-[#17436A]">
          رحلة التميز في التربية الإسلامية • الصف السادس – الفصل الدراسي الأول
        </p>
        <p className="text-[#17436A]/70 font-semibold">
          دولة الكويت • وزارة التربية • الإدارة العامة لمنطقة الجهراء التعليمية • مدرسة المطوعة شريفة العمر – المتوسطة بنات
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] font-bold text-[#17436A]/85 pt-1">
          <span>المديرة المساعدة: <strong className="text-[#17436A] font-black">أ. مشاعل العنزي</strong></span>
          <span>•</span>
          <span>الموجهة الفنية: <strong className="text-[#17436A] font-black">أ. ريم الظفيري</strong></span>
          <span>•</span>
          <span>رئيسة القسم: <strong className="text-[#17436A] font-black">أ. فاطمة الدوسري</strong></span>
          <span>•</span>
          <span>إعداد المعلمة: <strong className="text-[#17436A] font-black">أ. أفراح المزعل</strong></span>
        </div>
      </footer>
    </div>
  );
}
