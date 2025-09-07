// src/app/services/course.model.ts
export interface Course {
  id: string;
  title: string;
  url?:string;
  category: string;
  description: string;
  duration: string;
  startDate: string;
  price: number;
  instructor: string;
  imageUrl: string;
  imageFile?: File | null;
  videos: { title: string; url: string }[];
  videoUrl: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}



export interface Lecture {
  title: string;
  url: string;
}

export interface CourseLectures {
  courseTitle: string;
  lectures: Lecture[];
}

export interface Instructor {
  name: string;
  picture: string;
  position: string;
  bio: string;
  specialties: string[];
}
