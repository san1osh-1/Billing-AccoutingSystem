import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import { useTranslation } from '../../i18n/LanguageContext'

export default function ConfirmModal({
  open, onClose, onConfirm, title, description,
  confirmText, cancelText,
  variant = 'danger', loading = false,
}) {
  const { t } = useTranslation()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title || t('are_you_sure')}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>{cancelText || t('cancel')}</Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmText || t('delete')}</Button>
        </div>
      }
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">{description || t('cannot_be_undone')}</p>
      </div>
    </Modal>
  )
}