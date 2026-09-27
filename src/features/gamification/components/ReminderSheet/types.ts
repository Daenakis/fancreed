export type ReminderSheetProps = {
  visible: boolean;
  onClose: () => void;
  /** Event start. */
  start: Date;
  /** Called with the chosen minutes before the start. */
  onConfirm: (minutesBefore: number) => void;
};
