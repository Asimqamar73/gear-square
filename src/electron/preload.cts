const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistic: (callback: (statistics: any) => void) => {
    electron.ipcRenderer.on("statistics", (_: any, stats: any) => {
      callback(stats);
    });
  },
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

  getProducts: async () => {
    const result = await electron.ipcRenderer.invoke("db:getAllProducts");

    return result;
  },
  searchProducts: async (search: string) => {
    const result = await electron.ipcRenderer.invoke("db:searchProduct", search);

    return result;
  },

  generateInvoice: async (data: any) => {
    const result = await electron.ipcRenderer.invoke("db:generate-invoice", data);

    return result;
  },
  getInvoices: async (data: any) => {
    const result = await electron.ipcRenderer.invoke("db:get-invoices", data);
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
});
