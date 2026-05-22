import { Save, User, Bell, Lock, Database } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="System configuration & profile"
      />

      <div className="max-w-2xl space-y-4">
        {/* Profile */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Profile Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Name</label>
              <input type="text" className="form-input" defaultValue="Teacher" />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input type="email" className="form-input" defaultValue="teacher@example.com" />
            </div>
            <div>
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" defaultValue="" placeholder="Your phone number" />
            </div>
            <div>
              <label className="form-label">Address</label>
              <input type="text" className="form-input" defaultValue="" placeholder="Your address" />
            </div>
          </div>
          <button className="btn-primary mt-4">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Tuition Info */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            Tuition Center Info
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Center Name</label>
              <input type="text" className="form-input" placeholder="e.g. My Tuition Center" />
            </div>
            <div>
              <label className="form-label">Payment Due Day</label>
              <input type="number" className="form-input" placeholder="Day of month?" defaultValue={10} />
            </div>
            <div className="sm:col-span-2">
              <label className="form-label">Address</label>
              <input type="text" className="form-input" placeholder="Tuition center address" />
            </div>
          </div>
          <button className="btn-primary mt-4">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Notifications */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-primary" />
            Notification Settings
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Payment Due Alerts', desc: 'Notify when payment deadline passes' },
              { label: 'New Student Notification', desc: 'Notify when a new student enrolls' },
              { label: 'Monthly Report', desc: 'Send a summary at the end of each month' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Password */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Change Password
          </h2>
          <div className="space-y-3">
            <div>
              <label className="form-label">Current Password</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>
            <div>
              <label className="form-label">New Password</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>
            <div>
              <label className="form-label">Confirm New Password</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>
          </div>
          <button className="btn-primary mt-4">
            <Save className="w-4 h-4" />
            Update Password
          </button>
        </div>
      </div>
    </div>
  )
}
