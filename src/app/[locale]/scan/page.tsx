"use client";
import { Button } from "@heroui/react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useState } from "react";

type BarcodeResult = {
  rawValue?: string;
};

export default function ScanPage() {
  const [isPause, setIsPause] = useState(false);
  const [result, setResult] = useState<BarcodeResult[]>();
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-4 max-w-sm">
        <div className="w-80 h-80">
          <Scanner
            paused={isPause}
            formats={["any"]}
            onScan={(res: BarcodeResult[]) => {
              if (
                res?.[0]?.rawValue &&
                res?.[0]?.rawValue !== result?.[0]?.rawValue
              ) {
                setResult(res);
                setIsPause(true);
              }
            }}
            components={{
              zoom: true,
            }}
          />
        </div>
        <div className="flex justify-center items-center">
          <Button className="mx-2" onPress={() => setIsPause(!isPause)}>
            {!!isPause ? "Continues" : "Pause"}
          </Button>
          <Button
            onPress={() => {
              setResult(undefined);
              setIsPause(false);
            }}
          >
            Reset
          </Button>
        </div>

        {result && (
          <div className="w-full">
            <label className="text-sm text-default-500 mb-1 block">
              Scan Result:
            </label>
            <div className="rounded border border-green-500 bg-green-100 px-4 py-2 text-sm text-green-700">
              {result.map((barcode, index) => (
                <span className="break-all block" key={index}>
                  {barcode?.rawValue || ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
