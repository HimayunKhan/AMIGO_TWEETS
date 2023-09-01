
"use client"
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const ErrorPage = ({ statusCode }) => {
  return (
    <div className="error-page">
      <motion.div
        className="error-image-container"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2 }}
      >
        <Image
          src="/ert.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
        />
      </motion.div>
      <div className="error-container">
        <h1 className="error-heading">
          {statusCode ? `Error ${statusCode}` : "An error occurred"}
        </h1>
        <p className="error-text">
          {statusCode
            ? "Sorry, something went wrong on this page."
            : "Sorry, an error occurred on the server."}
        </p>
        <Link href="/">
          <a className="error-link">Go back to the home page</a>
        </Link>
      </div>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
