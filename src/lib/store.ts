import { copyFileSync, readFileSync, writeFileSync } from "fs";
export interface StoreData {
  biome: number;
  land: number;
  lastPlayedReign: number;
  lastPlayedTimeDays: number;
  objects: BlenderRecord[];
  playTimeDays: number;
  repopGrassHack: boolean;
  savedWithRevisions: number[];
}
export interface ComponentData2 {
  data: string;
  name: string;
  type: string;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface ParentObject {
  linkedObjectID: string;
}

export interface BlenderRecord {
  componentData2: ComponentData2[];
  createOrder: number;
  crpcType: number;
  decayHint: number;
  decayResistanceDays: number;
  decayedVersionPrefabPath: string;
  hierarchyPath: string;
  linkOrder: number;
  localPosition: Vector3;
  localScale: Vector3;
  mode: number;
  name: string;
  netID: number;
  parentObject: ParentObject;
  prefabPath: string;
  uniqueID: string;
}
export class Store {
  private static instance: Store;
  private data: StoreData;
  private file: string | null = null;
  public constructor() {
    this.data = {
      biome: 0,
      land: 0,
      lastPlayedReign: 0,
      lastPlayedTimeDays: 0,
      objects: [],
      playTimeDays: 0,
      repopGrassHack: false,
      savedWithRevisions: [],
    };
  }

  public static getInstance(): Store {
    if (!Store.instance) {
      Store.instance = new Store();
    }
    return Store.instance;
  }

  public getData(): StoreData {
    return this.data;
  }

  public setData(data: Partial<StoreData>): void {
    this.data = { ...this.data, ...data };
  }
  public loadFile(filePath: string): void {
    this.file = filePath;
    try {
      const fileData = JSON.parse(readFileSync(filePath).toString());
      this.setData(fileData);
    } catch (error) {
      try {
        const fileData = JSON.parse(Buffer.from(Bun.gunzipSync(readFileSync(filePath))).toString());
        this.setData(fileData);
      } catch (error) {
        console.error("Failed to load file:", error);
        this.file = null;
      }
    }
  }
  public writeFile() {
    if (this.file) {
      copyFileSync(this.file, this.file + ".bak." + new Date().toISOString().replace(/[:.]/g, "-"));
      writeFileSync(this.file!, Bun.gzipSync(JSON.stringify(this.data)));
    }
  }
}
