import { useCallback, useState } from "react";

export interface Disclosure {
  open: boolean;
  setOpen: (open: boolean) => void;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

/** Boolean open/close state for modals, drawers, popovers. */
export function useDisclosure(initial = false): Disclosure {
  const [open, setOpen] = useState(initial);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((v) => !v), []);
  return { open, setOpen, onOpen, onClose, onToggle };
}
