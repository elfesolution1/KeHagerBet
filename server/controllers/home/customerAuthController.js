const customerModel = require("../../models/customerModel");
const { responseReturn } = require("../../utils/response");
const { createToken } = require("../../utils/tokenCreate");
const sellerCustomerModel = require("../../models/chat/sellerCustomerModel");
const bcrypt = require("bcrypt");
const {
  sendVerificationEmail,
  resetPasswordLink,
} = require("../../utils/sendEmail");
const Verification = require("../../models/emailVerificationModel");

class customerAuthController {
  customer_register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      const customer = await customerModel.findOne({ email });
      if (customer) {
        return responseReturn(res, 404, { error: "Email already exits" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const createCustomer = await customerModel.create({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        method: "manually",
      });

      await sendVerificationEmail(createCustomer, res);
      await sellerCustomerModel.create({
        myId: createCustomer.id,
      });

      const token = await createToken({
        id: createCustomer.id,
        name: createCustomer.name,
        email: createCustomer.email,
        method: createCustomer.method,
      });

      res.cookie("customerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return responseReturn(res, 200, { message: "Registerd successfully" });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: error.message });
    }
  };

  customer_login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const customer = await customerModel
        .findOne({ email })
        .select("+password");

      if (!customer) {
        return responseReturn(res, 404, { error: "Email not found" });
      }

      if (!customer?.verified) {
        return responseReturn(res, 404, {
          error:
            "User email is not verified. Check your email account and verify your email",
        });
      }

      const match = await bcrypt.compare(password, customer.password);
      if (!match) {
        return responseReturn(res, 404, { error: "Password wrong" });
      }
      const token = await createToken({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        method: customer.method,
        isVerified: customer.verified,
      });
      res.cookie("customerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        message: "Login successfully",
        customer,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: error.message });
    }
  };

  google = async (req, res, next) => {
    const { name, email, image } = req.body;

    try {
      const user = await customerModel.findOne({ email });

      if (user) {
        const token = await createToken({
          id: user._id,
          name: user.name,
          email: user.email,
          method: user.method,
        });
        const { password, ...rest } = user._doc;

        res.cookie("customerToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
          success: true,
          message: "Success",
          rest,
          token,
        });
      }

      const genPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(genPassword, 10);

      const createCustomer = await customerModel.create({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        method: "google",
        verified: true,
      });

      await sellerCustomerModel.create({
        myId: createCustomer.id,
      });

      const token = await createToken({
        id: createCustomer._id,
        name: createCustomer.name,
        email: createCustomer.email,
        method: createCustomer.method,
      });
      res.cookie("customerToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        message: "Success",
        customer: createCustomer,
        token,
      });
    } catch (error) {
      next(error);
    }
  };

  verify_email = async (req, res) => {
    const { userId, token } = req.params;

    try {
      const result = await Verification.findOne({ userId });

      if (!result) {
        const message = "Invalid verification link. Try again later.";
        return res.redirect(`/api/verified?status=error&message=${message}`); // Use return
      }

      const { expiresAt, token: hashedToken } = result;

      // Token has expired
      if (expiresAt < Date.now()) {
        await Verification.findOneAndDelete({ userId });
        await customerModel.findOneAndDelete({ _id: userId });

        const message = "Verification token has expired.";
        return res.redirect(`/api/verified?status=error&message=${message}`); // Use return
      }

      // Token is valid
      const isMatch = await bcrypt.compare(token, hashedToken);
      if (!isMatch) {
        const message = "Verification failed or link is invalid";
        return res.redirect(`/api/verified?status=error&message=${message}`); // Use return
      }

      await customerModel.findOneAndUpdate({ _id: userId }, { verified: true });
      await Verification.findOneAndDelete({ userId });

      const message = "Email Verified Successfully";
      return res.redirect(`/api/verified?status=success&message=${message}`); // Use return
    } catch (err) {
      console.log(err);
      return res.redirect(`/api/verified?message=`); // Use return
    }
  };

  request_password = async (req, res) => {
    const { email } = req.body;

    try {
      const customer = await customerModel.findOne({ email });

      if (!customer) {
        return res.status(404).json({
          status: "FAILED",
          message: "Email address not found.",
        }); // Use return
      }

      const existingRequest = await PassResetModel.findOne({ email });
      if (existingRequest) {
        if (existingRequest.expiresAt > Date.now()) {
          return res.status(201).json({
            status: "PENDING",
            message: "Reset password link has already been sent to your email.",
          }); // Use return
        }
        await PassResetModel.findOneAndDelete({ email });
      }

      await resetPasswordLink(customer, res);
      return res.status(200).json({
        status: "SUCCESS",
        message: "Reset password link sent to your email.",
      }); // Use return
    } catch (error) {
      console.log("Error in forgotPassword ", error);
      return res.status(400).json({ success: false, message: error.message }); // Use return
    }
  };

  reset_Password = async (req, res) => {
    const { userId, token } = req.params;

    try {
      const user = await customerModel.findById(userId);

      if (!user) {
        const message = "Invalid password reset link. Try again";
        return res.redirect(
          `/api/resetpassword?status=error&message=${message}`
        ); // Use return
      }

      const resetPassword = await PassResetModel.findOne({ userId });

      if (!resetPassword) {
        const message = "Invalid password reset link. Try again";
        return res.redirect(
          `/api/resetpassword?status=error&message=${message}`
        ); // Use return
      }

      const { expiresAt, token: resetToken } = resetPassword;

      if (expiresAt < Date.now()) {
        const message = "Reset Password link has expired. Please try again";
        return res.redirect(
          `/api/resetpassword?status=error&message=${message}`
        ); // Use return
      }

      const isMatch = await bcrypt.compare(token, resetToken);
      if (!isMatch) {
        const message = "Invalid reset password link. Please try again";
        return res.redirect(
          `/api/resetpassword?status=error&message=${message}`
        ); // Use return
      }

      return res.redirect(`/api/resetpassword?type=reset&id=${userId}`); // Use return
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: error.message }); // Use return
    }
  };

  change_Password = async (req, res, next) => {
    try {
      const { userId, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10); // Add salt rounds

      const user = await customerModel.findByIdAndUpdate(
        { _id: userId },
        { password: hashedPassword }
      );

      if (user) {
        await PassResetModel.findOneAndDelete({ userId });
        return res.status(200).json({ ok: true }); // Use return
      }

      return res.status(404).json({ message: "User not found" }); // Use return
    } catch (error) {
      console.log(error);
      return res.status(404).json({ message: error.message }); // Use return
    }
  };

  customer_logout = async (req, res) => {
    res.clearCookie("customerToken");
    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" }); // Use return
  };
}

module.exports = new customerAuthController();
