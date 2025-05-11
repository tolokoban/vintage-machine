import { useRouteParamAsString } from "@/app/routes";
import { CompPanelMonitor } from "@/components/WorkBench/PanelMonitor";
import { workbench } from "@/workbench";
import React from "react";

export default function Page() {
  const code = atob(useRouteParamAsString("code"));
  React.useEffect(() => {
    if (!code) return;

    workbench.run({ code });
  }, [code]);
  console.log("🚀 [page] code =", code); // @FIXME: Remove this line written on 2025-05-11 at 14:38

  return <CompPanelMonitor />;
}
