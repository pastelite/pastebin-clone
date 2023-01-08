import { Component, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLoaderData, useLocation } from "react-router-dom";

interface ShowTextProps {
  //extends HTMLAttributes<HTMLDivElement>
  children?: ReactNode;
  notice?: String;
}

export function ShowText(props: ShowTextProps) {
  // let [data, setData] = useState("")
  let data: any = useLoaderData();
  let b = useLocation();

  // useEffect(()=>{
  //   setData(e=>(link||""));
  //   // axios.get('/api/')
  // },[])

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

// export class ShowText extends Component<{data: string},{data: string}>{
//   constructor(props:{data: string}) {
//     super(props);
//     this.state = {
//       data: ""
//     }
//   }

//   render(): ReactNode {
//       return <div className="bg-red-400 m-2 flex-grow">
//         {this.props.data}
//       </div>
//   }
// }
