"use client";

import { ENV } from "@/config";
import { useAppTranslations } from "@/hooks/useAppTranslations";
import { Divider, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function SocialLogin() {
  const { tSocialLogin } = useAppTranslations();
  return (
    <>
      <div className="flex items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">
          {tSocialLogin("or")}
        </p>
        <Divider className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          startContent={<Icon icon="logos:microsoft-icon" width={24} />}
          variant="bordered"
          as={Link}
          href={`${ENV.API_URL}/auth/microsoft`}
        >
          {tSocialLogin("microsoft")}
        </Button>
        {/* <Button
          startContent={<Icon icon="flat-color-icons:google" width={24} />}
          variant="bordered"
        >
          {tSocialLogin("google")}
        </Button>
        <Button
          startContent={
            <Icon className="text-default-500" icon="fe:github" width={24} />
          }
          variant="bordered"
        >
          {tSocialLogin("github")}
        </Button> */}
      </div>
    </>
  );
}
