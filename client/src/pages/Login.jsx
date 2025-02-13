import { useState, useEffect } from "react";

import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import FadeLoader from "react-spinners/FadeLoader";
import { useSelector, useDispatch } from "react-redux";
import { customer_login, messageClear } from "../store/reducers/authReducer";
import toast from "react-hot-toast";
import CoverImg from "../assets/cover.jpg";
import OAuth from "../components/auth/OAuth";

const Login = () => {
  const { loader, successMessage, errorMessage, userInfo } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const login = (e) => {
    e.preventDefault();
    dispatch(customer_login(state));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }

    if (userInfo) {
      navigate("/");
    }
  }, [successMessage, errorMessage, userInfo, dispatch, navigate]);

  return (
    <div>
      {loader && (
        <div className="w-screen h-screen flex justify-center items-center fixed left-0 top-0 bg-[#38303033] z-[999]">
          <FadeLoader />
        </div>
      )}
      <div className="bg-slate-200 mt-4">
        <div className="w-full justify-center items-center p-10">
          <div className="grid grid-cols-2 md:grid-cols-1 w-[60%]  mx-auto bg-white rounded-md">
            <div className="px-8 py-8">
              <h2 className="text-center w-full text-xl text-slate-600 font-bold">
                Buyer Login
              </h2>
              <div>
                <form onSubmit={login} className="text-slate-600">
                  <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="email">Email</label>
                    <input
                      onChange={inputHandle}
                      value={state.email}
                      type="email"
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-[#EA4D1B] rounded-md"
                      id="email"
                      name="email"
                      placeholder="email"
                    />
                  </div>
                  <div className="flex flex-col gap-1 mb-4">
                    <label htmlFor="password">Passoword</label>
                    <input
                      onChange={inputHandle}
                      value={state.password}
                      type="password"
                      className="w-full px-3 py-2 border border-slate-200 outline-none focus:border-[#EA4D1B] rounded-md"
                      id="password"
                      name="password"
                      placeholder="password"
                    />
                  </div>
                  <button className="px-8 w-full py-2 bg-[#EA4D1B] shadow-lg hover:shadow-indigo-500/30 text-white rounded-md">
                    Login
                  </button>
                </form>
                <div className="flex justify-center items-center py-2">
                  <div className="h-[1px] bg-slate-300 w-[95%]"></div>
                  <span className="px-3 text-slate-600">or</span>
                  <div className="h-[1px] bg-slate-300 w-[95%]"></div>
                </div>

                <OAuth />
              </div>
              <div className="text-center text-slate-600 pt-1">
                <p>
                  You have no account ?{" "}
                  <Link className="text-[#EA4D1B]" to="/register">
                    Register
                  </Link>
                </p>
              </div>
              <div className="text-center text-slate-600 pt-1">
                <p>
                  <Link
                    target="_black"
                    className="text-[#EA4D1B] font-bold"
                    to="https://multivendor-deploy-famu.vercel.app/register"
                  >
                    Register
                  </Link>{" "}
                  seller account
                </p>
              </div>
            </div>
            <div className="w-full h-full py-4 pr-4 bg-[#EA4D1B] flex md:hidden">
              <img
                className="w-full h-full object-scale-down"
                src={CoverImg}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
