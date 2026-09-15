import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmModal({
  open, onClose, onConfirm, title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete', cancelText = 'Cancel',
  variant = 'danger', loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>{cancelText}</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmText}</Button>
        </div>
      }
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </div>
    </Modal>
  )
}