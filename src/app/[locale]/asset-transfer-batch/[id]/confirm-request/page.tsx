import ConfirmRequestAssetTransferBatchComponent from "@/components/asset-transfer-batch/confirm-request/page";
import { ParamsWithId } from "@/types/data";

export default async function ConfirmRequestAssetTransferBatchPage({
  params,
}: ParamsWithId) {
  const { id } = await params;

  return <ConfirmRequestAssetTransferBatchComponent id={id} />;
}
