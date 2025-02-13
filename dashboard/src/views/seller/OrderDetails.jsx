import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  messageClear,
  get_seller_order,
  // seller_order_status_update,
} from "../../store/Reducers/OrderReducer";
const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { order, errorMessage, successMessage } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(get_seller_order(orderId));
  }, [dispatch, orderId]);

  const [status, setStatus] = useState("");
  useEffect(() => {
    setStatus(order?.delivery_status);
  }, [order]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4  bg-white rounded-md">
        {/* <div className='flex justify-between items-center p-4'>
                    <h2 className='text-xl text-[#d0d2d6]'>Order Details</h2>
                    <select onChange={status_update} value={status} name="" id="" className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]'>
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="warehouse">warehouse</option>
                        <option value="cancelled">cancelled</option>
                    </select>
                </div> */}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex gap-2 text-lg text-[#283046]">
            <h2 className="text-gray-500 font-semibold text-sm">
              <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                OrderID:
              </span>{" "}
              {order._id} ,{" "}
              <span className="pl-1 ">
                <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
                  Order Date:{" "}
                </span>
                {order.date}
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap">
            <div className="w-[32%]">
              <div className="pr-3 text-[#d0d2d6] text-lg">
                <div className="flex flex-col gap-1">
                  <h2 className="pb-2 font-semibold">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                      Deliver to:
                    </span>{" "}
                    {order?.shippingInfo?.name}
                  </h2>
                </div>
                <div className="flex justify-start items-center">
                  <h2 className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                    Payment Status :{" "}
                  </h2>

                  <span
                    className={`py-[4px] text-xs px-4 ${
                      order.payment_status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    } rounded-md `}
                  >
                    {order.payment_status}
                  </span>
                </div>
                <span>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded">
                    Price:
                  </span>{" "}
                  <span className="text-gray-500">
                    {order.price} {order.currency}
                  </span>
                </span>
                <div className="mt-4 flex flex-col gap-4">
                  <div className="text-[#283046] flex flex-col gap-6">
                    {order?.products?.map((p, i) => (
                      <div key={i}>
                        <div className="flex gap-5 justify-start items-center text-slate-600">
                          <div className="flex gap-2">
                            <img
                              className="w-[55px] h-[55px] object-cover"
                              src={p.images[0]}
                              alt="image"
                            />
                            <div className="flex text-sm flex-col justify-start items-start">
                              <Link
                                to={`/product/details/${p.slug}`}
                                className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded"
                              >
                                {p.name}
                              </Link>
                              <p className="flex flex-col">
                                <span className="font-semibold">
                                  Brand:{" "}
                                  <span className="font-normal">{p.brand}</span>
                                </span>
                                <span className="font-semibold">
                                  Quantity:{" "}
                                  <span className="font-normal">
                                    {p.quantity}
                                  </span>
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
