import { readdirSync, fstatSync, statSync } from "fs";
import { Store } from "./store";
export class Multistore {
  private campaigns: Record<string, Record<number, Store>> = {};
  private lastFile: string | null = null;
  constructor(baseDir: string) {
    let files = readdirSync(baseDir, { withFileTypes: true });
    let lastDate: Date | null = null;
    let regexp = new RegExp(/^island-v(\d+)-c(\d+)-l(\d+)$/);
    for (let file of files) {
      if (file.isFile() && regexp.test(file.name)) {
        let stats = statSync(`${baseDir}/${file.name}`);
        if (lastDate === null || stats.mtime > lastDate) {
          this.lastFile = file.name;
          lastDate = stats.mtime;
        }
        let v = this.parseFileName(file.name);
        if (v) {
          let version = v.version;
          let campaign = v.campaign;
          let level = v.level;
          if (!this.campaigns[campaign]) {
            this.campaigns[campaign] = {};
          }
          this.campaigns[campaign][level] = new Store();
          this.campaigns[campaign][level].loadFile(`${baseDir}/${file.name}`);
        }
      }
    }
  }
  getLastFile() {
    return this.lastFile;
  }
  getCampaigns() {
    return Object.keys(this.campaigns);
  }
  getCampaignIslands(campaign: number) {
    return Object.keys(this.campaigns[campaign]!);
  }
  getCampaignIslandStore(campaign: number, island: number): Store | undefined {
    return this.campaigns[campaign]?.[island];
  }

  parseFileName(name: string): { version: number; campaign: number; level: number } | null {
    let regexp = new RegExp(/^island-v(\d+)-c(\d+)-l(\d+)$/);
    let match: any[] = name.match(regexp)!;
    if (match) {
      let version = parseInt(match[1]);
      let campaign = parseInt(match[2]);
      let level = parseInt(match[3]);
      return {
        version: version,
        campaign: campaign,
        level: level,
      };
    } else {
      return null;
    }
  }
}
