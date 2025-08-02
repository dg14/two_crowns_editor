import { render } from "ink";
import meow from "meow";
import App from "./app_single.tsx";

import "./yoga.wasm" with { type: "file", embed: "true" };

const cli = meow(
  `
		Usage
		  $ two_cronws_editor

		Environment Variables
		  $ STORES_DIR=/path/to/stores
		  directory where the saves are stored

	`,
  {
    importMeta: import.meta,
  }
);
let l = render(<App />);
