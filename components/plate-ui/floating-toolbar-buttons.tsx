import { MARK_BOLD, MARK_CODE, MARK_ITALIC, MARK_STRIKETHROUGH, MARK_UNDERLINE } from "@udecode/plate-basic-marks";

import { Icons } from "@/components/icons";
import { LinkToolbarButton } from "@/components/plate-ui/link-toolbar-button";

import { MarkToolbarButton } from "./mark-toolbar-button";
import { MoreDropdownMenu } from "./more-dropdown-menu";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";

export function FloatingToolbarButtons() {
  return (
    <>
      <TurnIntoDropdownMenu />

      <MarkToolbarButton nodeType={MARK_BOLD} tooltip="Gras (⌘+B)">
        <Icons.bold />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={MARK_ITALIC} tooltip="Italique (⌘+I)">
        <Icons.italic />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={MARK_UNDERLINE} tooltip="Souligné (⌘+U)">
        <Icons.underline />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={MARK_STRIKETHROUGH} tooltip="Barré (⌘+⇧+X)">
        <Icons.strikethrough />
      </MarkToolbarButton>
      <MarkToolbarButton nodeType={MARK_CODE} tooltip="Code (⌘+E)">
        <Icons.code />
      </MarkToolbarButton>

      <LinkToolbarButton />
      <MoreDropdownMenu />

      {/* <CommentToolbarButton /> */}
    </>
  );
}
