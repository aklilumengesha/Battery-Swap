"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const QrReader = dynamic(() => import("react-qr-reader").then(mod => mod.QrReader), { ssr: false });

const QR = () => {
  const [result, setResult] = useState("");

  const handleResult = (result: any, error: any) => {
    if (result) {
      setResult(result?.text);
    }
    if (error) {
      // Error handling for QR scanner
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Scan QR Code</h1>
      <div className="w-full max-w-md">
        <QrReader
          onResult={handleResult}
          constraints={{ facingMode: "environment" }}
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
