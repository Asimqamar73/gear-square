import { createDeductProductQuantityTrigger } from "../assets/db/triggers/triggers.js";
import { dailyDueAmount, dailyProfit, last7DaysDueAmount, last7DaysProfit, last7DaysServicesCount, todayServicesCount } from "../assets/db/tables/dashboard.js";
import {
  addCustomerToDB,
  create_customers_table,
  deleteCustomerById,
  getAllCustomers,
  getCustomerById,
  searchCustomerByPhoneNumber,
  updateCustomerDetailsById,
} from "../assets/db/tables/customers.js";
import {
  create_products_table,
  getAllProducts,
  getproductById,
  insertProductToDatabase,
  searchProduct,
  updateProductDetails,
  updateProductStock,
} from "../assets/db/tables/products.js";
import {
  addServiceItems,
  create_service_items_table,
  getServiceItems,
} from "../assets/db/tables/serviceItems.js";
import {
  addService,
  create_service_table,
  getAllInvoices,
  getServiceDetails,
  getServicesById,
  searchInvoice,
} from "../assets/db/tables/services.js";
import { get_all_users, login, create_users_table } from "../assets/db/tables/users.js";
import {
  addServiceBill,
  create_service_bill_table,
  getServiceBill,
  UpdateServiceBillPayment,
} from "../assets/db/tables/serviceBill.js";
import { BrowserWindow, app, ipcMain } from "electron";
import path from "path";
import { isDev } from "./util.js";
import { getPreloadath } from "./pathResolver.js";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 800,
    icon: path.join(__dirname, "assets/mac-icon.icns"),
    webPreferences: {
      preload: getPreloadath(),
      webSecurity: false,
    },
  });
  create_users_table();
  create_customers_table();
  create_products_table();
  create_service_table();
  create_service_items_table();
  create_service_bill_table();
  createDeductProductQuantityTrigger();

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123/");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }
  mainWindow.maximize();

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

  ipcMain.handle("db:get-product-by-id", async (ev, id) => {
    return await getproductById(id);
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
  // ipcMain.handle(
  //   "add-product",
  //   async (
  //     event,
  //     {
  //       name,
  //       description,
  //       costPrice,
  //       retailPrice,
  //       sku,
  //       barcode,
  //       quantity,
  //       productImage,
  //       createdBy,
  //       updatedBy,
  //     }: {
  //       name: string;
  //       description: string;
  //       costPrice: number;
  //       retailPrice: number;
  //       sku: number;
  //       barcode: number;
  //       quantity: number;
  //       productImage: any;
  //       createdBy: number;
  //       updatedBy: number;
  //     }
  //   ) => {
  //     try {
  //       const __filename = fileURLToPath(import.meta.url);
  //       const __dirname = path.dirname(__filename);
  //       const parentDir = path.dirname(__dirname);
  //       const imageDir = path.join(parentDir, "images");

  //       if (!fs.existsSync(imageDir)) {
  //         fs.mkdirSync(imageDir, { recursive: true });
  //       }

  //       const filePath = path.join(imageDir, Date.now() + "_" + productImage.imageName);
  //       fs.writeFileSync(filePath, Buffer.from(productImage.buffer));
  //       console.log(filePath);

  //       // Save to SQLite
  //       const response = await insertProductToDatabase({
  //         name,
  //         description,
  //         costPrice,
  //         retailPrice,
  //         sku,
  //         barcode,
  //         quantity,
  //         filePath,
  //         createdBy,
  //         updatedBy,
  //       });

  //       return { success: true, path: filePath, response };
  //     } catch (error) {
  //       //@ts-ignore
  //       return { success: false, error: error.message };
  //     }
  //   }
  // );

  function getImagesDirectory() {
    if (app.isPackaged) {
      // In packaged app, use userData directory for writable files
      const userDataPath = app.getPath("userData");
      return path.join(userDataPath, "images");
    } else {
      // In development, use relative path
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const parentDir = path.dirname(__dirname);
      return path.join(parentDir, "images");
    }
  }

  ipcMain.handle(
    "add-product",
    async (
      event,
      {
        name,
        description,
        costPrice,
        retailPrice,
        sku,
        barcode,
        quantity,
        productImage,
        createdBy,
        updatedBy,
      }: {
        name: string;
        description: string;
        costPrice: number;
        retailPrice: number;
        sku: number;
        barcode: number;
        quantity: number;
        productImage: any;
        createdBy: number;
        updatedBy: number;
      }
    ) => {
      try {
        const imageDir = getImagesDirectory();

        // Ensure the images directory exists
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        const filePath = path.join(imageDir, Date.now() + "_" + productImage.imageName);

        // Add error handling for file writing
        try {
          fs.writeFileSync(filePath, Buffer.from(productImage.buffer));
          console.log("Image saved successfully at:", filePath);
        } catch (fileError: any) {
          console.error("Error writing file:", fileError);
          throw new Error(`Failed to save image: ${fileError.message}`);
        }

        // Save to SQLite
        const response = await insertProductToDatabase({
          name,
          description,
          costPrice,
          retailPrice,
          sku,
          barcode,
          quantity,
          filePath,
          createdBy,
          updatedBy,
        });

        return { success: true, path: filePath, response };
      } catch (error: any) {
        console.error("Error in add-product handler:", error);
        return { success: false, error: error.message };
      }
    }
  );
  //   ipcMain.handle(
  //   "update-product-details",
  //   async (
  //     event,
  //     {
  //       name,
  //       description,
  //       cost_price,
  //       retail_price,
  //       sku,
  //       barcode,
  //       quantity,
  //       productImage,
  //       updatedBy,
  //       image, // this is the old image path
  //     }: {
  //       name: string;
  //       description: string;
  //       cost_price: number;
  //       retail_price: number;
  //       sku: number;
  //       barcode: number;
  //       quantity: number;
  //       productImage: any;
  //       createdBy: number;
  //       updatedBy: number;
  //       image: string;
  //     }
  //   ) => {
  //     try {
  //       const __filename = fileURLToPath(import.meta.url);
  //       const __dirname = path.dirname(__filename);
  //       const parentDir = path.dirname(__dirname);
  //       const imageDir = path.join(parentDir, "images");

  //       if (!fs.existsSync(imageDir)) {
  //         fs.mkdirSync(imageDir, { recursive: true });
  //       }

  //       let filePath = image; // default to existing image path

  //       // If a new product image is provided
  //       if (productImage) {
  //         // Remove old image if it exists
  //         if (fs.existsSync(image)) {
  //           fs.unlinkSync(image);
  //         }

  //         // Save new image
  //         filePath = path.join(imageDir, Date.now() + "_" + productImage.imageName);
  //         fs.writeFileSync(filePath, Buffer.from(productImage.buffer));
  //         console.log("New file saved at:", filePath);
  //       }

  //       // Update product in database
  //       const response = await updateProductDetails({
  //         name,
  //         description,
  //         cost_price,
  //         retail_price,
  //         sku,
  //         barcode,
  //         quantity,
  //         filePath,
  //         updatedBy,
  //       });

  //       return { success: true, path: filePath, response };
  //     } catch (error) {
  //       //@ts-ignore
  //       return { success: false, error: error.message };
  //     }
  //   }
  // );

  // Helper function to safely delete old image files
  function deleteImageFile(imagePath: string) {
    try {
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Old image deleted:", imagePath);
        return true;
      }
    } catch (error) {
      console.error("Error deleting old image:", error);
    }
    return false;
  }

  // ipcMain.handle(
  //   "add-product",
  //   async (
  //     event,
  //     {
  //       name,
  //       description,
  //       costPrice,
  //       retailPrice,
  //       sku,
  //       barcode,
  //       quantity,
  //       productImage,
  //       createdBy,
  //       updatedBy,
  //     }: {
  //       name: string;
  //       description: string;
  //       costPrice: number;
  //       retailPrice: number;
  //       sku: number;
  //       barcode: number;
  //       quantity: number;
  //       productImage: any;
  //       createdBy: number;
  //       updatedBy: number;
  //     }
  //   ) => {
  //     try {
  //       const imageDir = getImagesDirectory();

  //       // Ensure the images directory exists
  //       if (!fs.existsSync(imageDir)) {
  //         fs.mkdirSync(imageDir, { recursive: true });
  //       }

  //       const filePath = path.join(imageDir, Date.now() + "_" + productImage.imageName);

  //       // Add error handling for file writing
  //       try {
  //         fs.writeFileSync(filePath, Buffer.from(productImage.buffer));
  //         console.log('Image saved successfully at:', filePath);
  //       } catch (fileError:any) {
  //         console.error('Error writing file:', fileError);
  //         throw new Error(`Failed to save image: ${fileError.message}`);
  //       }

  //       // Save to SQLite
  //       const response = await insertProductToDatabase({
  //         name,
  //         description,
  //         costPrice,
  //         retailPrice,
  //         sku,
  //         barcode,
  //         quantity,
  //         filePath,
  //         createdBy,
  //         updatedBy,
  //       });

  //       return { success: true, path: filePath, response };
  //     } catch (error:any) {
  //       console.error('Error in add-product handler:', error);
  //       return { success: false, error: error.message };
  //     }
  //   }
  // );

  ipcMain.handle(
    "update-product-details",
    async (
      event,
      {
        name,
        description,
        cost_price,
        retail_price,
        sku,
        barcode,
        quantity,
        productImage,
        updatedBy,
        image, // this is the old image path
      }: {
        name: string;
        description: string;
        cost_price: number;
        retail_price: number;
        sku: number;
        barcode: number;
        quantity: number;
        productImage: any;
        updatedBy: number;
        image: string;
      }
    ) => {
      try {
        const imageDir = getImagesDirectory();

        // Ensure the images directory exists
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        let filePath = image; // default to existing image path

        // If a new product image is provided
        if (productImage) {
          // Delete old image file safely
          deleteImageFile(image);

          // Save new image
          filePath = path.join(imageDir, Date.now() + "_" + productImage.imageName);

          try {
            fs.writeFileSync(filePath, Buffer.from(productImage.buffer));
            console.log("New image saved successfully at:", filePath);
          } catch (fileError: any) {
            console.error("Error writing new image file:", fileError);
            throw new Error(`Failed to save new image: ${fileError.message}`);
          }
        }

        // Update product in database
        const response = await updateProductDetails({
          name,
          description,
          cost_price,
          retail_price,
          sku,
          barcode,
          quantity,
          filePath,
          updatedBy,
        });

        return { success: true, path: filePath, response };
      } catch (error: any) {
        console.error("Error in update-product-details handler:", error);
        return { success: false, error: error.message };
      }
    }
  );

  ipcMain.handle("db:update-stock", async (ev, { quantity, id }) => {
    return await updateProductStock({ quantity, id });
  });

  ipcMain.handle("db:generate-invoice", async (event, args) => {
    try {
      const service_id: any = await addService(args.vehicleDetails);
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
  ipcMain.handle("db:update-service-due-payment", async (ev, { amountPaid, billStatus, id }) => {
    return await UpdateServiceBillPayment(amountPaid, billStatus, id);
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

  ipcMain.handle("db:get-services-by-id", async (event, customerId) => {
    console.log(customerId);
    try {
      const response = await getServicesById(customerId);
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

ipcMain.handle(
  "db:add-customer",
  async (
    event,
    {
      name,
      phoneNumber,
      email,
      address,
      createdBy,
      updatedBy,
    }: {
      name: string;
      phoneNumber: string;
      email: string;
      address: string;
      createdBy: number;
      updatedBy: number;
    }
  ) => {
    try {
      const response = await addCustomerToDB({
        name,
        phoneNumber,
        email,
        address,
        createdBy,
        updatedBy,
      });

      return { success: true, customerId: response };
    } catch (error) {
      //@ts-ignore
      return { success: false, error: error.message };
    }
  }
);

ipcMain.handle("db:get-all-customers", async (event, args) => {
  try {
    const response = await getAllCustomers();
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:search-customers-by-phone-number", async (event, args) => {
  try {
    const response = await searchCustomerByPhoneNumber(args);
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-customers-by-id", async (event, id) => {
  try {
    const response = await getCustomerById(id);
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:delete-customers-by-id", async (event, id) => {
  try {
    const response = await deleteCustomerById(id);
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});
ipcMain.handle(
  "db:update-customers-details-by-id",
  async (event, { name, email, phone_number, address,updated_by, id }) => {
    try {
      const response = await updateCustomerDetailsById({ name, email, phone_number, address,updated_by, id });
      return { success: true, response };
    } catch (error) {
      //@ts-ignore
      return { success: false, error: error.message };
    }
  }
);

ipcMain.handle("db:get-daily-profit", async (event, id) => {
  try {
    const response = await dailyProfit();
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-7-days-profit", async (event, id) => {
  try {
    const response = await last7DaysProfit();
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-daily-services-count", async (event, args) => {
  try {
    const totalServicesCount = await todayServicesCount();
    return { success: true, totalServicesCount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-last-7-days-services-count", async (event, args) => {
  try {
    const totalServicesCount = await last7DaysServicesCount();
    return { success: true, totalServicesCount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-daily-due-amount", async (event, args) => {
  try {
    const totalDueAmount: any = await dailyDueAmount();
    return { success: true, totalDueAmount: totalDueAmount.total_due_amount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});


ipcMain.handle("db:get-last-7-days-due-amount", async (event, args) => {
  try {
    const totalDueAmount: any = await last7DaysDueAmount();
    return { success: true, totalDueAmount: totalDueAmount.total_due_amount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});



