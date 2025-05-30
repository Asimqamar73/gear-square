import {
  get_all_users,
  create_users_table,
  create_products_table,
  getAllProducts,
  insertProductToDatabase,
  login,
  searchProduct,
  create_service_table,
  create_service_items_table,
  addService,
  addServiceItems,
  getAllInvoices,
  getServiceItems,
  getServiceDetails,
  addServiceBill,
  getServiceBill,
  searchInvoice,
  createDeductProductQuantityTrigger,
} from "../db/db.js";
import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadath } from "./pathResolver.js";
import fs from "fs";
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 800,
    webPreferences: {
      preload: getPreloadath(),
      webSecurity: false,
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
    try {
      const response = await login({ username: args.username, password: args.password });
      return response;
    } catch (error) {
      console.log("error", error);
    }
  });
  ipcMain.handle("db:getAllUsers", async (ev, args) => {
    return await get_all_users();
  });

  ipcMain.handle("db:getAllProducts", async (ev, args) => {
    return await getAllProducts();
  });

  ipcMain.handle("db:searchProduct", async (ev, args) => {
    return await searchProduct(args);
  });

  ipcMain.handle("db:createUsersTable", async (ev, args) => {
    return await create_users_table();
  });

  ipcMain.handle("db:createServicesTable", async (ev, args) => {
    return await create_service_table();
  });

  ipcMain.handle("db:createServicesItemsTable", async (ev, args) => {
    return await create_service_items_table();
  });
  ipcMain.handle("db:createProductsTable", async (ev, args) => {
    return await create_products_table();
  });
  ipcMain.handle(
    "add-product",
    async (
      event,
      {
        name,
        description,
        basePrice,
        sku,
        barcode,
        quantity,
        productImage,
      }: {
        name: string;
        description: string;
        basePrice: number;
        sku: number;
        barcode: number;
        quantity: number;
        productImage: any;
      }
    ) => {
      try {
        const imageDir = path.join(app.getPath("userData"), "images");
        if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);

        const filePath = path.join(imageDir, Date.now() + "_" + productImage.imageName);
        fs.writeFileSync(filePath, Buffer.from(productImage.buffer));
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

  ipcMain.handle("db:generate-invoice", async (event, args) => {
    try {
      console.log(args);
      const service_id: any = await addService(args.serviceDetails);
      if (service_id) {
        const itemsResponse = await addServiceItems(args.items, service_id);
        const serviceBillResponse = await addServiceBill(args.bill, service_id);

        return { success: true, itemsResponse, serviceBillResponse };
      }

      return { success: true };
    } catch (error) {
      //@ts-ignore
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("db:get-invoices", async (event, args) => {
    try {
      const response = await getAllInvoices();
      return { success: true, response };
    } catch (error) {
      //@ts-ignore
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle("db:invoice-details", async (event, id) => {
    try {
      const service = await getServiceDetails(id);
      if (service) {
        const serviceItems = await getServiceItems(id);
        const serviceBill = await getServiceBill(id);
        return { success: true, service, serviceItems, serviceBill };
      }
    } catch (error) {
      //@ts-ignore
      return { success: false, error: error.message };
    }
  });
});

ipcMain.handle("db:searchInvoice", async (ev, searchInput) => {
  return await searchInvoice(searchInput);
});
