/// <reference types="node" />

import { Request } from "express"
import { Codes } from "@prisma/client"

declare global {
  namespace Express {
    export interface Request {
      codes?: Codes
    }
  }
}