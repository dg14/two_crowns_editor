import { Multistore } from "./lib/multistore";
import { Store } from "./lib/store";
import { Updater } from "./lib/updater";

const multistore = new Multistore("./saves"); // Adjust the path as needed
const updater = new Updater();

let c = process.argv[2];
let v = process.argv[3];
let cmd = process.argv[4];
let pars = process.argv[5];

if (c && v) {
  let store = multistore.getCampaignIslandStore(parseInt(c), parseInt(v));
  //console.log(store.getData());
  console.log(`Campaign: ${c}, Island: ${v}`);

  if (store) {
    Updater.doAction(store, cmd!, pars!);
  } else {
    console.error(`No store found for campaign ${c} and island ${v}`);
  }
} else {
  let input = process.argv[2];
  let cmd = process.argv[3];
  let pars = process.argv[4];
  let store = new Store();
  store.loadFile(input);
  Updater.doAction(store, cmd!, pars!);
}
