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

export const uploadExcelPengajaran = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/excel/upload/pengajaran", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error uploading Pengajaran file:", error);
    throw error.response?.data || { message: "Gagal mengunggah file Excel Pengajaran" };
  }
};

export const uploadExcelPembimbingPenguji = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/excel/upload/pembimbing-penguji", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error uploading Pembimbing Penguji file:", error);
    throw error.response?.data || { message: "Gagal mengunggah file Excel Pembimbing Penguji" };
  }
};

export const uploadExcelDosenWali = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/excel/upload/dosen-wali", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error uploading Dosen Wali file:", error);
    throw error.response?.data || { message: "Gagal mengunggah file Excel Dosen Wali" };
  }
};

export const uploadExcelAsisten = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/excel/upload/asisten", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error uploading Asisten file:", error);
    throw error.response?.data || { message: "Gagal mengunggah file Excel Asisten Perkuliahan dan Praktikum" };
  }
};

export const uploadExcelDosbingAktif = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/excel/upload/pembimbing-aktif", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error uploading Dosen Pembimbing Aktif file:", error);
    throw error.response?.data || { message: "Gagal mengunggah file Excel Dosen Pembimbing Aktif" };
  }
};

// Tambahkan fungsi untuk get upload history
export const getUploadHistory = async (jenis: string) => {
  try {
    const response = await api.get(`/excel/upload-history/${jenis}`);
    return response.data;
  } catch (error: any) {
    console.error("Error getting upload history:", error);
    throw error.response?.data || { message: "Gagal mengambil riwayat upload" };
  }
};

// Tambahkan fungsi untuk download file
export const downloadUploadedFile = async (jenis: string, filename: string) => {
  try {
    const response = await api.get(`/excel/download/${jenis}/${filename}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    return { success: true, message: "File berhasil didownload" };
  } catch (error: any) {
    console.error("Error downloading file:", error);
    throw error.response?.data || { message: "Gagal mendownload file" };
  }
};

export default excelService;