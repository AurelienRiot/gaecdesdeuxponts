import type { AutoformatPlugin } from "@udecode/plate-autoformat";
import type { PlatePlugin } from "@udecode/plate-common";

import { autoformatRules } from "@/lib/plate/autoformatRules";

export const autoformatPlugin: Partial<PlatePlugin<AutoformatPlugin>> = {
  options: {
    // biome-ignore lint/suspicious/noExplicitAny:
    rules: autoformatRules as any,
    enableUndoOnDelete: true,
  },
};
