import { PodioErrorIO } from "./error.d.ts";

export class PodioError extends Error {
  status: number;
  error_description?: string;
  request?: Object;
  type?: string;
  message: string;

  constructor(textError: string, status: number, e: PodioErrorIO) {
    super(
      `API Error: [${status} ${textError}] ${e.error_description}`,
    );

    this.name = `podio_error:${status}:${e.error}`;
    this.message = e.error_description;
    this.status = status;
    this.request = e.request;
    this.error_description = e.error_description;
  }

  json() {
    return {
      message: this.message,
      status: this.status,
      description: this.error_description,
      type: this.type,
    };
  }

  toString() {
    return `API Error: ${this.message}`;
  }
}
