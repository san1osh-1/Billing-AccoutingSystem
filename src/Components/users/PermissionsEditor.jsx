import { allPermissions } from '../../data/users'

export default function PermissionsEditor({ permissions, onChange, readOnly = false }) {
  const toggle = (key) => {
    if (readOnly) return
    const newPerms = permissions.includes(key)
      ? permissions.filter((p) => p !== key)
      : [...permissions, key]
    onChange(newPerms)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {allPermissions.map((perm) => {
        const isChecked = permissions.includes(perm.key) || permissions.includes('all')
        return (
          <label key={perm.key} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition ${
            isChecked ? 'bg-brand-50 border-brand-200' : 'bg-white border-slate-200 hover:bg-slate-50'
          } ${readOnly ? 'cursor-not-allowed opacity-75' : ''}`}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => toggle(perm.key)}
              disabled={readOnly}
              className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700">{perm.label}</span>
          </label>
        )
      })}
    </div>
  )
}