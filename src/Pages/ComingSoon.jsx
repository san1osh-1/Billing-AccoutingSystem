import { Construction } from 'lucide-react'
import EmptyState from '../Components/ui/EmptyState'
import PageHeader from '../Components/ui/PageHeader'

export default function ComingSoon({ title }) {
  return (
    <div>
      <PageHeader title={title} subtitle="This module is coming in the next phase." />
      <div className="bg-white border border-slate-200 rounded-xl">
        <EmptyState
          title={`${title} — Coming Soon`}
          description="We're building this module with full CRUD, validation, and Nepal-focused business logic. It will be available in the next development phase."
          action={
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Construction className="w-4 h-4" />
              Phase 2 – 4 in progress
            </div>
          }
        />
      </div>
    </div>
  )
}