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
  updateProductDetails : async(data:any)=>{
    return await electron.ipcRenderer.invoke("update-product-details", data);
  },

  updateProductStock : async(data:any)=>{
    return await electron.ipcRenderer.invoke("db:update-stock", data);
  }
,
  getProducts: async () => {
    const result = await electron.ipcRenderer.invoke("db:getAllProducts");
    return result;
  },

  getProductById: async (id:number) => {
    const result = await electron.ipcRenderer.invoke("db:get-product-by-id",id);

    return result;
  },
  searchProducts: async (search: string) => {
    const result = await electron.ipcRenderer.invoke("db:searchProduct", search);

    return result;
  },

  // Invoices
  generateInvoice: async (data: any) => {
    const result = await electron.ipcRenderer.invoke("db:generate-invoice", data);

    return result;
  },
  getInvoices: async (data: any) => {
    const result = await electron.ipcRenderer.invoke("db:get-invoices", data);
    return result;
  },
   updateServiceDuePayment: async (data: any) => {
    const result = await electron.ipcRenderer.invoke("db:update-service-due-payment", data);
    return result;
  },

  getServicesById: async (customerId: number) => {
    console.log("first", customerId);
    const result = await electron.ipcRenderer.invoke("db:get-services-by-id", customerId);
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

  getAllCustomers: async () => {
    return await electron.ipcRenderer.invoke("db:get-all-customers");
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
});
