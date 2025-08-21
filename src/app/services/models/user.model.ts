export interface Video {
  title: string;
  url: string;
}

export interface Course {
  videoUrl: string;
  id: string;
  title: string;
  url?: string;
  category: string;
  description: string;
  duration: string;
  startDate: string;
  price: number;
  instructor: string;
  imageUrl: string;
  imageFile?: File | null;
  videos: Video[];
  level?: 'beginner' | 'intermediate' | 'advanced';
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  gender: 'male' | 'female';
  role: 'user' | 'admin';
  dob: string | null;
  level?: 'beginner' | 'intermediate' | 'advanced';
  profilePicture?: string | null;
  courses?: Course[];
  password?: string;
}

export interface UploadResponse {
  secure_url: string;
}
