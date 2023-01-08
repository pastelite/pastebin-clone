import { RequestHandler } from "express";
import { readFile, writeFile } from "fs/promises";
import config from "../config";
import { existsSync } from "fs";
import { randomBytes } from "crypto";
import { PrismaClient} from "@prisma/client";

const db = new PrismaClient()

function isError(error: any): error is NodeJS.ErrnoException { return error instanceof Error; }

function generateString(length: number) {
  let text = ""
  for (let i=0;i<Math.floor(length/5);i++) {
    text += Math.random().toString(36).slice(2, 7)
  }
  text += Math.random().toString(36).slice(2, 2+length%5)
  return text
}

export const getFile: RequestHandler = async (req,res,next) => {
  // get id specified in url
  let id = req.params.id

  // get the text
  try {
    let a = await readFile(`./text/${id}.txt`,'utf8')
    res.status(200).json({data:a})
    console.log(a)
  } catch(e) {
    if (isError(e)) {
      let message = null;
      if (e.code == "ENOENT") {
        message = "cannot found said text"
        res.status(404)
      } else {
        res.status(400)
      }
      res.json({message,error:e})
    }
  }
}

interface SaveFileReqBody {
  data?: string,
  url?: string,
  test?: boolean,
  editCode?: string,
}

export const saveFile: RequestHandler = async (req,res,next) => {
  let body: SaveFileReqBody = req.body

  // check input
  if (body.url && body.url.length > config.maxUrl) {
    return res.status(400).json({message:"The url needs to be shorter than "+config.maxUrl+" characters"})
  }

  if (!body.data) {
    return res.status(400).json({message:"Request needs to have data field"})
  }

  if (body.data.length > config.maxText) {
    return res.status(400).json({message:"The text needs to be shorter than "+config.maxText+" characters"})
  }

  // Get url
  let url: string;

  if (body.url) {
    if (existsSync(`./text/${body.url}.txt`)) {
      return res.status(400).json({message:"the url already exists"})
    } else {
      url = body.url
    }
  } else {
    // get url
    do {
      // generate string
      url = generateString(config.genUrl)
      // console.log("generated text:",url)
    } while(existsSync(`./text/${url}.txt`))
  }

  // Generate editcode
  let editCode = body.editCode || generateString(config.genEditCode)

  // Save file
  writeFile(`./text/${url}.txt`,body.data,'utf8')
  let data = await db.codes.create({
    data: {
      url,
      editCode
    }
  })

  return res.status(200).json({message:"successfully write a file",url,editCode})
}