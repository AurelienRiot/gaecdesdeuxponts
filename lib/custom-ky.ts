import ky, { HTTPError, type Options } from "ky";
import { z, type ZodSchema } from "zod";

export const defaultSchema = z.object({ message: z.string() });

async function customKy<T>(
  url: string,
  method: `GET` | `POST` | `PUT` | `PATCH` | `DELETE`,
  schema: ZodSchema<T>,
  options?: Omit<Options, "method">,
): Promise<T> {
  try {
    const response = await ky(url, { method, ...options });

    const jsonData = await response.json();

    // Validate the response data using the provided zod schema
    const data = schema.parse(jsonData);

    return data;
  } catch (error) {
    if (error instanceof HTTPError) {
      // Handle HTTP errors (status codes outside the 2xx range)
      const errorData = await error.response.text();
      console.error("HTTP Error:", errorData);
      throw new Error(errorData);
    }
    if (error instanceof Error) {
      // Handle validation errors or other errors
      console.error("Error:", error.message);
      throw error;
    }
    // Handle any other unknown errors
    console.error("Unknown Error:", error);
    throw new Error("Erreur inconnue");
  }
}

export async function streamKy<T>(
  url: string,
  method: `GET` | `POST` | `PUT` | `PATCH` | `DELETE`,
  onResult: (result: T) => void,
  onError: (error: unknown) => void,
  options?: Omit<Options, "method">,
): Promise<void> {
  try {
    const response = await ky(url, { method, ...options });

    if (!response?.body) {
      throw new Error("No response body received");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim() === "") continue;
        const result = JSON.parse(line) as T;
        onResult(result);
      }
    }

    if (buffer.trim() !== "") {
      const result = JSON.parse(buffer) as T;
      onResult(result);
    }
  } catch (error) {
    onError(error);
  }
}

export default customKy;
