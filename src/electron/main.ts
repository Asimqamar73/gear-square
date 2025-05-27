import {
  get_all_users,
  create_users_table,
  create_products_table,
  getAllProducts,
  insertProductToDatabase,
  login,
  searchProduct,
} from "../db/db.js";
import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { getPreloadath } from "./pathResolver.js";
import fs from "fs";
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 800,
    webPreferences: {
      preload: getPreloadath(),
      webSecurity:false
    },
  });
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123/");
  } else {
    mainWindow.maximize();
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
  // pollResources(mainWindow);
  // ipcMain.handle("getStaticData",()=>{
  //   return getStaticData ()
  // })
  ipcMain.handle("db:login", async (ev, args) => {
    console.log("args: ",args)
    return await login({ username: args.username, password: args.password });
  });
  ipcMain.handle("db:getAllUsers", async (ev, args) => {
    return await get_all_users();
  });

  ipcMain.handle("db:getAllProducts", async (ev, args) => {
    return await getAllProducts();
  });

  ipcMain.handle("db:searchProduct", async (ev, args) => {
    console.log(args)
    return await searchProduct(args);
  });

  ipcMain.handle("db:createUsersTable", async (ev, args) => {
    return await create_users_table();
  });
  ipcMain.handle("db:createProductsTable", async (ev, args) => {
    return await create_products_table();
  });
  ipcMain.handle(
    "add-product",
    async (event, { name, description, basePrice, sku, barcode, quantity, productImage }) => {
      try {
        const imageDir = path.join(app.getPath("userData"), "images");
        if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);

        console.log(productImage);
        const filePath = path.join(imageDir, Date.now() + "_" + productImage.imageName);
        fs.writeFileSync(filePath, Buffer.from(productImage.buffer));
        console.log(filePath);

        // Save to SQLite
        const response = await insertProductToDatabase({
          name,
          description,
          basePrice,
          sku,
          barcode,
          quantity,
          filePath,
        });

        return { success: true, path: filePath, response };
      } catch (error) {
        //@ts-ignore
        return { success: false, error: error.message };
      }
    }
  );
});
