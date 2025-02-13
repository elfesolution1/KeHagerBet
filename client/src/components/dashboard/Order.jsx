import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { get_order } from "../../store/reducers/orderReducer";

const Order = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { myOrder } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(get_order(orderId));
  }, [dispatch, orderId]);

  const statusClasses = {
    placed: "bg-indigo-100 text-green-800",
    processing: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-white",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white p-5 flex flex-col gap-2">
      <h2 className="text-gray-500 font-semibold text-sm">
        <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
          OrderID:
        </span>{" "}
        {myOrder._id} ,{" "}
        <span className="pl-1 ">
          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
            Order Date:{" "}
          </span>
          {myOrder.date}
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-slate-600 font-semibold">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Deliver to:
            </span>{" "}
            {myOrder.shippingInfo?.name}
          </h2>
          <p>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Address:
            </span>
            <span className="text-slate-600 text-sm">
              {myOrder.shippingInfo?.address}, {myOrder.shippingInfo?.province},{" "}
              {myOrder.shippingInfo?.city}, {myOrder.shippingInfo?.area}
            </span>
          </p>
          <p className=" text-sm text-gray-600 font-bold">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">
              Email to:
            </span>{" "}
            <span className="font-normal">{userInfo.email}</span>
          </p>
        </div>
        <div className="text-slate-600 flex flex-col gap-2">
          <h2>
            <span className="text-gray-600 font-bold">Price: </span>
            {myOrder.price.toLocaleString()} {myOrder.currency}
          </h2>
          <p className="text-gray-600 font-bold">
            Pyment status:{" "}
            <span
              className={`py-[4px] text-xs px-4 ${
                myOrder.payment_status === "paid"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              } rounded-md `}
            >
              {myOrder.payment_status}
            </span>
          </p>
          <p className="text-gray-600 font-bold">
            Order status:{" "}
            <span
              className={`py-[4px] text-xs px-4 ${
                statusClasses[myOrder.delivery_status] ||
                "bg-gray-100 text-gray-800" // Default class for unknown statuses
              } rounded-md`}
            >
              {myOrder.delivery_status}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-3">
        <h2 className="text-slate-600 text-lg pb-2">Product</h2>
        <div className="flex gap-5 flex-col">
          {myOrder.products?.map((p, i) => (
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
                        Brand: <span className="font-normal">{p.brand}</span>
                      </span>
                      <span className="font-semibold">
                        Quantity:{" "}
                        <span className="font-normal">{p.quantity}</span>
                      </span>
                    </p>
                  </div>
                </div>
                <div className="pl-4">
                  <h2 className="text-md text-orange-500">
                    <span className="text-gray-600 font-bold">
                      Price With Discount:{" "}
                    </span>{" "}
                    {p.price - Math.floor((p.price * p.discount) / 100)} USD
                  </h2>
                  <p>
                    <span className="text-gray-600 font-bold">Price: </span>
                    {p.price} USD
                  </p>
                  <p>
                    <span className="text-gray-600 font-bold">Discount: </span>-
                    {p.discount}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
