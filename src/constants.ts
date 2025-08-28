// src/constants.ts

export interface Project {
  title: string;
  image: string;
  shortContent: string;
  description: string;
  links: { [iconClass: string]: string | undefined };
  stack: string[];
  status: string;
  category: string;
  featured: boolean;
}

export const projects: Project[] = [
  
];
