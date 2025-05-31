import * as React from "react";
import { useRoutes } from "react-router-dom";
import DJSCodes from '../pages/DJSCodes'
import AOICodes from "../pages/AOICodes";
import CodeEkle from "../pages/CodeEkle";
import Anasayfa from "../pages/Anasayfa";
import Codes from "../pages/Codes";
import BDFDCodes from "../pages/BDFDCodes";
import Code from "../pages/Code";
import Kodlarım from "../pages/Kodlarım";
import NotFound from "../pages/NotFound";

function Routes() {
  let element = useRoutes([
    { path: "/", element: <Anasayfa /> },
    { path: "/aoicodes", element: <AOICodes /> },
    { path: "/djscodes", element: <DJSCodes /> },
    { path: "/bdfdcodes", element: <BDFDCodes /> },
    { path: "/codes", element: <Codes /> },
    { path: "/user/kodekle", element: <CodeEkle /> },
    { path: "*", element: <NotFound /> },
    { path: "/codes/:id", element: <Code />},
    { path: "/user/kodlarım", element: <Kodlarım />}
  ]);

  return element;
}
export default Routes