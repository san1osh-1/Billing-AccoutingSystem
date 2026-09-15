import { useState } from 'react'
import { Plus, Users as UsersIcon, Shield, UserCheck } from 'lucide-react'
import useUsers from '../hooks/useUsers'
import PageHeader from '../Components/ui/PageHeader'
import Button from '../Components/ui/Button'
import Badge from '../Components/ui/Badge'
import KpiCard from '../Components/ui/KpiCard'
import DataTable from '../Components/ui/DataTable'
import AddUserDrawer from '../Components/users/AddUserDrawer'
import PermissionsEditor from '../Components/users/PermissionsEditor'
import Modal from '../Components/ui/Modal'

export default function Users() {
  const { users, roles, loading, addUser, updateUser, toggleUserStatus } = useUsers()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewingRole, setViewingRole] = useState(null)

  const kpis = [
    { title: 'Total Users', value: users.length, icon: UsersIcon, tone: 'brand' },
    { title: 'Active Users', value: users.filter((u) => u.status === 'Active').length, icon: UserCheck, tone: 'emerald' },
    { title: 'Roles', value: roles.length, icon: Shield, tone: 'sky' },
  ]

  const columns = [
    {
      key: 'name', label: 'User',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
            {r.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-slate-900">{r.name}</div>
            <div className="text-xs text-slate-500">{r.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'phone', label: 'Phone' },
    { key: 'roleName', label: 'Role', render: (r) => <Badge tone="brand">{r.roleName}</Badge> },
    {
      key: 'status', label: 'Status',
      render: (r) => <Badge tone={r.status === 'Active' ? 'success' : 'neutral'} dot>{r.status}</Badge>,
    },
    { key: 'lastLogin', label: 'Last Login', render: (r) => <span className="text-xs text-slate-600">{r.lastLogin}</span> },
    {
      key: 'actions', label: '', sortable: false, align: 'right',
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <Button size="sm" variant="secondary" onClick={() => { setEditing(r); setDrawerOpen(true) }}>Edit</Button>
          <Button
            size="sm"
            variant={r.status === 'Active' ? 'secondary' : 'primary'}
            onClick={() => toggleUserStatus(r.id)}
          >
            {r.status === 'Active' ? 'Disable' : 'Enable'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Roles"
        subtitle="Manage user accounts and permissions"
        action={<Button icon={Plus} onClick={() => { setEditing(null); setDrawerOpen(true) }}>Add User</Button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((k) => <KpiCard key={k.title} {...k} value={String(k.value)} />)}
      </div>

      {/* Roles overview */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Roles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setViewingRole(role)}
              className="p-4 bg-white border border-slate-200 rounded-lg text-left hover:border-brand-300 hover:bg-brand-50/30 transition"
            >
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-brand-600" />
                <h4 className="text-sm font-semibold text-slate-900">{role.name}</h4>
              </div>
              <p className="text-xs text-slate-500">{role.description}</p>
              <p className="text-xs text-slate-400 mt-2">
                {users.filter((u) => u.roleId === role.id).length} user{users.filter((u) => u.roleId === role.id).length !== 1 ? 's' : ''}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <DataTable columns={columns} data={users} loading={loading} />

      <AddUserDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditing(null) }}
        initial={editing}
        roles={roles}
        onSubmit={(data) => editing ? updateUser(editing.id, data) : addUser(data)}
      />

      {/* Role permissions modal */}
      <Modal
        open={Boolean(viewingRole)}
        onClose={() => setViewingRole(null)}
        title={`${viewingRole?.name} — Permissions`}
        size="lg"
      >
        {viewingRole && (
          <div>
            <p className="text-sm text-slate-600 mb-4">{viewingRole.description}</p>
            <PermissionsEditor permissions={viewingRole.permissions} onChange={() => {}} readOnly />
          </div>
        )}
      </Modal>
    </div>
  )
}