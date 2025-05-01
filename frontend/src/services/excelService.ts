import api from "./api";

// Interface untuk status upload
interface UploadStatus {
  templateType: string;
  uploaded: boolean;
  processed: boolean;
  uploadedAt: string | null;
  processedAt: string | null;
  filePath: string | null;
}

// Interface untuk response API
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  counts?: any;
  error?: string;
}

// Service untuk operasi Excel
const excelService = {
  // Upload file Excel untuk Admin Prodi
  uploadProdiExcel: async (file: File, templateType: string): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("templateType", templateType);

      const response = await api.post("/excel/upload/prodi", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Terjadi kesalahan saat mengunggah file",
        error: error.message,
      };
    }
  },

  // Upload file Excel untuk Akademik
  uploadAkademikExcel: async (file: File, templateType: string): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("templateType", templateType);

      const response = await api.post("/excel/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Terjadi kesalahan saat mengunggah file",
        error: error.message,
      };
    }
  },

  // Mendapatkan status upload
  getUploadStatus: async (): Promise<ApiResponse<UploadStatus[]>> => {
    try {
      const response = await api.get("/excel/status");
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Terjadi kesalahan saat mengambil status upload",
        error: error.message,
      };
    }
  },

  // Reset status upload
  resetUploadStatus: async (templateType?: string): Promise<ApiResponse<any>> => {
    try {
      const url = templateType 
        ? `/excel/reset-status/${templateType}` 
        : "/excel/reset-status";
      
      const response = await api.post(url);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Terjadi kesalahan saat mereset status upload",
        error: error.message,
      };
    }
  },

  // Mendapatkan daftar template yang tersedia
  getTemplates: async (): Promise<ApiResponse<{id: string, name: string}[]>> => {
    try {
      const response = await api.get("/excel/templates");
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      return {
        success: false,
        message: "Terjadi kesalahan saat mengambil daftar template",
        error: error.message,
      };
    }
  }
};

export default excelService;