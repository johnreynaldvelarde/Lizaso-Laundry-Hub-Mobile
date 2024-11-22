import emailjs from "@emailjs/react-native";

export const generateRandomCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendVerificationEmail = async (email, code) => {
  try {
    const serviceID = "service_touybgx";
    const templateID = "template_bq51elm";
    const userID = "_k6BDJLqsr0Y7fz4v";

    const templateParams = {
      to_email: email,
      message: code,
    };

    const result = await emailjs.send(serviceID, templateID, templateParams, {
      publicKey: userID,
    });

    console.log("Public Key:", userID);
    console.log("Email sent successfully:", result);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
