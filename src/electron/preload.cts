import { timelineSummary } from "./../assets/db/tables/dashboard";
const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  login: async (data: any) => {
    const result = await electron.ipcRenderer.invoke("db:login", data);

    if (result) {
      return { result: result, success: "success" };
    }
    return { statusCode: 401, message: "Invalid credentials" };
  },
  queryDatabase: async (userCredentials: { username: string; password: string }) => {
    const res = await electron.ipcRenderer.invoke("db:query", userCredentials);
    return res;
  },
  getUsers: async () => {
    const result = await electron.ipcRenderer.invoke("db:getAllUsers");

    return result;
  },

  createUsersTable: async () => {
    const result = await electron.ipcRenderer.invoke("db:createUsersTable");

    return result;
  },
  createProductsTable: async () => {
    const result = await electron.ipcRenderer.invoke("db:createProductsTable");

    return result;
  },

  createServicesTable: async () => {
    const result = await electron.ipcRenderer.invoke("db:createServicesTable");

    return result;
  },
  createServicesItemTable: async () => {
    const result = await electron.ipcRenderer.invoke("db:createServicesItemsTable");

    return result;
  },

  // products
  addProduct: async (data: any) => {
    return await electron.ipcRenderer.invoke("add-product", data);
  },
  updateProductDetails: async (data: any) => {
    return await electron.ipcRenderer.invoke("update-product-details", data);
  },

  updateProductStock: async (data: any) => {
    return await electron.ipcRenderer.invoke("db:update-stock", data);
  },
  getProducts: async (paginationArgs: any) => {
    // paginationArgs = { limit: number, offset: number }
    const result = await electron.ipcRenderer.invoke("db:getAllProducts", paginationArgs);
    return result;
  },

  getProductById: async (id: number) => {
    const result = await electron.ipcRenderer.invoke("db:get-product-by-id", id);

    return result;
  },
  searchProducts: async (search: string, pagination: { limit: number; offset: number }) => {
    const result = await electron.ipcRenderer.invoke("db:searchProduct", {
      search,
      ...pagination,
    });

    return result; // { data: [], total: number }
  },

  // Invoices
  generateInvoice: async (data: any) => {
    const result = await electron.ipcRenderer.invoke("db:generate-invoice", data);

    return result;
  },

  // updateInvoice: async (data: any) => {
  //   const result = await electron.ipcRenderer.invoke("db:update-invoice", data);
  //   return result;
  // },
// updateInvoice : async (data: any) => {
//   const result = await electron.ipcRenderer.invoke("db:update-invoice", data);
//   return result;
// },


deleteInvoice : async (id: number) => {
  const result = await electron.ipcRenderer.invoke("db:delete-invoice-by-id", id);
  return result;
},

updateInvoice : async (data: any) => {
  const result = await electron.ipcRenderer.invoke("db:update-invoice", data);
  return result;
},

  getInvoices: async (data: any) => {
    return await electron.ipcRenderer.invoke("db:get-invoices", data);
  },

  updateServiceDuePayment: async (data: any) => {
    const result = await electron.ipcRenderer.invoke("db:update-service-due-payment", data);
    return result;
  },

  getServicesById: async (customerId: number) => {
    const result = await electron.ipcRenderer.invoke("db:get-services-by-id", customerId);
    return result;
  },
  getServicesByVehicleId: async (vehicleId: number) => {
    const result = await electron.ipcRenderer.invoke("db:get-services-by-vehicle-id", vehicleId);
    return result;
  },

  getInvoiceDetails: async (id: number) => {
    const result = await electron.ipcRenderer.invoke("db:invoice-details", id);
    return result;
  },
  searchInvoices: async (search: string) => {
    const result = await electron.ipcRenderer.invoke("db:searchInvoice", search);

    return result;
  },

  //Customers
  addCustomer: async (data: any) => {
    return await electron.ipcRenderer.invoke("db:add-customer", data);
  },

  getAllCustomers: async (paginationArgs: any) => {
    // paginationArgs = { limit, offset }
    return await electron.ipcRenderer.invoke("db:get-all-customers", paginationArgs);
  },

  searchCustomerByPhoneNumber: async (phoneNumber: number) => {
    return await electron.ipcRenderer.invoke("db:search-customers-by-phone-number", phoneNumber);
  },
  getCustomerById: async (id: number) => {
    return await electron.ipcRenderer.invoke("db:get-customers-by-id", id);
  },
  updateCustomerDetailsById: async (id: number) => {
    return await electron.ipcRenderer.invoke("db:update-customers-details-by-id", id);
  },
  deleteCustomerById: async (id: number) => {
    return await electron.ipcRenderer.invoke("db:delete-customers-by-id", id);
  },

  // Dashboard
  getDailyProfit: async () => {
    return await electron.ipcRenderer.invoke("db:get-daily-profit");
  },
  last7DaysProfit: async () => {
    return await electron.ipcRenderer.invoke("db:get-7-days-profit");
  },

  getDailyServicesCount: async () => {
    return await electron.ipcRenderer.invoke("db:get-daily-services-count");
  },

  last7DaysServicesCount: async () => {
    return await electron.ipcRenderer.invoke("db:get-last-7-days-services-count");
  },
  getDailyDueAmount: async () => {
    return await electron.ipcRenderer.invoke("db:get-daily-due-amount");
  },

  getLast7DaysDueAmount: async () => {
    return await electron.ipcRenderer.invoke("db:get-last-7-days-due-amount");
  },

  last30DaysProfit: async () => {
    return await electron.ipcRenderer.invoke("db:get-30-days-profit");
  },

  last30DaysServicesCount: async () => {
    return await electron.ipcRenderer.invoke("db:get-last-30-days-services-count");
  },

  getLast30DaysDueAmount: async () => {
    return await electron.ipcRenderer.invoke("db:get-last-30-days-due-amount");
  },

  last365DaysProfit: async () => {
    return await electron.ipcRenderer.invoke("db:get-365-days-profit");
  },

  last365DaysServicesCount: async () => {
    return await electron.ipcRenderer.invoke("db:get-last-365-days-services-count");
  },

  getLast365DaysDueAmount: async () => {
    return await electron.ipcRenderer.invoke("db:get-last-365-days-due-amount");
  },

  timelineSummary: async (timeline: any) => {
    return await electron.ipcRenderer.invoke("db:get-timeline-summary", timeline);
  },

  timelineServicesCount: async (timeline: any) => {
    return await electron.ipcRenderer.invoke("db:get-timeline-services-count", timeline);
  },

  getTimelineDueAmount: async (timeline: any) => {
    return await electron.ipcRenderer.invoke("db:get-timeline-due-amount", timeline);
  },

  // Vehicles
  addVehicle: async (data: any) => {
    return await electron.ipcRenderer.invoke("db:add-vehicle", data);
  },

  getVehiclesByCustomerId: async (id: number) => {
    return await electron.ipcRenderer.invoke("db:get-vehicles-by-customer-id", id);
  },

  deleteVehiclesById: async (id: number) => {
    return await electron.ipcRenderer.invoke("db:delete-vehicle-by-id", id);
  },

  getVehicleDetails: async (id: number) => {
    return await electron.ipcRenderer.invoke("db:get-vehicle-details", id);
  },

  updateVehicleDetails: async (data: number) => {
    return await electron.ipcRenderer.invoke("db:update-vehicle-details", data);
  },
});
