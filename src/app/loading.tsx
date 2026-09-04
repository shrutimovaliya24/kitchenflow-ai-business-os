import { LoadingState } from "@/components/ui";

export default function Loading() {
  return (
    <div className="py-10">
      <LoadingState label="Loading module…" />
    </div>
  );
}
