import api from "./api";

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

export const previewSK = async (no_sk: string): Promise<Blob> => {
    const response = await api.get(`/sk/${no_sk}/preview`, { responseType: "blob" });
    return response.data;
};

export const publishSK = async (no_sk: string) => {
    return await api.put(`/sk/${no_sk}/publish`);
};