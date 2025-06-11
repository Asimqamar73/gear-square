import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    getLisitng();
  }, []);

  const getLisitng = async () => {
    //@ts-ignore
    const result = await window.electron.getUsers();
  };
  return (
    <div>
      Home
      <button onClick={() => navigate("/")}>Go back</button>
    </div>
  );
}

export default Home;
