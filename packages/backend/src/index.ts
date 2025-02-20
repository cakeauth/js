import { z } from "zod";
import { httpErrorResponse } from "./api/index.js";
export { ClientOptions } from "./http.js";
export { CakeAuth } from "./client.js";

export type CakeAuthErrorResponse = z.infer<typeof httpErrorResponse>;
