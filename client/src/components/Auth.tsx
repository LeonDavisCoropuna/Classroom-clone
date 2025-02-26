import React from "react";
import axios from "../config/axios";

const Auth: React.FC = () => {

  function navigate(url: string) {
    window.location.href = url;
  }

  async function auth() {
    const response = await axios.post('/auth/google');
    const data = await response.data
    console.log(data);
    navigate(data.url);
  }

  return (
    <div className="bg-red-500">
      <h1>Login</h1>
      <button onClick={auth}>Login with Google</button>
    </div>
  );
};

export default Auth;
