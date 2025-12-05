// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const Signin = () => {
//   const [data, setData] = useState({
//     username: "",
//     password: "",
//   });
//   const navigate = useNavigate();
//   const onMutate = (e: any) => {
//     setData((prev) => ({
//       ...prev,
//       [e.target.id]: e.target.value,
//     }));
//   };

//   useEffect(() => {
//     //@ts-ignore
//     if (localStorage.getItem("gear-square-user")) {
//       navigate("/product");
//     }
//   }, []);

//   const handleFormSubmit = async (e: any) => {
//     e.preventDefault();
//     //@ts-ignore
//     const resp = await window.electron.login(data);
//     if (resp.success) {
//       localStorage.setItem("gear-square-user", JSON.stringify(resp.result));
//       navigate("/product");
//     } else {
//       toast("Invalid credential", {
//         position: "top-center",
//       });
//     }
//   };
//   return (
//     <div className="h-screen flex justify-center items-center bg-gray-100">
//       <div className="bg-white px-8 py-16 rounded-2xl w-[80%] lg:w-[35%] 2xl:w-[25%] sm:w-[70%] border border-gray-300 shadow">
//         <h1 className="font-bold text-4xl text-[#173468] mb-2">
//           Ge<span className="text-orange-700">a</span>r Square
//         </h1>
//         {/* <p className="mb-6 text-xl text-gray-500">Welcome</p> */}
//         <p className="text-md mb-6 text-gray-600">Please enter your username and password.</p>
//         <form className="bg-white rounded-2xl flex flex-col gap-4" onSubmit={handleFormSubmit}>
//           <div className="flex flex-col gap-1">
//             <label htmlFor="name" className="text-sm text-gray-500">
//               Username
//             </label>
//             <input
//               type="text"
//               name="username"
//               id="username"
//               className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//               onChange={onMutate}
//               // value={product.name}
//               required
//             />
//           </div>
//           <div className="flex flex-col gap-1">
//             <label htmlFor="name" className="text-sm text-gray-500">
//               Password
//             </label>
//             <input
//               type="Password"
//               name="password"
//               id="password"
//               className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
//               onChange={onMutate}
//               // value={product.name}
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="bg-[#173468] w-full p-2 text-lg text-gray-200 font-semibold rounded-lg"
//           >
//             Sign in
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signin;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User, Lock, LogIn, Loader2 } from "lucide-react";

interface SignInData {
  username: string;
  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [credentials, setCredentials] = useState<SignInData>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    const user = localStorage.getItem("gear-square-user");
    if (user) {
      navigate("/product");
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      //@ts-ignore
      const response = await window.electron.login(credentials);

      if (response.success) {
        localStorage.setItem("gear-square-user", JSON.stringify(response.result));
        toast.success("Welcome back!", { position: "top-center" });
        navigate("/product");
      } else {
        toast.error("Invalid username or password", { position: "top-center" });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", { position: "top-center" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Logo & Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 shadow-lg mb-4">
              <div className="relative flex items-center justify-center">
                <span className="font-black text-white text-2xl">G</span>
                <span className="font-black text-orange-400 text-2xl -ml-1">S</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Gear <span className="text-orange-500">Square</span>
            </h1>
            <p className="text-sm text-gray-500">Auto Service Management</p>
          </div>

          {/* Welcome Message */}
          <div className="mb-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to your account to continue</p>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleFormSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-gray-400" />
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleInputChange}
                required
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4 text-gray-400" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                autoComplete="current-password"
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">© {currentYear} Gear Square. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
