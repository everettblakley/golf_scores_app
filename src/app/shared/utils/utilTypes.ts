export enum SortMethod {
  DATE_ASC = 0,
  DATE_DESC = 1,
  SCORE_ASC = 2,
  SCORE_DESC = 3,
  COURSE_ASC = 4,
  COURSE_DESC = 5
}

export interface SortOption {
  label: string;
  method: SortMethod
}