import { StudentProfile, AppSettings, LessonProgress } from '../types';
import { BADGES_LIST } from '../data/questionsData';

const STORAGE_KEY_PROFILES = 'islamic_journey_students_v1';
const STORAGE_KEY_ACTIVE_ID = 'islamic_journey_active_student_id_v1';
const STORAGE_KEY_SETTINGS = 'islamic_journey_settings_v1';

export const getDefaultSettings = (): AppSettings => ({
  soundEnabled: true,
});

export const loadSettings = (): AppSettings => {
  try {
    // Purge any obsolete custom logo saved in previous sessions
    try {
      localStorage.removeItem('islamic_journey_custom_logo_v1');
    } catch {
      // Ignore
    }

    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...getDefaultSettings(),
        ...parsed,
      };
    }
  } catch {
    // Ignore error
  }
  return getDefaultSettings();
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore
  }
};

export const getAllStudents = (): StudentProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore
  }
  return [];
};

export const getActiveStudentId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
  } catch {
    return null;
  }
};

export const setActiveStudentId = (id: string | null): void => {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
    }
  } catch {
    // Ignore
  }
};

export const getActiveStudent = (): StudentProfile | null => {
  const activeId = getActiveStudentId();
  const students = getAllStudents();
  if (activeId) {
    const found = students.find((s) => s.id === activeId);
    if (found) return found;
  }
  return students.length > 0 ? students[0] : null;
};

export const saveStudentProfile = (student: StudentProfile): void => {
  try {
    const students = getAllStudents();
    const index = students.findIndex((s) => s.id === student.id);
    if (index >= 0) {
      students[index] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(students));
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, student.id);
  } catch {
    // Ignore
  }
};

export const createStudent = (name: string, grade = 'السادس', section = ''): StudentProfile => {
  const newStudent: StudentProfile = {
    id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    grade: grade || 'الصف السادس',
    section: section.trim(),
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    totalPoints: 0,
    completedLessons: [],
    completedUnits: [],
    lessonProgress: {},
    badges: [],
  };

  saveStudentProfile(newStudent);
  return newStudent;
};

export const deleteStudent = (id: string): void => {
  try {
    let students = getAllStudents();
    students = students.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(students));

    const activeId = getActiveStudentId();
    if (activeId === id) {
      const nextActive = students.length > 0 ? students[0].id : null;
      setActiveStudentId(nextActive);
    }
  } catch {
    // Ignore
  }
};

// Calculate badges based on progress
export const checkAndAwardBadges = (student: StudentProfile): string[] => {
  const earned = new Set<string>(student.badges);

  // 1. First step
  if (student.completedLessons.length >= 1) {
    earned.add('first_step');
  }

  // 2. Unit 1 master (lessons u1_l1, u1_l2, u1_l3, u1_l4)
  const u1Lessons = ['u1_l1', 'u1_l2', 'u1_l3', 'u1_l4'];
  if (u1Lessons.every((id) => student.completedLessons.includes(id))) {
    earned.add('unit_1_master');
  }

  // 3. Unit 2 master
  const u2Lessons = ['u2_l1', 'u2_l2', 'u2_l3', 'u2_l4'];
  if (u2Lessons.every((id) => student.completedLessons.includes(id))) {
    earned.add('unit_2_master');
  }

  // 4. Unit 3 master
  const u3Lessons = ['u3_l1', 'u3_l2', 'u3_l3', 'u3_l4'];
  if (u3Lessons.every((id) => student.completedLessons.includes(id))) {
    earned.add('unit_3_master');
  }

  // 5. Unit 4 master
  const u4Lessons = ['u4_l1', 'u4_l2', 'u4_l3', 'u4_l4'];
  if (u4Lessons.every((id) => student.completedLessons.includes(id))) {
    earned.add('unit_4_master');
  }

  // 6. Perfect score in any lesson (5/5)
  const hasPerfect = Object.values(student.lessonProgress).some((lp) => lp.score === 5);
  if (hasPerfect) {
    earned.add('perfect_lesson');
  }

  // 7. Streak master (at least 5 lessons with 5/5)
  const perfectCount = Object.values(student.lessonProgress).filter((lp) => lp.score === 5).length;
  if (perfectCount >= 5) {
    earned.add('streak_master');
  }

  // 8. Grand champion (all 16 lessons completed)
  if (student.completedLessons.length >= 16) {
    earned.add('grand_champion');
  }

  return Array.from(earned);
};

export const updateLessonProgressInStudent = (
  student: StudentProfile,
  lessonId: string,
  unitId: number,
  score: number,
  maxScore: number,
  answers: Record<number, { userAnswer: string; isCorrect: boolean }>
): StudentProfile => {
  const existing = student.lessonProgress[lessonId];
  const prevScore = existing?.score || 0;
  const bestScore = Math.max(prevScore, score);

  // Calculate stars: 5/5 = 3 stars, 4/5 = 2 stars, 3/5 = 1 star, <3 = 0 star
  let stars = 0;
  if (bestScore === 5) stars = 3;
  else if (bestScore === 4) stars = 2;
  else if (bestScore >= 3) stars = 1;

  const updatedProgress: LessonProgress = {
    lessonId,
    completed: bestScore >= 3, // Lesson considered passed with 60%+
    score: bestScore,
    maxScore,
    stars,
    attemptsCount: (existing?.attemptsCount || 0) + 1,
    lastAttemptAt: new Date().toISOString(),
    answers,
  };

  const newLessonProgress = {
    ...student.lessonProgress,
    [lessonId]: updatedProgress,
  };

  const completedLessonsSet = new Set(student.completedLessons);
  if (updatedProgress.completed) {
    completedLessonsSet.add(lessonId);
  }

  // Calculate total points: sum of best scores * 20 (max 5 * 20 = 100 points per lesson, 1600 total)
  let totalPoints = 0;
  Object.values(newLessonProgress).forEach((lp) => {
    totalPoints += lp.score * 20;
  });

  // Calculate completed units
  const completedUnitsSet = new Set(student.completedUnits);
  for (let u = 1; u <= 4; u++) {
    const unitLessons = [`u${u}_l1`, `u${u}_l2`, `u${u}_l3`, `u${u}_l4`];
    if (unitLessons.every((id) => completedLessonsSet.has(id))) {
      completedUnitsSet.add(u);
    }
  }

  const updatedStudent: StudentProfile = {
    ...student,
    lastActiveAt: new Date().toISOString(),
    lessonProgress: newLessonProgress,
    completedLessons: Array.from(completedLessonsSet),
    completedUnits: Array.from(completedUnitsSet),
    totalPoints,
    badges: [],
  };

  updatedStudent.badges = checkAndAwardBadges(updatedStudent);
  saveStudentProfile(updatedStudent);
  return updatedStudent;
};
