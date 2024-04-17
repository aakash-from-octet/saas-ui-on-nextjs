/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // basePath: '/octet-design',
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/login",
      },
      {
        source: "/login",
        destination: "/login",
      },

      {
        source: "/signup",
        destination: "/signup",
      },
      {
        source: "/forgot-password",
        destination: "/forgot-password",
      },
      {
        source: "/reset-password",
        destination: "/reset-password",
      },
      {
        source: "/otp",
        destination: "/otp",
      },
      {
        source: "/basic-info",
        destination: "/basic-info",
      },
      {
        source: "/business-info",
        destination: "/business-info",
      },
      {
        source: "/account-setup",
        destination: "/account-setup",
      },
     
      {
        source: "/all-documents",
    
        destination: "/all-documents",
      },
      
      {
        source: "/in-progress",

        destination: "/in-progress",
      },
      {
        source: "/need-to-sign",
        destination: "/need-to-sign",
      },
      {
        source: "/completed",
        destination: "/completed",
      },
      {
        source: "/cancelled",
        destination: "/cancelled",
      },
      {
        source: "/bin",
        destination: "/bin",
      },
      {
        source: "/draft",
        destination: "/draft",
      },
      {
        source: "/notifications",
        destination: "/notifications",
      },
      {
        source: "/me-only-flow",
        destination: "/website/me-only-flow",
      },
      {
        source: "/me-only-flow2",
        destination: "/website/me-only-flow2",
      },
      {
        source: "/me-only-flow3",
        destination: "/website/me-only-flow3",
      },
      {
        source: "/otp-authen",
        destination: "/website/otp-authen",
      },
      {
        source: "/signed-successful",
        destination: "/website/signed-successful",
      },
      {
        source: "/signers-flow",
        destination: "/website/signers-flow",
      },
      {
        source: "/me-others-flow",
        destination: "/website/me-others-flow",
      },
      {
        source: "/signer-successful-signer-flow",
        destination: "/website/signer-successful-signer-flow",
      },
      {
        source: "/create-document/upload-doc",
        destination: "/product/create-document/upload-doc",
      },
      {
        source: "/create-document/add-recipients",
        destination: "/product/create-document/add-recipients",
      },
      {
        source: "/create-document/prepare-doc",
        destination: "/product/create-document/prepare-doc",
      },
      {
        source: "/settings/profile",
        destination: "/product/settings/profile",
      },
      {
        source: "/settings/contacts",
        destination: "/product/settings/contacts",
      },
      {
        source: "/product-signed-successful",
        destination: "/product/product-signed-successful",
      },
    ];
  },
};

module.exports = nextConfig;
