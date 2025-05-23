"use client";

import { ReactSignature } from "@/components/cuicui/application-ui/signature/react-signature/react-signature";
import { ENV } from "@/config";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import {
  handleAxiosError,
  handleAxiosSuccess,
} from "@/libs/handleAxiosFeedback";
import { base64ToFile } from "@/utils/function";
import { Button } from "@heroui/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ConfirmRequestAssetComponent({ id }: { id: string }) {
  const [signature, setSignature] = useState<string | null>(null);
  const [isConfirm, setIsConfirm] = useState(false);
  const { tCta } = useAppTranslations();

  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  useEffect(() => {
    async function getConfirmRequest(id: string) {
      const res = await axios.get(
        `${ENV.API_URL}/asset-transactions/confirm-request/${id}?type=${type}`
      );
      if (res.status === 200) setIsConfirm(true);
      else setIsConfirm(false);
    }
    getConfirmRequest(id);
  }, [id, type]);

  const handleSubmit = async () => {
    if (!signature)
      return toast.error("Chưa có chữ ký hoặc chưa xác nhận chữ ký");

    try {
      const formDataToSend = new FormData();

      if (signature) {
        // Tạo file từ base64
        const file = base64ToFile(signature, "signature.png");
        formDataToSend.append("toSignature", file);
      }

      const res = await axios.post(
        `${ENV.API_URL}/asset-transactions/confirm-request/${id}?type=${type}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      handleAxiosSuccess(res);
    } catch (err) {
      handleAxiosError(err);
    }
  };
  const handleDownload = (url: string) => {
    setSignature(url);
  };

  if (!isConfirm) {
    return <>NotFound</>;
  }
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-lg flex-col gap-4 rounded-large px-8 pb-10 pt-6">
        <ReactSignature onDownload={handleDownload} />
        <Button color="primary" onPress={handleSubmit}>
          {tCta("submit")}
        </Button>
      </div>
    </div>
  );
}
