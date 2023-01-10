import { Component, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLoaderData, useLocation } from "react-router-dom";

export function ShowPage() {
  let data: any = useLoaderData();
  let b = useLocation();

  console.log(JSON.stringify(b));

  return (
    <>
      {b.state?.notice && <div>{b.state.notice}</div>}
      <div className="bg-red-400 m-2 flex-grow">
        {data.data ? (
          <div dangerouslySetInnerHTML={{ __html: data.data }} />
        ) : (
          "Not Found"
        )}
      </div>
    </>
  );
}