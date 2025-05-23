import ConfirmRequestAssetComponent from "@/components/assets/confirm-request/page";
import { ParamsWithId } from "@/types/data";

export default async function ConfirmRequestAssetPage({
  params,
}: ParamsWithId) {
  const { id } = await params;

  return <ConfirmRequestAssetComponent id={id} />;
}
