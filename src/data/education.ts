export interface EducationItem {
  school: string;
  degree: string;
  start: string;
  end?: string;
  location?: string;
  logo?: string;
}

export const education: EducationItem[] = [
  {
    school: "Harvard University",
    degree: "MS, Data Science (incoming)",
    start: "2026-09",
    location: "Cambridge, MA",
  },
];
