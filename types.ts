
export type QuestionType = 'choice' | 'scale' | 'text' | 'multi-choice' | 'consent';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  subtext?: string;
  section?: string;
}

export interface SurveyResponse {
  [key: number]: string | number | string[];
}

export interface Section {
  id: string;
  title: string;
  description: string;
}
