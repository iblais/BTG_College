import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';
import { type Enrollment } from '@/lib/enrollment';
import {
  BookOpen, CheckCircle, Play, Clock,
  ChevronRight, Loader2, GraduationCap, Zap,
  FileText, HelpCircle, Award, Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  week1Image, week2Image, week3Image, week4Image,
  week5Image, week6Image, week7Image, week8Image,
  week9Image, week10Image, week11Image, week12Image,
  week13Image, week14Image, week15Image, week16Image,
  week17Image, week18Image
} from '@/assets';
import { LessonScreen } from './LessonScreen';
import { QuizScreen } from './QuizScreen';
import { FinalExamScreen } from './FinalExamScreen';
import { awardXP } from '@/lib/xp';
import { checkAchievements } from '@/lib/achievements';

// Map week numbers to images
const weekImages: Record<number, string> = {
  1: week1Image,
  2: week2Image,
  3: week3Image,
  4: week4Image,
  5: week5Image,
  6: week6Image,
  7: week7Image,
  8: week8Image,
  9: week9Image,
  10: week10Image,
  11: week11Image,
  12: week12Image,
  13: week13Image,
  14: week14Image,
  15: week15Image,
  16: week16Image,
  17: week17Image,
  18: week18Image,
};

interface CoursesScreenProps {
  enrollment: Enrollment | null;
}

interface CourseProgress {
  week_number: number;
  completed: boolean;
  quiz_completed: boolean;
  lesson_completed: boolean;
  score: number;
}

interface Week {
  number: number;
  title: string;
  description: string;
  modules: number;
  duration: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number;
}

type ViewMode = 'list' | 'lesson' | 'quiz' | 'final_exam';

export function CoursesScreen({ enrollment }: CoursesScreenProps) {
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [startSection, setStartSection] = useState<number>(0);
  // Track which modules have activities completed per week: { weekNumber: [day1Complete, day2Complete, ...] }
  const [weekActivities, setWeekActivities] = useState<Record<number, boolean[]>>({});
  // Locked week message
  const [lockedMessage, setLockedMessage] = useState<string | null>(null);

  const totalWeeks = 10; // BTG College is a 10-week program

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // Max 5 seconds loading

    Promise.all([loadProgress(), loadActivityProgress()])
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });

    return () => clearTimeout(timeout);
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('week_number', { ascending: true });

      if (data) setCourseProgress(data);
    } catch (err) {
      console.error('Failed to load progress:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load activity completions to determine quiz lock status
  const loadActivityProgress = async () => {
    const activities: Record<number, boolean[]> = {};

    // 1. First check localStorage for all weeks (1-10)
    for (let week = 1; week <= 10; week++) {
      for (let section = 0; section < 4; section++) {
        const localKey = `btg_activity_${week}_${section}`;
        if (localStorage.getItem(localKey)) {
          if (!activities[week]) {
            activities[week] = [false, false, false, false];
          }
          activities[week][section] = true;
        }
      }
    }

    // 2. Then try database
    try {
      const user = await getCurrentUser();
      if (user) {
        const { data } = await supabase
          .from('activity_responses')
          .select('week_number, day_number')
          .eq('user_id', user.id);

        if (data && data.length > 0) {
          data.forEach((item: { week_number: number; day_number: number }) => {
            if (!activities[item.week_number]) {
              activities[item.week_number] = [false, false, false, false];
            }
            if (item.day_number >= 1 && item.day_number <= 4) {
              activities[item.week_number][item.day_number - 1] = true;
            }
          });
        }
      }
    } catch (err) {
      console.error('Error loading activity progress:', err);
    }

    setWeekActivities(activities);
  };

  // Check if quiz is unlocked for a week (all 4 modules completed)
  const isQuizUnlocked = (weekNum: number): boolean => {
    const activities = weekActivities[weekNum];
    if (!activities) return false;
    // All 4 modules must have activities completed
    return activities.every(completed => completed === true);
  };

  // Get count of completed modules for a week
  const getCompletedModuleCount = (weekNum: number): number => {
    const activities = weekActivities[weekNum];
    if (!activities) return 0;
    return activities.filter(completed => completed === true).length;
  };

  // College week titles (10 weeks) - Mapped from HS content
  const weekTitles: Record<number, { title: string; description: string }> = {
    1: { title: 'Understanding Income, Expenses & Savings', description: 'Learn to track your money flow' },
    2: { title: 'How to Open & Manage a Bank Account', description: 'Opening and managing accounts' },
    3: { title: 'What is Credit?', description: 'How credit works and its importance' },
    4: { title: 'How to Build & Maintain Good Credit', description: 'Building a strong credit history' },
    5: { title: 'Create a Personal Budget', description: 'Creating your spending plan' },
    6: { title: 'Personal Branding & Professionalism', description: 'Building your professional image' },
    7: { title: 'Resume Building & Job Applications', description: 'Creating an impressive resume' },
    8: { title: 'Career Readiness & Leadership', description: 'Preparing for the workforce' },
    9: { title: 'Networking & Professional Connections', description: 'Building professional connections' },
    10: { title: 'Entrepreneurship & Career Planning', description: 'Starting your own business' },
  };

  const handleStartLesson = (weekNum: number, section: number = 0) => {
    setActiveWeek(weekNum);
    setStartSection(section);
    setViewMode('lesson');
    setSelectedWeek(null);
  };

  const handleStartQuiz = (weekNum: number) => {
    setActiveWeek(weekNum);
    setViewMode('quiz');
    setSelectedWeek(null);
  };

  const handleLessonComplete = (completed: boolean) => {
    // Save to localStorage immediately
    if (completed) {
      const localKey = `btg_lesson_complete_${activeWeek}`;
      localStorage.setItem(localKey, JSON.stringify({ completed: true, timestamp: Date.now() }));
    }

    // Check if all 4 activities for this week are completed
    let allActivitiesComplete = true;
    for (let section = 0; section < 4; section++) {
      const localKey = `btg_activity_${activeWeek}_${section}`;
      if (!localStorage.getItem(localKey)) {
        allActivitiesComplete = false;
        break;
      }
    }

    // If all activities complete, go to quiz. Otherwise go back to list.
    if (allActivitiesComplete) {
      setViewMode('quiz');
    } else {
      setViewMode('list');
    }

    // Save to Supabase database
    if (completed) {
      (async () => {
        try {
          const user = await getCurrentUser();
          if (user) {
            const { data, error } = await supabase
              .from('course_progress')
              .upsert({
                user_id: user.id,
                enrollment_id: enrollment?.id || null,
                week_number: activeWeek,
                lesson_completed: true,
                quiz_completed: false
              }, { onConflict: 'user_id,week_number' })
              .select();

            if (error) {
              console.error('Supabase course_progress error:', error.message);
            } else {
              console.log('✓ Course progress saved to Supabase:', data);
            }
          }
        } catch (err) {
          console.error('Failed to save lesson progress:', err);
        }
        loadProgress();
        loadActivityProgress();
      })();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleQuizComplete = async (score: number, passed: boolean, answers: number[] = [], _timeTaken: number = 0, writingResponses?: string[]) => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const percentage = Math.round((score / 10) * 100);
        const enrollmentId = enrollment?.id || null;

        // Always save quiz attempt to quiz_attempts table (pass or fail)
        const answersObject: Record<number, number> = {};
        answers.forEach((answer, index) => {
          answersObject[index] = answer;
        });

        await supabase
          .from('quiz_attempts')
          .insert({
            user_id: user.id,
            score: score,
            answers: answersObject,
            completed_at: new Date().toISOString()
          });

        // Save writing prompt responses to activity_responses table
        if (writingResponses && writingResponses.length > 0) {
          const writingPromptInserts = writingResponses.map((response, index) => ({
            user_id: user.id,
            week_number: activeWeek,
            day_number: 5 + index, // Use day 5+ for writing prompts (after 4 lesson modules)
            module_number: 5 + index,
            response_text: response,
            submitted_at: new Date().toISOString()
          }));

          for (const insert of writingPromptInserts) {
            await supabase
              .from('activity_responses')
              .upsert(insert, { onConflict: 'user_id,week_number,day_number' });
          }
        }

        // Update course_progress if passed
        if (passed) {
          await supabase
            .from('course_progress')
            .upsert({
              user_id: user.id,
              enrollment_id: enrollmentId,
              week_number: activeWeek,
              lesson_completed: true,
              quiz_completed: true,
              completed: true,  // Mark week as fully completed
              best_quiz_score: percentage
            }, { onConflict: 'user_id,week_number' });

          // Also save quiz completion to localStorage for offline support
          const quizKey = `btg_quiz_complete_${activeWeek}`;
          localStorage.setItem(quizKey, JSON.stringify({ passed: true, score: percentage, timestamp: Date.now() }));

          // Award XP for passing quiz
          await awardXP('pass_quiz', { percentage });

          // Award bonus XP for completing the week
          await awardXP('complete_week');

          // Check for quiz and week achievements
          await checkAchievements('pass_quiz', { percentage, weekNumber: activeWeek });
          await checkAchievements('complete_week', { weekNumber: activeWeek });
        }

        await loadProgress();
      }
    } catch (err) {
      console.error('Failed to save quiz result:', err);
    }
    setViewMode('list');
  };

  // Save progress when each section is completed (fire and forget - don't block UI)
  const handleSectionComplete = (sectionIndex: number, totalSections: number) => {
    // Run async without blocking
    (async () => {
      try {
        const user = await getCurrentUser();
        if (!user) return;

        const enrollmentId = enrollment?.id || null;

        // Save to course_progress for overall tracking
        await supabase
          .from('course_progress')
          .upsert({
            user_id: user.id,
            enrollment_id: enrollmentId,
            week_number: activeWeek,
            lesson_completed: sectionIndex + 1 >= totalSections,
            quiz_completed: false
          }, { onConflict: 'user_id,week_number' });

        // Save to lesson_progress for detailed section tracking
        if (enrollmentId) {
          await supabase
            .from('lesson_progress')
            .upsert({
              user_id: user.id,
              enrollment_id: enrollmentId,
              week_number: activeWeek,
              section_index: sectionIndex,
              completed: true,
              completed_at: new Date().toISOString()
            }, { onConflict: 'user_id,week_number,section_index' });
        }

        // Award XP for completing a lesson section
        await awardXP('complete_lesson');

        // Check for achievements
        await checkAchievements('complete_lesson');
      } catch (err) {
        console.error('Failed to save section progress:', err);
      }
    })();
  };

  const getWeekStatus = (weekNum: number): Week['status'] => {
    // Check database progress - week is completed when quiz is passed
    const progress = courseProgress.find(p => p.week_number === weekNum);

    // Check localStorage for quiz completion (offline support)
    const localQuizKey = `btg_quiz_complete_${weekNum}`;
    const localQuiz = localStorage.getItem(localQuizKey);

    // Week is completed if quiz_completed is true in DB or localStorage
    if (progress?.quiz_completed || localQuiz) return 'completed';

    // Check localStorage for lesson completion
    const localLessonKey = `btg_lesson_complete_${weekNum}`;
    const localLesson = localStorage.getItem(localLessonKey);

    // Check if any activities are started (in_progress)
    const activities = weekActivities[weekNum];
    const hasAnyActivity = activities && activities.some(a => a);

    if (progress || localLesson || hasAnyActivity) return 'in_progress';

    // Week 1 is always available
    if (weekNum === 1) return 'available';

    // TESTING MODE: All weeks unlocked for testing
    return 'available';

    // For other weeks, check if previous week's QUIZ is completed (not just lessons)
    // const prevProgress = courseProgress.find(p => p.week_number === weekNum - 1);
    // const prevLocalQuiz = localStorage.getItem(`btg_quiz_complete_${weekNum - 1}`);
    // if (prevProgress?.quiz_completed || prevLocalQuiz) return 'available';

    // return 'locked';
  };

  const getWeekProgress = (weekNum: number): number => {
    // Check database progress - 100% when quiz is passed
    const progress = courseProgress.find(p => p.week_number === weekNum);
    const localQuiz = localStorage.getItem(`btg_quiz_complete_${weekNum}`);
    if (progress?.quiz_completed || localQuiz) return 100;

    // Calculate from activities completed
    const activities = weekActivities[weekNum];
    if (activities) {
      const completedCount = activities.filter(a => a).length;
      // 4 activities = lesson part (50%), quiz = other 50%
      return Math.round((completedCount / 4) * 50);
    }

    // Check localStorage directly
    let localCount = 0;
    for (let i = 0; i < 4; i++) {
      if (localStorage.getItem(`btg_activity_${weekNum}_${i}`)) {
        localCount++;
      }
    }
    if (localCount > 0) {
      return Math.round((localCount / 4) * 50);
    }

    return progress?.score || 0;
  };

  // Handle week card click - block if locked
  const handleWeekClick = (week: Week) => {
    if (week.status === 'locked') {
      setLockedMessage(`Complete Week ${week.number - 1} to unlock Week ${week.number}`);
      // Auto-dismiss after 3 seconds
      setTimeout(() => setLockedMessage(null), 3000);
      return;
    }
    setSelectedWeek(week.number);
  };

  const weeks: Week[] = Array.from({ length: totalWeeks }, (_, i) => {
    const num = i + 1;
    const info = weekTitles[num] || { title: `Week ${num}`, description: 'Coming soon' };
    return {
      number: num,
      title: info.title,
      description: info.description,
      modules: 4,
      duration: '45 min',
      status: getWeekStatus(num),
      progress: getWeekProgress(num),
    };
  });

  const completedCount = weeks.filter(w => w.status === 'completed').length;
  const overallProgress = Math.round((completedCount / totalWeeks) * 100);

  // Show LessonScreen
  if (viewMode === 'lesson') {
    const week = weeks.find(w => w.number === activeWeek);
    return (
      <LessonScreen
        weekNumber={activeWeek}
        weekTitle={week?.title || `Week ${activeWeek}`}
        trackLevel={enrollment?.track_level || 'beginner'}
        programId={enrollment?.program_id || 'COLLEGE'}
        startSection={startSection}
        enrollmentId={enrollment?.id || null}
        onBack={() => setViewMode('list')}
        onComplete={handleLessonComplete}
        onSectionComplete={handleSectionComplete}
      />
    );
  }

  // Show QuizScreen
  if (viewMode === 'quiz') {
    const week = weeks.find(w => w.number === activeWeek);
    return (
      <QuizScreen
        weekNumber={activeWeek}
        weekTitle={week?.title || `Week ${activeWeek}`}
        programId={enrollment?.program_id || 'COLLEGE'}
        onBack={() => setViewMode('list')}
        onComplete={handleQuizComplete}
      />
    );
  }

  // Show FinalExamScreen
  if (viewMode === 'final_exam') {
    return (
      <FinalExamScreen
        onBack={() => setViewMode('list')}
        onComplete={async (score, passed) => {
          if (passed) {
            try {
              const user = await getCurrentUser();
              if (user) {
                // Save final exam result
                await supabase
                  .from('course_progress')
                  .upsert({
                    user_id: user.id,
                    week_number: 999, // Special week number for final exam
                    best_quiz_score: Math.round((score / 50) * 100),
                    quiz_completed: true
                  }, { onConflict: 'user_id,week_number' });

                // Award XP for completing final exam
                await awardXP('complete_final_exam');
              }
            } catch (err) {
              console.error('Failed to save final exam result:', err);
            }
          }
          setViewMode('list');
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-[#4A5FFF] animate-spin" />
          <p className="text-white/60">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-6 md:pb-0">
      {/* Progress Overview - EXCITING VERSION */}
      <div className="hero-card rounded-2xl p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-500)] to-[var(--secondary-500)] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Your Learning Program</h3>
                <p className="text-[var(--text-tertiary)] text-sm">
                  College Track - 10 Week Program
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[48px] font-black gradient-text-primary leading-none">{overallProgress}%</p>
            <p className="text-[var(--text-tertiary)] text-sm mt-1">{completedCount} of {totalWeeks} weeks complete</p>
          </div>
        </div>

        {/* Progress Bar with Shimmer */}
        <div className="relative w-full bg-white/[0.08] rounded-full h-4 mb-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary-500)] via-[var(--success)] to-[var(--secondary-500)] transition-all duration-500 progress-shimmer"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {/* Milestone Markers */}
        <div className="flex justify-between items-center px-1">
          {[0, 25, 50, 75, 100].map((milestone) => (
            <div key={milestone} className="flex flex-col items-center">
              <div className={cn(
                "milestone-marker",
                overallProgress >= milestone && "completed",
                overallProgress >= milestone - 10 && overallProgress < milestone && "current"
              )} />
              <span className={cn(
                "text-xs mt-1.5 font-semibold",
                overallProgress >= milestone ? "text-[var(--success)]" : "text-[var(--text-muted)]"
              )}>{milestone}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Final Exam Card */}
      <div
        onClick={() => setViewMode('final_exam')}
        className="hero-card rounded-2xl p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#9B59B6] to-[#8E44AD] flex items-center justify-center shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white group-hover:text-[#9B59B6] transition-colors">
                Final Certification Exam
              </h3>
              <p className="text-[var(--text-tertiary)] text-sm mt-1">
                50 questions covering all course material - 70% to pass
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-white/60 text-sm">Earn your</p>
              <p className="text-[#9B59B6] font-bold">Financial Literacy Certificate</p>
            </div>
            <ChevronRight className="w-6 h-6 text-white/40 group-hover:text-[#9B59B6] transition-colors" />
          </div>
        </div>
      </div>

      {/* Locked Week Message */}
      {lockedMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <Lock className="w-5 h-5" />
            <span className="font-medium">{lockedMessage}</span>
          </div>
        </div>
      )}

      {/* Weeks Grid - EXCITING VERSION WITH IMAGES */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {weeks.map((week) => (
          <div
            key={week.number}
            onClick={() => handleWeekClick(week)}
            className={cn(
              "course-card-lift rounded-2xl overflow-hidden transition-all duration-300 group",
              week.status === 'locked'
                ? "bg-[var(--bg-elevated)] border border-[var(--border-subtle)] opacity-60 cursor-not-allowed"
                : "cursor-pointer",
              week.status === 'completed'
                ? "bg-gradient-to-br from-[var(--success)]/10 to-[var(--bg-elevated)] border-2 border-[var(--success)]/30"
                : week.status === 'in_progress'
                ? "bg-gradient-to-br from-[var(--primary-500)]/10 to-[var(--bg-elevated)] border-2 border-[var(--primary-500)]/30"
                : week.status === 'available'
                ? "bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--primary-500)]/30"
                : ""
            )}
          >
            {/* Course Image */}
            <div className="relative h-36 overflow-hidden">
              <img
                src={weekImages[week.number]}
                alt={week.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-transparent to-transparent" />

              {/* Week Badge on Image */}
              <div className="absolute top-3 left-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm",
                  week.status === 'completed'
                    ? "bg-[var(--success)]/90"
                    : week.status === 'in_progress'
                    ? "bg-[var(--primary-500)]/90"
                    : week.status === 'locked'
                    ? "bg-black/70"
                    : "bg-black/50"
                )}>
                  {week.status === 'completed' ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : week.status === 'locked' ? (
                    <Lock className="w-5 h-5 text-white/60" />
                  ) : (
                    <span className="text-lg font-black text-white">{week.number}</span>
                  )}
                </div>
              </div>

              {/* Status Badge on Image */}
              <div className="absolute top-3 right-3">
                <div className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm",
                  week.status === 'completed'
                    ? "bg-[var(--success)]/90 text-white"
                    : week.status === 'in_progress'
                    ? "bg-[var(--primary-500)]/90 text-white"
                    : week.status === 'locked'
                    ? "bg-black/70 text-white/60"
                    : "bg-black/50 text-white/80"
                )}>
                  {week.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                  {week.status === 'in_progress' && <Zap className="w-3 h-3" />}
                  {week.status === 'locked' && <Lock className="w-3 h-3" />}
                  {week.status === 'completed' ? 'Complete' :
                   week.status === 'in_progress' ? 'In Progress' :
                   week.status === 'locked' ? 'Locked' : 'Ready'}
                </div>
              </div>

              {/* Pulse indicator for in-progress */}
              {week.status === 'in_progress' && (
                <div className="absolute bottom-3 right-3">
                  <div className="w-3 h-3 rounded-full bg-[var(--success)] animate-pulse shadow-lg shadow-[var(--success)]/50" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5">
              <h4 className="text-[var(--text-primary)] font-bold text-lg mb-1 group-hover:text-[var(--primary-500)] transition-colors">
                {week.title}
              </h4>
              <p className="text-[var(--text-tertiary)] text-sm mb-4">
                {week.description}
              </p>

              {/* Progress Bar */}
              <div className="relative w-full bg-white/[0.08] rounded-full h-2 mb-3 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    week.status === 'completed'
                      ? "bg-gradient-to-r from-[var(--success)] to-[var(--success-dark)]"
                      : "bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-600)] progress-shimmer"
                  )}
                  style={{ width: `${week.progress}%` }}
                />
              </div>

              {/* Footer Stats */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-[var(--text-tertiary)]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {week.modules} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {week.duration}
                  </span>
                </div>
                <span className={cn(
                  "font-bold",
                  week.status === 'completed' ? "text-[var(--success)]" : "text-[var(--primary-500)]"
                )}>
                  {week.progress}%
                </span>
              </div>

              {/* XP Reward Badge */}
              <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[var(--text-muted)] text-xs">Complete for</span>
                <div className="flex items-center gap-1.5 text-[var(--secondary-500)] font-bold text-sm">
                  <Zap className="w-4 h-4" />
                  +150 XP
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Week Modal */}
      {selectedWeek && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
          onClick={() => setSelectedWeek(null)}
        >
          <div
            className="bg-[#0A0E27] border border-white/[0.1] rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const week = weeks.find(w => w.number === selectedWeek)!;
              return (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-white/40 text-sm mb-1">Week {week.number}</p>
                      <h3 className="text-xl font-bold text-white">{week.title}</h3>
                      <p className="text-white/60 text-sm mt-1">{week.description}</p>
                    </div>
                    <button
                      onClick={() => setSelectedWeek(null)}
                      className="text-white/40 hover:text-white transition-colors flex-shrink-0 ml-4"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Modules - Clickable with locking */}
                  <div className="space-y-3 mb-6">
                    {Array.from({ length: 4 }, (_, i) => {
                      const activities = weekActivities[week.number] || [false, false, false, false];
                      const isModuleComplete = activities[i] === true;
                      // Module is unlocked if it's the first module OR the previous module is complete
                      const isModuleUnlocked = i === 0 || activities[i - 1] === true;

                      return (
                        <div
                          key={i}
                          onClick={() => isModuleUnlocked && handleStartLesson(week.number, i)}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-xl transition-all",
                            isModuleUnlocked
                              ? "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-[#4A5FFF]/30 cursor-pointer active:scale-[0.98]"
                              : "bg-white/[0.02] border border-white/[0.03] cursor-not-allowed opacity-50"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            isModuleComplete ? "bg-[#50D890]/20" : !isModuleUnlocked ? "bg-white/5" : "bg-white/5"
                          )}>
                            {isModuleComplete ? (
                              <CheckCircle className="w-5 h-5 text-[#50D890]" />
                            ) : !isModuleUnlocked ? (
                              <Lock className="w-5 h-5 text-white/30" />
                            ) : (
                              <Play className="w-5 h-5 text-white/40" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={cn("font-medium", isModuleUnlocked ? "text-white" : "text-white/50")}>
                              Module {i + 1}
                            </p>
                            <p className="text-white/40 text-sm">
                              {isModuleComplete ? 'Completed' : !isModuleUnlocked ? 'Complete previous module' : 'Tap to start'}
                            </p>
                          </div>
                          <ChevronRight className={cn("w-5 h-5", isModuleUnlocked ? "text-white/30" : "text-white/20")} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStartLesson(week.number)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#4A5FFF] to-[#00BFFF] text-white font-semibold hover:opacity-90 transition-opacity"
                    >
                      <FileText className="w-5 h-5" />
                      {week.progress > 0 && week.progress < 100 ? 'Continue Lesson' : 'Start Lesson'}
                    </button>
                    <button
                      onClick={() => isQuizUnlocked(week.number) && handleStartQuiz(week.number)}
                      disabled={!isQuizUnlocked(week.number)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-colors ${
                        isQuizUnlocked(week.number)
                          ? 'border-white/[0.1] text-white hover:bg-white/[0.05]'
                          : 'border-white/[0.05] text-white/40 cursor-not-allowed'
                      }`}
                    >
                      {isQuizUnlocked(week.number) ? (
                        <>
                          <HelpCircle className="w-5 h-5" />
                          Take Quiz
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          <span className="text-xs">Complete all modules ({getCompletedModuleCount(week.number)}/4)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
