// src/app/services/course.model.ts
export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  duration: string;
  startDate: string;
  price: number;
  instructor: string;
  imageUrl: string;
  imageFile?: File | null; // إضافة هذا السطر لتخزين ملف الصورة
  videos: { title: string; url: string }[];
  level?: 'beginner' | 'intermediate' | 'advanced'; // إضافة مستوى الفئة
}


export interface Lecture {
  title: string;
  url: string;
}

export interface CourseLectures {
  courseTitle: string;
  lectures: Lecture[];
}
