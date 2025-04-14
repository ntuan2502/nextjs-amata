"use client";

import { useAppTranslations } from "@/hooks/useAppTranslations";
import { Divider, Button } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function AuthSocialLogin() {
  const { tSocialLogin } = useAppTranslations();
  return (
    <>
      <div className="flex items-center gap-4 py-2">
        <Divider className="flex-1" />
        <p className="shrink-0 text-tiny text-default-500">OR</p>
        <Divider className="flex-1" />
      </div>
      <div className="flex flex-col gap-2">
        <Button
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
        </Button>
      </div>
    </>
  );
}
