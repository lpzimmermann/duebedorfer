interface DialogAction {
  label: string
  onClick: () => void
}

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  /** An optional middle-ground action rendered between cancel and confirm. */
  extraAction?: DialogAction
}

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  extraAction,
}: ConfirmDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div
        className="dialog card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="dialog-title">{title}</h2>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            {cancelLabel}
          </button>
          {extraAction && (
            <button type="button" className="secondary-button" onClick={extraAction.onClick}>
              {extraAction.label}
            </button>
          )}
          <button type="button" className="primary-button" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
