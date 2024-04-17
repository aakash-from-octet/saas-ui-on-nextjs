import dynamic from "next/dynamic";
import { Router, useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Col, Row, Image, Button, message } from "antd";
import { LOGO } from "@/Components/utils/image-constants";
import OtpComponent from "@/Components/Common/Otp";
import { DEV_BASE_URL } from "@/config";
export default function Otp() {
  const [OTP, setOTP] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserid] = useState("");
  const OtpWithNoSSR = dynamic(() => import("@/Components/Common/Otp"), {
    ssr: false,
  });
  const router = useRouter();
  useEffect(() => {
  
    const storedEmail = sessionStorage.getItem("signerEmail");
    const storedUserId = sessionStorage.getItem("ProductdocumentId");
    if (storedEmail) setUserEmail(storedEmail);
    if (storedUserId) setUserid(storedUserId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(OTP, userId, "userid");
    try {
      if (!userId || !OTP) {
       
        return; 
      }
      console.log(`Making API call with userId: ${userId} and OTP: ${OTP}`);
      const response = await fetch(`${DEV_BASE_URL}/user/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure Content-Type is set correctly
        },
        body: JSON.stringify({
          otp: OTP,
          userId: userId,
        }),
      });

      const data = await response.json();
      if (data.success==true) {
        const token = data?.token;
        sessionStorage.setItem("accessToken", token);
        sessionStorage.setItem("vanity", "octet");
        sessionStorage.setItem("ProductdocumentId", data?.user);
        router.push({
          pathname: "/basic-info",
        });
      } else {
        message.error("Incorrect OTP");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
};


  const maskedEmail = userEmail.replace(
    /^(.)(.*?)(@.*)$/,
    (m, p1, p2, p3) => `${p1}${p2.replace(/./g, "*")}${p3}`
  );

  return (
    <>
      <Head>
        <title>OTP</title>
        <meta name="description" content="OTP" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative bg-white">
        <div className="auth-logo-new">
          <Link href={"/"}>
            <Image
              src={LOGO.src}
              alt="Logo"
              height={26}
              width={118}
              preview={false}
            />
          </Link>
        </div>
        <Row align="middle">
          <Col flex="auto">
            <div className="auth-wrap">
              <h1 className="auth-header">Enter OTP</h1>
              <div className="div-col gap-24 mb-24">
                <p className="lh-24 text-14 font-500 text-gray">
                  We have sent you One time password to
                  <br />
                  {maskedEmail}{" "}
                  <span
                    onClick={() => router.push("/signup")}
                    className="font-500 text-link cursor-pointer"
                  >
                    Change
                  </span>
                </p>
                <OtpComponent OTP={OTP} setOTP={setOTP} />
              </div>
              <Button
                type="primary"
              
                block
                size="large"
                className="mb-24"
                onClick={handleSubmit}
              
              >
                Submit
              </Button>
              <p className="text-start text-14 text-gray font-400">
                Didn’t receive OTP?{" "}
                <span
                  onClick={() => alert("API for Resend")}
                  className="font-600 text-link cursor-pointer"
                >
                  Resend
                </span>
              </p>
            </div>
          </Col>
          <Col flex="486px" className="signupbg mt-auth-banner">
            {/* <h2 className='auth-banner-text'>Transforming<br />traditional ways<br /> into Digital</h2> */}
          </Col>
        </Row>
      </main>
    </>
  );
}
