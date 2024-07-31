import axios from "axios";

export const generateShareLink= async (checksum,requestBody)=>{
    const options = {
        method: "post",
        url: "https://api.phonepe.com/apis/hermes/pg/v1/pay",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
        data: {
          request: requestBody,
        },
      };
      try {
        const response = await axios.request(options);
      const shareableLink =
        response.data.data.instrumentResponse.redirectInfo.url;
      return shareableLink
      } catch (error) {
        error_handler();
        console.log("Error in paymentjs==>", error)
      }
}