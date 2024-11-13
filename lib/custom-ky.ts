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

export default customKy;
