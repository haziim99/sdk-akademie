    // user.model.ts
    export interface Course {
      videoUrl:string;
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
      level?: 'beginner' | 'intermediate' | 'advanced';
    }


    export interface User {
      address: string; // اجعل هذا الحقل مطلوبًا
      dob: null // تعيين dob إلى null بدلاً من undefined
      id: string; // Ensure `id` is required
      name: string;
      email: string;
      phone?: string; // Make `phone` optional if it can be undefined
      profilePicture?: string | null; // تغيير هنا
      courses?: Course[];
      password?: string; // Include if necessary; otherwise, omit it
      gender: 'male' | 'female';
      level?: 'beginner' | 'intermediate' | 'advanced';
      role: 'user' | 'admin';
    }


    export interface Video {
      title: string;
      url: string;
    }

    export interface UploadResponse {
      secure_url: string;
    }

