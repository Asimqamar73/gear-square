const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistic: (callback: (statistics: any) => void) => {
    electron.ipcRenderer.on("statistics", (_: any, stats: any) => {
      callback(stats);
    });
  },
  login: async (data: any) => {
    console.log(data);
    const result = await electron.ipcRenderer.invoke("db:login", data);
    if (result) {
      return { result: result.recordset, success: "success" };
    }
    return { statusCode: 401, message: "Invalid credentials" };
  },
  queryDatabase: async (userCredentials: { username: string; password: string }) => {
    const res = await electron.ipcRenderer.invoke("db:query", userCredentials);
    return res;
  },
  getUsers: async () => {
    const result = await electron.ipcRenderer.invoke("db:getAllUsers");
    console.log(result);
    return result;
  },

  createUsersTable: async () => {
    const result = await electron.ipcRenderer.invoke("db:createUsersTable");
    console.log(result);
    return result;
  },
  createProductsTable: async () => {
    const result = await electron.ipcRenderer.invoke("db:createProductsTable");
    console.log(result);
    return result;
  },

  // products
  addProduct: async (data: any) => {
    console.log("data: ", data);
    return await electron.ipcRenderer.invoke("add-product", data);
  },

  getProducts: async () => {
    const result = await electron.ipcRenderer.invoke("db:getAllProducts");
    console.log(result);
    return result;
  },
  searchProducts: async (search:string) => {
    const result = await electron.ipcRenderer.invoke("db:searchProduct",search);
    console.log(result);
    return result;
  },
  selectImage: () => electron.ipcRenderer.invoke("select-image"),
});
