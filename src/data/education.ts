export interface EducationItem {
  school: string;
  degree: string;
  start: string;
  end?: string;
  location?: string;
  logo?: string;
}

export const education: EducationItem[] = [];
