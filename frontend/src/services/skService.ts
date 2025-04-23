import api from "./api";

export const uploadSKPDF = async (file: File) => {
    const formData = new FormData();
    formData.append("sk", file);
  
    const response = await api.post(`/sk/upload/sk`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };
  

export const createDraftSK = async (data: any) => {
    const response = await api.post("/sk", data);
    return response.data;
};

export const uploadTTD = async (nip: string, file: File) => {
    const formData = new FormData();
    formData.append("ttd", file);
    const response = await api.post(`/dekan/${nip}/ttd`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const previewSK = async (formData: any): Promise<Blob> => {
    const response = await api.post("/sk/preview", formData, {
        responseType: "blob",
    });
    return response.data;
};

export const publishSK = async (no_sk: string) => {
    return await api.put(`/sk/${no_sk}/publish`);
};

export const getPublishedSK = async () => {
    const res = await api.get("/sk/published");
    return res.data;
};

export const getDraftSK = async () => {
    const res = await api.get("/sk/draft");
    return res.data;
};

export const downloadSK = async (no_sk: string): Promise<Blob> => {
    const res = await api.get(`/sk/${no_sk}/download`, { responseType: "blob" });
    return res.data;
};

export const deleteDraftSK = async (no_sk: string) => {
    const response = await api.delete(`/sk/draft/${no_sk}`);
    return response.data;
};