import type { Store } from "./store";

export class Updater {
  static doAction(store: Store, cmd: string, pars: string | null) {
    switch (cmd) {
      case "setcoins":
        if (pars) {
          let coins = parseInt(pars);

          if (isNaN(coins)) {
            console.error("Invalid coins value");
            process.exit(1);
          }
          console.log(`Setting coins to ${coins}`);
          for (let obj of store.getData().objects) {
            if (obj.prefabPath == "Prefabs/Characters/Player") {
              for (let prop of obj.componentData2) {
                if (prop.name == "Wallet") {
                  let data = JSON.parse(prop.data);
                  data.coins = coins;
                  prop.data = JSON.stringify(data);
                  console.log(data);
                }
              }
            }
          }
        }
        store.writeFile();
        console.log("Store updated successfully.");
        break;
      case "setgems":
        if (pars) {
          let gems = parseInt(pars);
          if (isNaN(gems)) {
            console.error("Invalid gems value");
            process.exit(1);
          }
          console.log(`Setting gems to ${gems}`);
          for (let obj of store.getData().objects) {
            if (obj.prefabPath == "Prefabs/Characters/Player") {
              for (let prop of obj.componentData2) {
                if (prop.name == "Wallet") {
                  let data = JSON.parse(prop.data);
                  data.gems = gems;
                  prop.data = JSON.stringify(data);
                  console.log(data);
                }
              }
            }
          }
        }
        store.writeFile();
        console.log("Store updated successfully.");
        break;
      case "invulnerable":
        console.log(`Setting invulnerable`);
        let invulnerablePaths = [
          "Prefabs/Characters/Player",
          "Prefabs/Characters/Archer",
          "Prefabs/Characters/Worker",
          "Prefabs/Characters/Peasant",
          "Prefabs/Characters/norselands/Archer_norselands",
          "Prefabs/Characters/norselands/Peasant_norselands",
          "Prefabs/Characters/norselands/Worker_norselands",
          "Prefabs/Buildings and Interactive/norselands/Wall2_norselands",
          "Prefabs/Buildings and Interactive/norselands/Wall1_norselands",
          "Prefabs/Buildings and Interactive/norselands/Wall3_norselands",
          "Prefabs/Buildings and Interactive/norselands/Wall4_norselands",
          "Prefabs/Buildings and Interactive/norselands/Wall5_norselands",
          "Prefabs/Buildings and Interactive/Wall2",
          "Prefabs/Buildings and Interactive/Wall1",
          "Prefabs/Buildings and Interactive/Wall3",
          "Prefabs/Buildings and Interactive/Wall4",
          "Prefabs/Buildings and Interactive/Wall5",
        ];
        for (let obj of store.getData().objects) {
          if (invulnerablePaths.includes(obj.prefabPath)) {
            console.log("Set invincible to:" + obj.name);
            for (let prop of obj.componentData2) {
              if (prop.name == "Damageable") {
                let data = JSON.parse(prop.data);
                data.hitPoints = 1000;
                data.invulnerable = true;
                prop.data = JSON.stringify(data);
              }
              if (prop.name == "NpcShieldUser") {
                let data = JSON.parse(prop.data);
                data.hasShield = true;
                data.shieldHp = 100;
                prop.data = JSON.stringify(data);
              }
            }
          }
        }
        store.writeFile();
        console.log("Store updated successfully.");

        break;
      case "setportaldef":
        console.log(`Setting portal defense`);
        for (let obj of store.getData().objects) {
          if (obj.prefabPath == "Prefabs/Enemies/Portal" || obj.prefabPath == "Prefabs/Enemies/Cliff Portal" || obj.prefabPath == "Prefabs/Enemies/BeachPortal") {
            for (let prop of obj.componentData2) {
              if (prop.name == "Damageable") {
                let data = JSON.parse(prop.data);
                data.hitPoints = 1;
                data.invulnerable = false;
                prop.data = JSON.stringify(data);
              }
            }
          }
        }
        store.writeFile();
        console.log("Store updated successfully.");
        break;
      case "dump":
        for (let obj of store.getData().objects) {
          if (
            !obj.prefabPath.startsWith("Prefabs/Vegetation") &&
            !obj.prefabPath.startsWith("Prefabs/Buildings") &&
            !obj.prefabPath.startsWith("Prefabs/Environment") &&
            !obj.prefabPath.startsWith("Prefabs/Objects/")
          ) {
            console.log(`Object: ${obj.name}, Prefab: ${obj.prefabPath}, Unique ID: ${obj.uniqueID}`);
            for (let prop of obj.componentData2) {
              console.log(`  Property: ${prop.name}, Value: ${prop.data}`);
            }
          }
          if (obj.prefabPath.startsWith("Prefabs/Buildings")) {
            console.log(`Object: ${obj.name}, Prefab: ${obj.prefabPath}, Unique ID: ${obj.uniqueID}`);
            for (let prop of obj.componentData2) {
              console.log(`  Property: ${prop.name}, Value: ${prop.data}`);
            }
          }
          if (obj.prefabPath.startsWith("Prefabs/Enemies")) {
            //console.log(obj);
          }

          if (obj.prefabPath == "Prefabs/Characters/Player") {
            console.log(`Object: ${obj.name}, Prefab: ${obj.prefabPath}, Unique ID: ${obj.uniqueID}`);
          } else if (
            obj.prefabPath == "Prefabs/Characters/Archer" ||
            obj.prefabPath == "Prefabs/Characters/Worker" ||
            obj.prefabPath == "Prefabs/Characters/norselands/Archer_norselands" ||
            obj.prefabPath == "Prefabs/Characters/norselands/Worker_norselands"
          ) {
            //console.log(obj);
            console.log(`Object: ${obj.name}, Prefab: ${obj.prefabPath}, Unique ID: ${obj.uniqueID}`);
            for (let prop of obj.componentData2) {
              console.log(`  Property: ${prop.name}, Value: ${prop.data}`);
            }
          }
        }
        break;
      case "createarchers_norse":
        console.log(`Creating Archers Norseland`);
        for (let i = 0; i < 10; i++) {
          let id = Math.floor(Math.random() * 1000000);
          store.getData().objects.push({
            name: "Archer_norselands P4 [" + id + "]",
            parentObject: {
              linkedObjectID: "",
            },
            hierarchyPath: "Level/GameLayer/",
            prefabPath: "Prefabs/Characters/norselands/Archer_norselands",
            uniqueID: "Archer_norselands P4 [10]--" + id,
            mode: 0,
            createOrder: 20752,
            linkOrder: 0,
            decayHint: 2,
            decayResistanceDays: 2,
            decayedVersionPrefabPath: "Prefabs/Characters/norselands/Peasant_norselands",
            netID: 1278,
            crpcType: 1,
            localPosition: {
              x: -8.08935546875,
              y: 0.8824997544288635,
              z: 0.7596422433853149,
            },
            localScale: {
              x: -1,
              y: 1,
              z: 1,
            },
            componentData2: [
              {
                name: "Wallet",
                type: "WalletData",
                data: '{"coins":0,"gems":0}',
              },
              {
                name: "Character",
                type: "CharacterData",
                data: '{"isGrabbed":false,"inert":false}',
              },
              {
                name: "NpcShieldUser",
                type: "NpcShieldUserSaveData",
                data: '{"hasShield":false,"shieldHp":0}',
              },
              {
                name: "Damageable",
                type: "DamageableData",
                data: '{"hitPoints":100,"invulnerable":true}',
              },
            ],
          });
        }
        store.writeFile();
        console.log("Store updated successfully.");
        break;
      case "createarchers":
        console.log(`Creating Archers`);
        for (let i = 0; i < 10; i++) {
          let id = Math.floor(Math.random() * 1000000);
          store.getData().objects.push({
            name: "Archer_norselands P4 [" + id + "]",
            parentObject: {
              linkedObjectID: "",
            },
            hierarchyPath: "Level/GameLayer/",
            prefabPath: "Prefabs/Characters/Archer",
            uniqueID: "Archer P4 [10]--" + id,
            mode: 0,
            createOrder: 20752,
            linkOrder: 0,
            decayHint: 2,
            decayResistanceDays: 2,
            decayedVersionPrefabPath: "Prefabs/Characters/Peasant",
            netID: 1278,
            crpcType: 1,
            localPosition: {
              x: -8.08935546875,
              y: 0.8824997544288635,
              z: 0.7596422433853149,
            },
            localScale: {
              x: -1,
              y: 1,
              z: 1,
            },
            componentData2: [
              {
                name: "Wallet",
                type: "WalletData",
                data: '{"coins":0,"gems":0}',
              },
              {
                name: "Character",
                type: "CharacterData",
                data: '{"isGrabbed":false,"inert":false}',
              },
              {
                name: "NpcShieldUser",
                type: "NpcShieldUserSaveData",
                data: '{"hasShield":false,"shieldHp":0}',
              },
              {
                name: "Damageable",
                type: "DamageableData",
                data: '{"hitPoints":100,"invulnerable":true}',
              },
            ],
          });
        }
        store.writeFile();
        console.log("Store updated successfully.");
        break;
      case "createworkers":
        console.log(`Creating Workers`);
        for (let i = 0; i < 10; i++) {
          let id = Math.floor(Math.random() * 1000000);
          store.getData().objects.push({
            name: "Archer_norselands P4 [" + id + "]",
            parentObject: {
              linkedObjectID: "",
            },
            hierarchyPath: "Level/GameLayer/",
            prefabPath: "Prefabs/Characters/Worker",
            uniqueID: "Archer P4 [10]--" + id,
            mode: 0,
            createOrder: 20752,
            linkOrder: 0,
            decayHint: 2,
            decayResistanceDays: 2,
            decayedVersionPrefabPath: "Prefabs/Characters/Peasant",
            netID: 1278,
            crpcType: 1,
            localPosition: {
              x: -8.08935546875,
              y: 0.8824997544288635,
              z: 0.7596422433853149,
            },
            localScale: {
              x: -1,
              y: 1,
              z: 1,
            },
            componentData2: [
              {
                name: "Wallet",
                type: "WalletData",
                data: '{"coins":0,"gems":0}',
              },
              {
                name: "Character",
                type: "CharacterData",
                data: '{"isGrabbed":false,"inert":false}',
              },
              {
                name: "NpcShieldUser",
                type: "NpcShieldUserSaveData",
                data: '{"hasShield":false,"shieldHp":0}',
              },
              {
                name: "Damageable",
                type: "DamageableData",
                data: '{"hitPoints":100,"invulnerable":true}',
              },
            ],
          });
        }
        store.writeFile();
        console.log("Store updated successfully.");
        break;
    }
  }
}
