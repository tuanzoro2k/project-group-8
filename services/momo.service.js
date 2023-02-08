const { base64encode } = require("nodejs-base64");
// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require("node-fetch");
const crypto = require("crypto");

/* eslint-disable import/prefer-default-export */

// https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
// parameters
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const partnerCode = process.env.MOMO_PARTNER_CODE;

const initiatePaymentMethod = async (orderPayload) => {
  console.log("Enter initiatePaymentMethod ");
  try {
    const { contact, orderID: userOrderId, totalCost } = orderPayload;

    const orderInfo = `${contact} pay for ${userOrderId}`;
    // https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
    // parameters
    const requestId = partnerCode + new Date().getTime();
    const orderId = requestId;
    const redirectUrl = "http://localhost:3000/successful-payment";
    const ipnUrl = "https://7bdd-113-190-21-139.ngrok.io/momo/notify";
    // const ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
    const amount = totalCost * 1000;
    const requestType = "captureWallet";
    let extraData = { contact, orderID: userOrderId, totalCost };
    console.log(extraData);

    extraData = base64encode(JSON.stringify(extraData));

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // json object send to MoMo endpoint
    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "en",
    };

    const response = await requestPaymentMethodToMomo(requestBody);
    console.log(response);

    return response;
  } catch (error) {
    console.log(error);
  }
};
const requestPaymentMethodToMomo = (requestObj) =>
  fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
    method: "POST",
    body: JSON.stringify(requestObj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));

module.exports = { initiatePaymentMethod };
