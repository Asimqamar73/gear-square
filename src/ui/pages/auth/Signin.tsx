import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signin = () => {
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  const onMutate = (e: any) => {
    setData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  useEffect(() => {
    //@ts-ignore
    if (localStorage.getItem("gear-square-user")) {
      navigate("/product");
    }
  }, []);

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    //@ts-ignore
    const resp = await window.electron.login(data);
    if (resp.success) {
      localStorage.setItem("gear-square-user", JSON.stringify(resp.result));
      navigate("/product");
    } else {
      toast("Invalid credential", {
        position: "top-center",
      });
    }
  };
  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white px-8 py-16 rounded-2xl w-[80%] lg:w-[35%] 2xl:w-[25%] sm:w-[70%] border border-gray-300 shadow">
        <h1 className="font-bold text-4xl text-[#173468] mb-2">
          Ge<span className="text-orange-700">a</span>r Square
        </h1>
        {/* <p className="mb-6 text-xl text-gray-500">Welcome</p> */}
        <p className="text-md mb-6 text-gray-600">Please enter your username and password.</p>
        <form className="bg-white rounded-2xl flex flex-col gap-4" onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-gray-500">
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
              onChange={onMutate}
              // value={product.name}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm text-gray-500">
              Password
            </label>
            <input
              type="Password"
              name="password"
              id="password"
              className="border rounded-sm p-2 bg-teal-50/30 border-gray-400"
              onChange={onMutate}
              // value={product.name}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#173468] w-full p-2 text-lg text-gray-200 font-semibold rounded-lg"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
