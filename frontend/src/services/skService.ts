import api from "./api"

export const getDosenFromSK = async (no_sk: string) => {
  try {
    const decodedSK = decodeURIComponent(no_sk)
    console.log("Fetching dosen for SK:", decodedSK)

    const response = await api.get(`/sk/${decodedSK}/dosen`)
    return response.data
  } catch (error) {
    console.error("Failed to fetch dosen data:", error)
    throw error
  }
}

export const uploadSKPDF = async (file: File) => {
  const formData = new FormData()
  formData.append("sk", file)

  const response = await api.post(`/sk/upload/sk`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const createDraftSK = async (data: any) => {
  const response = await api.post("/sk", data)
  return response.data
}

export const uploadTTD = async (nip: string, file: File) => {
  const formData = new FormData()
  formData.append("ttd", file)
  const response = await api.post(`/dekan/${nip}/ttd`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

// Modified preview function - now saves the file for drafts
export const previewSK = async (formData: any): Promise<Blob> => {
  try {
    const response = await api.post("/sk/preview", formData, {
      responseType: "blob",
      timeout: 120000, // 2 minutes
    })
    return response.data
  } catch (error: any) {
    console.error("Preview failed:", error)

    // Fallback: try with different approach
    if (error.code === "ECONNABORTED" || error.response?.status === 502) {
      throw new Error("Server sedang sibuk, silakan coba lagi dalam beberapa saat")
    }

    throw error
  }
}

// New function for previewing draft SK using saved file
export const previewDraftSK = async (no_sk: string): Promise<Blob> => {
  const response = await api.get(`/sk/draft/${no_sk.replace(/ /g, "_").replace(/\//g, "_")}/preview`, {
    responseType: "blob",
  })
  return response.data
}

export const publishSK = async (no_sk: string) => {
  return await api.put(`/sk/${no_sk.replace(/ /g, "_").replace(/\//g, "_")}/publish`)
}

export const getPublishedSK = async () => {
  const res = await api.get("/sk/published")
  return res.data
}

export const getDraftSK = async () => {
  const res = await api.get("/sk/draft")
  return res.data
}

export const downloadSK = async (no_sk: string): Promise<Blob> => {
  const res = await api.get(`/sk/${no_sk.replace(/ /g, "_").replace(/\//g, "_")}/download`, { responseType: "blob" })
  return res.data
}

export const previewPublishedSK = async (no_sk: string): Promise<Blob> => {
  const response = await api.get(`/sk/${no_sk.replace(/ /g, "_").replace(/\//g, "_")}/preview`, {
    responseType: "blob",
  })
  return response.data
}

export const deleteDraftSK = async (no_sk: string) => {
  const response = await api.delete(`/sk/draft/${no_sk.replace(/ /g, "_").replace(/\//g, "_")}`)
  return response.data
}

export const getDraftSKDetail = async (no_sk: string) => {
  const response = await api.get(`/sk/draft/${no_sk.replace(/ /g, "_").replace(/\//g, "_")}/detail`)
  return response.data
}

export const updateDraftSK = async (no_sk: string, data: any) => {
  const response = await api.put(`/sk/draft/${no_sk.replace(/ /g, "_").replace(/\//g, "_")}`, data)
  return response.data
}

export const getTTDPreview = (nip: string): string => {
  return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/dekan/${nip}/ttd`
}

export const checkPengajaranExcel = async () => {
  const response = await api.get("/sk/validate/pengajaran")
  return response.data
}

export const checkPembimbingPengujiExcel = async () => {
  const response = await api.get("/sk/validate/pembimbing-penguji")
  return response.data
}

export const checkPembimbingAktifExcel = async () => {
  const response = await api.get("/sk/validate/pembimbing-aktif")
  return response.data
}

export const checkWaliTPBExcel = async () => {
  const response = await api.get("/sk/validate/wali-tpb")
  return response.data
}

export const checkWaliAktifExcel = async () => {
  const response = await api.get("/sk/validate/wali-aktif")
  return response.data
}

export const checkAsistenExcel = async () => {
  const response = await api.get("/sk/validate/asisten")
  return response.data
}

export const archiveSK = async (no_sk: string) => {
  const response = await api.put(`/sk/${encodeURIComponent(no_sk)}/archive`)
  return response.data
}

export const unarchiveSK = async (no_sk: string) => {
  const response = await api.put(`/sk/${encodeURIComponent(no_sk)}/unarchive`)
  return response.data
}

export const getArchivedSK = async () => {
  const res = await api.get("/sk/archived")
  return res.data
}

export const downloadTemplate = async (jenis_sk: string): Promise<Blob> => {
  const res = await api.get(`/sk/template/${jenis_sk.toLowerCase()}/download`, { responseType: "blob" })
  return res.data
}

export const uploadTemplate = async (jenis_sk: string, file: File) => {
  const formData = new FormData()
  formData.append("template", file)
  const response = await api.post(`/sk/template/${jenis_sk.toLowerCase()}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const undoTemplate = async (jenis_sk: string): Promise<Blob> => {
  const res = await api.post(`/sk/template/${jenis_sk.toLowerCase()}/undo`)
  return res.data
}
