/** Đổi giá trị này để chọn cách chấm điểm cho toàn bộ bài thi. */
export type ExamScoringMode = 'normal' | 'errors-only';

// 'normal': đình chỉ sẽ hiện dialog và dừng chấm điểm.
// 'errors-only': chỉ báo lỗi, vẫn trừ điểm các lỗi thông thường và cho chạy tiếp.
export const EXAM_SCORING_MODE: ExamScoringMode = 'errors-only';
// export const EXAM_SCORING_MODE: ExamScoringMode = 'normal';