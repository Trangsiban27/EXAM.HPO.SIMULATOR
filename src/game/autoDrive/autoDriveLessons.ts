import lessonData from './bai_sat_hach_1_den_5.json';

export type AutoDriveLessonStep = string | {
    title: string;
    details: string[];
};

export interface AutoDriveLesson {
    id: number;
    name: string;
    steps: AutoDriveLessonStep[];
}

/** The lesson text is maintained in bai_sat_hach_1_den_5.json. */
export const AUTO_DRIVE_LESSONS: readonly AutoDriveLesson[] = lessonData.exams;
