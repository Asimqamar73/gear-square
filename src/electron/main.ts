import { createDeductProductQuantityTrigger } from "../assets/db/triggers/triggers.js";
import {
  dailyDueAmount,
  dailyProfit,
  last30DaysDueAmount,
  last30DaysProfit,
  last30DaysServicesCount,
  last365DaysDueAmount,
  last365DaysProfit,
  last365DaysServicesCount,
  last7DaysDueAmount,
  last7DaysProfit,
  last7DaysServicesCount,
  timelineDueAmount,
  timelineServicesCount,
  timelineSummary,
  todayServicesCount,
} from "../assets/db/tables/dashboard.js";
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
  updateServiceByServiceId,
} from "../assets/db/tables/serviceItems.js";
import {
  create_service_table,
  addService,
  getAllInvoices,
  getServiceDetails,
  getServicesById,
  searchInvoice,
  getServicesByVehicleId,
  generateInvoice,
  deleteService,
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
import { getPreloadpath } from "./pathResolver.js";
import fs from "fs";
import { fileURLToPath } from "url";
import {
  create_vehicles_table,
  deleteVehicleFromDatabase,
  getVehicleById,
  getVehiclesCustomerId,
  insertVehicleToDatabase,
  updateVehicleInDatabase,
} from "../assets/db/tables/vehicles.js";
import { getServicelaborCostList } from "../assets/db/tables/serviceLaborCharges.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 800,
    icon: path.join(__dirname, "assets/mac-icon.icns"),
    webPreferences: {
      preload: getPreloadpath(),
      webSecurity: false,
    },
  });

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
    const { limit, offset } = args || {};
    return await getAllProducts(limit, offset);
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
        partNumber,
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
        partNumber: string;
        quantity: number;
        productImage: any;
        createdBy: number;
        updatedBy: number;
      }
    ) => {
      let filePath: string | null = null;

      try {
        const imageDir = getImagesDirectory();

        // Ensure the images directory exists
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }

        filePath = path.join(imageDir, Date.now() + "_" + productImage.imageName);

        // Add error handling for file writing
        try {
          fs.writeFileSync(filePath, Buffer.from(productImage.buffer));
        } catch (fileError: any) {
          throw new Error(`Failed to save image: ${fileError.message}`);
        }

        // Save to SQLite
        const response = await insertProductToDatabase({
          name,
          description,
          costPrice,
          retailPrice,
          sku,
          partNumber,
          quantity,
          filePath,
          createdBy,
          updatedBy,
        });

        return { success: true, path: filePath, response };
      } catch (error: any) {
        console.error("Error in add-product handler:", error);

        // Delete the saved image if it exists and database operation failed
        if (filePath && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log("Cleaned up image file after database error:", filePath);
          } catch (deleteError: any) {
            console.error("Failed to delete image file:", deleteError.message);
          }
        }

        return { success: false, error: error };
      }
    }
  );

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
        part_number,
        quantity,
        productImage,
        updatedBy,
        image, // this is the old image path
        id,
      }: {
        name: string;
        description: string;
        cost_price: number;
        retail_price: number;
        sku: number;
        part_number: string;
        quantity: number;
        productImage: any;
        updatedBy: number;
        image: string;
        id: number;
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
          part_number,
          quantity,
          filePath,
          updatedBy,
          id,
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
      const invoiceId = await generateInvoice(
        args.vehicleDetails,
        args.items,
        args.laborItems,
        args.discount,
        args.vatAmount,
        args.amountPaid,
        args.billStatus
      );
      return { success: true, invoiceId };
    } catch (error) {
      //@ts-ignore
      return { success: false, error: error.message };
    }
  });

 


ipcMain.handle("db:update-invoice", async (event, args) => {
  try {
    const response: any = await updateServiceByServiceId(args);
    return { success: true, message: response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message || error };
  }
})

ipcMain.handle("db:delete-invoice-by-id", async (event, id) => {
  try {
    const response: any = await deleteService(id);
    
    return { success: true, message: response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message || error };
  }
})



  ipcMain.handle("db:update-service-due-payment", async (ev, { amountPaid, billStatus, id }) => {
    return await UpdateServiceBillPayment(amountPaid, billStatus, id);
  });


  ipcMain.handle("db:get-invoices", async (event, args) => {
  try {
    const { limit, offset, search, bill_status } = args;

    const response = await getAllInvoices(
      limit,
      offset,
      search,
      bill_status
    );

    return {
      success: true,
      response,
    };
  } catch (error) {
    return {
      success: false,
      //@ts-ignore
      error: error.message,
    };
  }
});


  ipcMain.handle("db:get-services-by-id", async (event, customerId) => {
    try {
      const response = await getServicesById(customerId);
      return { success: true, response };
    } catch (error) {
      //@ts-ignore
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("db:get-services-by-vehicle-id", async (event, vehicleId) => {
    try {
      const response = await getServicesByVehicleId(vehicleId);
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
        const serviceLaborCostList = await getServicelaborCostList(id);
        const serviceBill = await getServiceBill(id);
        return { success: true, service, serviceItems, serviceLaborCostList, serviceBill };
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
      companyName,
      companyPhoneNumber,
      email,
      address,
      trn,
      createdBy,
      updatedBy,
    }: {
      name: string;
      phoneNumber: string;
      companyName: string;
      companyPhoneNumber: string;
      email: string;
      address: string;
      trn: string;
      createdBy: number;
      updatedBy: number;
    }
  ) => {
    try {
      const response = await addCustomerToDB({
        name,
        phoneNumber,
        companyName,
        companyPhoneNumber,
        email,
        address,
        trn,
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
    const { limit, offset } = args || {};
    const response = await getAllCustomers(limit, offset);
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error?.message || "Unknown error" };
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
  async (
    event,
    { name, email, phone_number, company_name, company_phone_number, address, trn, updated_by, id }
  ) => {
    try {
      const response = await updateCustomerDetailsById({
        name,
        email,
        phone_number,
        company_name,
        company_phone_number,
        address,
        trn,
        updated_by,
        id,
      });
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

// 30 days dashboard business stats

ipcMain.handle("db:get-30-days-profit", async (event, id) => {
  try {
    const response = await last30DaysProfit();
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-last-30-days-due-amount", async (event, args) => {
  try {
    const totalDueAmount: any = await last30DaysDueAmount();
    return { success: true, totalDueAmount: totalDueAmount.total_due_amount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-last-30-days-services-count", async (event, args) => {
  try {
    const totalServicesCount = await last30DaysServicesCount();
    return { success: true, totalServicesCount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-365-days-profit", async (event, id) => {
  try {
    const response = await last365DaysProfit();
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-last-365-days-due-amount", async (event, args) => {
  try {
    const totalDueAmount: any = await last365DaysDueAmount();
    return { success: true, totalDueAmount: totalDueAmount.total_due_amount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-last-365-days-services-count", async (event, args) => {
  try {
    const totalServicesCount = await last365DaysServicesCount();
    return { success: true, totalServicesCount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

// Timeline statistics

ipcMain.handle("db:get-timeline-summary", async (event, timeline) => {
  try {
    const response = await timelineSummary(timeline);
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-timeline-due-amount", async (event, args) => {
  try {
    const totalDueAmount: any = await timelineDueAmount();
    return { success: true, totalDueAmount: totalDueAmount.total_due_amount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-timeline-services-count", async (event, args) => {
  try {
    const totalServicesCount = await timelineServicesCount();
    return { success: true, totalServicesCount };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

// Vehicles
ipcMain.handle(
  "db:add-vehicle",
  async (
    event,
    {
      vehicle_number,
      make,
      model,
      year,
      chassis_number,
      customer_id,
      createdBy,
      updatedBy,
    }: {
      vehicle_number: string;
      make: string;
      model: number;
      year: string;
      chassis_number: string;
      customer_id: number;
      createdBy: number;
      updatedBy: number;
    }
  ) => {
    try {
      const response = await insertVehicleToDatabase({
        vehicle_number,
        make,
        model,
        year,
        chassis_number,
        customer_id,
        createdBy,
        updatedBy,
      });

      return { success: true, vehicle: response };
    } catch (error) {
      //@ts-ignore
      return { success: false, error: error.message };
    }
  }
);

ipcMain.handle("db:get-vehicles-by-customer-id", async (event, id) => {
  try {
    const response = await getVehiclesCustomerId(id);
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:get-vehicle-details", async (event, id) => {
  try {
    const response = await getVehicleById(id);
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:update-vehicle-details", async (event, data) => {
  try {
    const response = await updateVehicleInDatabase(data);
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});

ipcMain.handle("db:delete-vehicle-by-id", async (event, id) => {
  try {
    const response = await deleteVehicleFromDatabase(id);
    return { success: true, response };
  } catch (error) {
    //@ts-ignore
    return { success: false, error: error.message };
  }
});
