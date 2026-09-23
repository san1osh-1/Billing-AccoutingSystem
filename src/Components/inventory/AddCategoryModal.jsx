import { useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useTranslation } from '../../i18n/LanguageContext'

export default function AddCategoryModal({ open, onClose, onSubmit }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleClose = () => {
    setName('')
    setError('')
    onClose()
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      setError(t('category_name_required'))
      return
    }
    onSubmit(name.trim())
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('add_category')}
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>{t('cancel')}</Button>
          <Button onClick={handleSubmit}>{t('add')}</Button>
        </div>
      }
    >
      <Input
        label={t('category_name')}
        value={name}
        onChange={(e) => { setName(e.target.value); setError('') }}
        error={error}
        placeholder={t('new_category_placeholder')}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
    </Modal>
  )
}