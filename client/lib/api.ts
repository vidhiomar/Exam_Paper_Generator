const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function parseResponse(res: Response) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "detail" in data
        ? String(data.detail)
        : "Request failed";

    throw new Error(message);
  }

  return data;
}

export async function uploadPDF(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/upload/`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(res);
}

export async function generatePaper(blueprint: any) {
  const res = await fetch(`${BASE_URL}/generate/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ blueprint }),
  });

  return parseResponse(res);
}
