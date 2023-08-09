import React from "react";
import {createRoot} from "react-dom/client";

import {Playground} from './game/Playground';

const rootElement: HTMLElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(<Playground />)
