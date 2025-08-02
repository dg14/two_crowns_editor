import React, { useState } from "react";
import { Box, Text } from "ink";
import Menu from "./menu.tsx";
import NumberInput from "./number.tsx";
import { config } from "dotenv";
import { Multistore } from "./lib/multistore.ts";
import { Updater } from "./lib/updater.ts";
import { Store } from "./lib/store.ts";

config();

let stores_dir = process.env.STORES_DIR || "./saves";
if (!stores_dir) {
  console.error("STORES_DIR environment variable is not set.");
  process.exit(1);
}
let input = process.argv[2];
let mainMenu: any[] = [];
mainMenu.push({
  id: "Last saved file",
  label: `Last saved file: ${input}`,
});

let operationsMenu: any[] = [
  {
    id: "quit",
    label: "quit",
  },

  {
    id: "setcoins_number",
    label: "Set coins",
  },
  {
    id: "setgems_number",
    label: "Set gems",
  },
  {
    id: "invulnerable",
    label: "Set invincible mode",
  },
  {
    id: "dump",
    label: "Set portal def",
  },
  {
    id: "setportaldef",
    label: "Set portal defence easy to defeat",
  },
  {
    id: "createarchers",
    label: "create archers",
  },
  {
    id: "createarchers_norse",
    label: "create norseland archers",
  },
  {
    id: "createworkers",
    label: "create workers",
  },
];
type AppState = "main" | "island" | "operation" | "entering_number";

type InputTarget = "volume" | "brightness" | null;
let store: Store = new Store(),
  operation: string | null = null;

store.loadFile(input, false);
const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("main");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [inputTarget, setInputTarget] = useState<InputTarget>(null);
  const [numericValue, setNumericValue] = useState<number | null>(null);

  const handleMainMenuSelect = (item: { id: string; label: string }) => {
    if (item.id == "Last saved file") {
      store.loadFile(input);
      setAppState("operation");
      return;
    } else if (item.id === "exit") {
      process.exit(0);
    }
  };

  // Gestione della selezione dai sottomenu (frutta, verdura)
  const handleOperationsSelect = (item: { id: string; label: string }) => {
    if (item.id === "back") {
      setAppState("main");
      setSelectedLabel(null);
    } else if (item.id === "quit") {
      process.exit(0);
    } else {
      operation = item.id;
      setSelectedLabel(item.label);
      if (item.id.endsWith("_number")) {
        setAppState("entering_number");
      } else {
        Updater.doAction(store, operation!, null, false);
        setSelectedLabel(`You have done ${operation}`);
      }
    }
  };

  const handleNumberConfirm = (value: number) => {
    setNumericValue(value);
    Updater.doAction(store, operation!.replace("_number", ""), value!.toString(), false);
    setSelectedLabel(`${operation}: You have set value: ${value}`);
    setAppState("operation");
  };

  const handleNumberCancel = () => {
    setAppState("operation");
    setNumericValue(null);
  };

  return (
    <Box flexDirection="column" padding={1}>
      {appState === "main" && <Menu title="Choose a campaign:" items={mainMenu} onSelect={handleMainMenuSelect} />}

      {appState === "operation" && <Menu title="Choose a operation:" items={operationsMenu} onSelect={handleOperationsSelect} />}

      {appState === "entering_number" && <NumberInput prompt={`Input value for ${inputTarget}:`} onConfirm={handleNumberConfirm} onCancel={handleNumberCancel} />}

      <Text>{selectedLabel}</Text>
    </Box>
  );
};

export default App;
