import lessonData from './bai_sat_hach_1_den_5.json';
import fullLessonData from './bai_sat_hach_1_den_11_day_du.json';

export type AutoDriveLessonStep = string | {
    title: string;
    details: string[];
};

export interface AutoDriveLesson {
    id: number;
    name: string;
    steps: AutoDriveLessonStep[];
    requirements: string[];
    penalties: string[];
}

/** The lesson text is maintained in bai_sat_hach_1_den_5.json. */
export const AUTO_DRIVE_LESSONS: readonly AutoDriveLesson[] = lessonData.exams;
export const EXAM_06_LESSON: AutoDriveLesson = fullLessonData.exams.find(lesson => lesson.id === 6)!;
export const EXAM_07_LESSON: AutoDriveLesson = fullLessonData.exams.find(lesson => lesson.id === 7)!;
export const EXAM_08_LESSON: AutoDriveLesson = fullLessonData.exams.find(lesson => lesson.id === 8)!;
export const EXAM_09_LESSON: AutoDriveLesson = fullLessonData.exams.find(lesson => lesson.id === 9)!;
export const EXAM_10_LESSON: AutoDriveLesson = fullLessonData.exams.find(lesson => lesson.id === 10)!;
export const EXAM_11_LESSON: AutoDriveLesson = fullLessonData.exams.find(lesson => lesson.id === 11)!;
