"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader"), { ssr: false });

const QR = () => {
  const [result, setResult] = useState("");

  const handleError = (error: any) => {
    // Error handling for QR scanner
  };

  const handleScan = (data: any) => {
    if (data) {
      setResult(data);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Scan QR Code</h1>
      <div className="w-full max-w-md">
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: "100%" }}
        />
      </div>
      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <p className="text-sm text-gray-600">Scanned Result:</p>
          <p className="font-semibold">{result}</p>
        </div>
      )}
    </div>
  );
};

export default QR;
