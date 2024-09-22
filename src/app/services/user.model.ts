    // user.model.ts
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


    export interface User {
      id: string; // Ensure `id` is required
      name: string;
      email: string;
      phone?: string; // Make `phone` optional if it can be undefined
      profilePicture?: string | null; // تغيير هنا
      courses?: Course[];
      password?: string; // Include if necessary; otherwise, omit it
      gender: 'male' | 'female'; // إضافة حقل الجنس
      level?: 'beginner' | 'intermediate' | 'advanced'; // إضافة مستوى الفئة
      role: 'user' | 'admin'; // إضافة خاصية role

    }



    export interface Video {
      title: string;
      url: string;
    }
