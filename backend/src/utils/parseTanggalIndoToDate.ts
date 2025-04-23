const bulanMap: Record<string, string> = {
    Januari: "01",
    Februari: "02",
    Maret: "03",
    April: "04",
    Mei: "05",
    Juni: "06",
    Juli: "07",
    Agustus: "08",
    September: "09",
    Oktober: "10",
    November: "11",
    Desember: "12",
  };
  
  export function parseTanggalIndoToDate(str: string): Date | null {
    const match = str.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
    if (!match) return null;
  
    const [, day, bulanStr, year] = match;
    const bulan = bulanMap[bulanStr];
    if (!bulan) return null;
  
    const isoDateStr = `${year}-${bulan}-${day.padStart(2, "0")}T00:00:00.000Z`;
    const date = new Date(isoDateStr);
    return isNaN(date.getTime()) ? null : date;
  }
  