import React, { useState } from "react";
import { Box, Text } from "ink";
import Menu from "./menu.tsx";
import NumberInput from "./number.tsx";
import { config } from "dotenv";
import { Multistore } from "./lib/multistore.ts";
import { Updater } from "./lib/updater.ts";

config();

let stores_dir = process.env.STORES_DIR || "./saves";
if (!stores_dir) {
  console.error("STORES_DIR environment variable is not set.");
  process.exit(1);
}
const multistore = new Multistore(stores_dir);

let mainMenu: any[] = [];
if (multistore.getLastFile()) {
  mainMenu.push({
    id: "Last saved file",
    label: `Last saved file: ${multistore.getLastFile()}`,
  });
}
const campaigns = multistore.getCampaigns();
for (let campaign of campaigns) {
  mainMenu.push({
    id: `Campaign ${campaign}`,
    label: `Campaign ${campaign} with ${multistore.getCampaignIslands(parseInt(campaign)).length} islands`,
  });
}

let islandMenu: any[] = [];
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
let campaign: number | null = null,
  island: number | null = null,
  operation: string | null = null;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>("main");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [inputTarget, setInputTarget] = useState<InputTarget>(null);
  const [numericValue, setNumericValue] = useState<number | null>(null);

  const handleMainMenuSelect = (item: { id: string; label: string }) => {
    if (item.id == "Last saved file") {
      const lastFile = multistore.getLastFile();
      let p = multistore.parseFileName(lastFile!);
      if (p) {
        campaign = p.campaign;
        island = p.level;
      } else {
        campaign = null;
        island = null;
        setAppState("main");
      }

      if (lastFile) {
        setSelectedLabel(`Last file saved: ${lastFile}`);
        setAppState("operation");
      }
      return;
    } else if (item.id === "exit") {
      process.exit(0);
    } else if (item.id.startsWith("Campaign ")) {
      campaign = parseInt(item.id.split(" ")[1]);
      const islands = multistore.getCampaignIslands(campaign);
      if (islands.length > 0) {
        islandMenu = islands.map((island) => ({
          id: `island_${island}`,
          label: `Island ${island} of Campaign ${campaign}`,
        }));
        islandMenu.push({ id: "back", label: "Back to main menu" });
        setAppState("island");
      } else {
        setSelectedLabel(`No island found for campaign ${campaign}`);
        setAppState("main");
      }
      return;
    }
  };

  // Gestione della selezione dai sottomenu (frutta, verdura)
  const handleIslandSelect = (item: { id: string; label: string }) => {
    if (item.id === "back") {
      setAppState("main");
      setSelectedLabel(null);
    } else {
      island = parseInt(item.id.split("_")[1]);
      setSelectedLabel(item.label);
      setAppState("operation");
    }
  };
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
        Updater.doAction(multistore.getCampaignIslandStore(campaign!, island!)!, operation!, null);
        setSelectedLabel(`You have done ${operation}`);
      }
    }
  };

  const handleNumberConfirm = (value: number) => {
    setNumericValue(value);
    Updater.doAction(multistore.getCampaignIslandStore(campaign!, island!)!, operation!.replace("_number", ""), value!.toString());
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

      {appState === "island" && <Menu title="Choose a island:" items={islandMenu} onSelect={handleIslandSelect} />}

      {appState === "operation" && <Menu title="Choose a operation:" items={operationsMenu} onSelect={handleOperationsSelect} />}

      {appState === "entering_number" && <NumberInput prompt={`Input value for ${inputTarget}:`} onConfirm={handleNumberConfirm} onCancel={handleNumberCancel} />}

      <Text>
        {campaign}/{island}:{selectedLabel}
      </Text>
    </Box>
  );
};

export default App;
