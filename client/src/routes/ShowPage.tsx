import { Component, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLoaderData, useLocation } from "react-router-dom";
import { Editable, Slate } from "slate-react";
import { Editor } from "../components/Editor";

export function ShowPage() {
  let data: any = useLoaderData();
  let b = useLocation();

  console.log(JSON.stringify(b));

  return (
    <>
      {b.state?.notice && <div>{b.state.notice}</div>}
      <Editor value={data.data || notFoundMessage} readOnly />
    </>
  );
}

const notFoundMessage = [
  {
    type: "header",
    level: 1,
    children: [{ text: "Not found" }],
  },
  {
    type: "paragraph",
    children: [{ text: "please makes sure URL is correct" }],
  },
];
