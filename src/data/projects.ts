export interface Project {
  slug: string;
  title: string;
  blurb: string;
  role?: string;
  hero?: string;
  featured?: boolean;
  links?: { href: string; label: string }[];
}

export const projects: Project[] = [];
