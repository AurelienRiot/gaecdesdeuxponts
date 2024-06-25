import React from "react";
import type { ComboboxItemProps, ComboboxOnSelectItem } from "@udecode/plate-combobox";
import { type EmojiItemData, KEY_EMOJI, type TEmojiCombobox, useEmojiComboboxState } from "@udecode/plate-emoji";

import { Combobox } from "./combobox";

export function EmojiComboboxItem({ item }: ComboboxItemProps<EmojiItemData>) {
  const {
    data: { id, emoji },
  } = item;

  return (
    <div>
      {emoji} :{id}:
    </div>
  );
}

export function EmojiCombobox({ pluginKey = KEY_EMOJI, id = pluginKey, ...props }: TEmojiCombobox) {
  const { trigger, onSelectItem } = useEmojiComboboxState({ pluginKey });

  return (
    <Combobox
      id={id}
      trigger={trigger}
      controlled
      onRenderItem={EmojiComboboxItem}
      // @ts-ignore
      onSelectItem={onSelectItem}
      {...props}
    />
  );
}
