'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GraduationCap, Menu, X, Users, CreditCard, CalendarCheck,
  BarChart3, Bell, Smartphone, XCircle, CheckCircle2, ArrowRight,
  ChevronRight, Zap, Shield, TrendingUp,
} from 'lucide-react'

// ─── DATA ───────────────────────────────────────────────────────────────────

const problems = [
  { text: "Can't remember who owes how much?" },
  { text: 'Hard to track attendance every day?' },
  { text: 'Payment history gets lost?' },
  { text: 'Spending hours building reports?' },
]

const features = [
  { icon: Users, title: 'Student Management', desc: 'Complete student profiles — class, subjects, guardian info, all in one place.', color: 'bg-indigo-500', light: 'bg-indigo-50' },
  { icon: CreditCard, title: 'Fee Tracking', desc: 'Monthly fee collection, outstanding balances, receipt numbers — all automated.', color: 'bg-emerald-500', light: 'bg-emerald-50' },
  { icon: CalendarCheck, title: 'Attendance System', desc: 'Mark all students present, absent, or late with a single click.', color: 'bg-amber-500', light: 'bg-amber-50' },
  { icon: BarChart3, title: 'Reports & Analytics', desc: 'Monthly revenue, dues, attendance rates — visualized in clean charts.', color: 'bg-blue-500', light: 'bg-blue-50' },
  { icon: Bell, title: 'Payment Reminders', desc: 'Automatic notifications for overdue payments. Never miss a collection again.', color: 'bg-purple-500', light: 'bg-purple-50' },
  { icon: Smartphone, title: 'Mobile Friendly', desc: 'Works on phone, tablet, and computer — use it anywhere.', color: 'bg-rose-500', light: 'bg-rose-50' },
]

const steps = [
  { num: '1', icon: GraduationCap, title: 'Register', desc: 'Create a free account. No credit card required.', color: 'from-indigo-500 to-indigo-600' },
  { num: '2', icon: Users, title: 'Add Students', desc: 'Enter student info, class, subjects, and monthly fee.', color: 'from-purple-500 to-purple-600' },
  { num: '3', icon: TrendingUp, title: 'Start Tracking', desc: 'Collect fees, take attendance, view reports — all easy!', color: 'from-emerald-500 to-emerald-600' },
]

const stats = [
  { value: '1000+', label: 'Teachers using it' },
  { value: '5000+', label: 'Students managed' },
  { value: '99%', label: 'Satisfaction rate' },
  { value: '100%', label: 'Free forever' },
]

// ─── APP MOCKUP ──────────────────────────────────────────────────────────────

function AppMockup() {
  return (
    <div className="anim-fade-right delay-300 opacity-0-init relative">
      <div className="anim-float relative z-10">
        {/* Glow */}
        <div className="absolute inset-0 bg-indigo-400/30 rounded-3xl blur-2xl scale-110" />
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-72 sm:w-80">
          {/* Top bar */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-semibold">Tuition Manager</span>
            <div className="ml-auto flex gap-1">
              <div className="w-2 h-2 bg-white/40 rounded-full" />
              <div className="w-2 h-2 bg-white/40 rounded-full" />
              <div className="w-2 h-2 bg-white/80 rounded-full" />
            </div>
          </div>
          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2 p-3">
            <div className="bg-indigo-50 rounded-xl p-3">
              <p className="text-xs text-indigo-400 mb-1">Students</p>
              <p className="text-2xl font-bold text-indigo-700">10</p>
              <p className="text-xs text-indigo-400">9 active</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-3">
              <p className="text-xs text-emerald-500 mb-1">This Month</p>
              <p className="text-xl font-bold text-emerald-700">$15,100</p>
              <p className="text-xs text-emerald-500">56% complete</p>
            </div>
          </div>
          {/* Progress */}
          <div className="px-3 pb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Monthly collection</span><span>56%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-[56%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
            </div>
          </div>
          {/* Student list */}
          <div className="px-3 pb-3 space-y-1.5">
            {[
              { init: 'AH', name: 'Arif Hossain', cls: 'Class 9', status: 'Paid', paid: true },
              { init: 'MA', name: 'Mitu Akter', cls: 'Class 10', status: 'Unpaid', paid: false },
              { init: 'RU', name: 'Rahim Uddin', cls: 'Class 8', status: 'Partial', paid: null },
            ].map((s) => (
              <div key={s.init} className="flex items-center gap-2 bg-gray-50 rounded-lg px-2.5 py-2">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold flex items-center justify-center shrink-0">
                  {s.init}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 truncate">{s.name}</p>
                  <p className="text-[10px] text-gray-400">{s.cls}</p>
                </div>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${
                  s.paid === true ? 'bg-emerald-100 text-emerald-700' :
                  s.paid === false ? 'bg-red-100 text-red-600' :
                  'bg-amber-100 text-amber-700'
                }`}>{s.status}</span>
              </div>
            ))}
          </div>
          {/* Attendance row */}
          <div className="border-t border-gray-100 px-3 py-2.5 flex items-center justify-between">
            <span className="text-xs text-gray-500">Today&apos;s attendance</span>
            <div className="flex items-center gap-1">
              {['✓','✓','✗','✓','✓','✓','⏱','✓','✓'].map((s, i) => (
                <span key={i} className={`text-[10px] w-4 h-4 rounded-full flex items-center justify-center ${
                  s === '✓' ? 'bg-emerald-100 text-emerald-600' :
                  s === '✗' ? 'bg-red-100 text-red-500' :
                  'bg-amber-100 text-amber-600'
                }`}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Floating accent cards */}
      <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-3 py-2 text-xs font-medium text-emerald-600 flex items-center gap-1.5 anim-scale-in delay-500 opacity-0-init">
        <CheckCircle2 className="w-3.5 h-3.5" />$3,000 payment received
      </div>
      <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 text-xs font-medium text-indigo-600 flex items-center gap-1.5 anim-scale-in delay-600 opacity-0-init">
        <CalendarCheck className="w-3.5 h-3.5" />6/9 present today
      </div>
    </div>
  )
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function Navbar({ scrolled, open, setOpen }: { scrolled: boolean; open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className={`text-base font-bold transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Tuition Manager
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it works', href: '#how' },
              { label: 'Pricing', href: '#pricing', badge: 'Free' },
              { label: 'About', href: '#about' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 hover:text-indigo-400 ${
                  scrolled ? 'text-gray-600' : 'text-white/80'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-indigo-600' : 'text-white/80 hover:text-white'}`}>
              Log In
            </Link>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it works', href: '#how' },
              { label: 'Pricing', href: '#pricing' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-center py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 text-sm">Log In</Link>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm">Get Started Free</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="hero-gradient min-h-screen flex items-center pt-16 pb-12 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="anim-fade-up opacity-0-init inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-white/90 text-xs font-medium">Completely Free · No credit card needed</span>
            </div>

            <h1 className="anim-fade-up delay-100 opacity-0-init text-4xl sm:text-5xl lg:text-[3.2rem] font-bold text-white leading-tight mb-4">
              Manage your tuition
              <br />
              <span className="gradient-text">business with ease!</span>
            </h1>

            <p className="anim-fade-up delay-200 opacity-0-init text-lg text-white/70 leading-relaxed mb-8 max-w-md">
              Students, fees, attendance — all in one place.
              No more paper notebooks, no more spreadsheets.
            </p>

            <div className="anim-fade-up delay-300 opacity-0-init flex flex-wrap gap-3 mb-10">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all text-sm"
              >
                View Demo
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats */}
            <div className="anim-fade-up delay-400 opacity-0-init flex flex-wrap gap-6">
              {[
                { icon: CheckCircle2, text: '1000+ teachers using it' },
                { icon: Shield, text: 'Fully secure' },
                { icon: Smartphone, text: 'Works on mobile' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-white/70 text-xs">
                  <item.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — App Mockup */}
          <div className="flex justify-center lg:justify-end">
            <AppMockup />
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f8fafc"/>
        </svg>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="bg-slate-50 py-12 border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s) => (
            <div key={s.value} className="group">
              <p className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-1 group-hover:scale-110 transition-transform inline-block">
                {s.value}
              </p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ProblemSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-3 py-1 rounded-full uppercase tracking-wide">Problems</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
            Do any of these <span className="text-rose-500">sound familiar?</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">Many tutors face these challenges every single day</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {problems.map((p, i) => (
            <div
              key={i}
              className={`flex items-start gap-4 bg-white border-2 border-rose-100 rounded-2xl p-5 hover:border-rose-300 hover:shadow-md transition-all group anim-fade-up opacity-0-init delay-${(i + 1) * 100}`}
            >
              <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-rose-200 transition-colors">
                <XCircle className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-gray-800 font-medium leading-snug pt-1.5">{p.text}</p>
            </div>
          ))}
        </div>

        {/* Bridge */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-200">
            <CheckCircle2 className="w-5 h-5 text-indigo-200" />
            Tuition Manager solves all of these!
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wide">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
            Everything you <span className="text-indigo-600">need!</span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Tuition Manager brings all your tuition management needs into one simple app
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 anim-fade-up opacity-0-init delay-${Math.min((i + 1) * 100, 600)}`}
            >
              <div className={`w-12 h-12 ${f.light} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-6 h-6 ${f.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${f.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  return (
    <section id="how" className="bg-gradient-to-b from-indigo-50 to-slate-50 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full uppercase tracking-wide">Easy to start</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
            Get started in <span className="text-indigo-600">3 simple steps</span>
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">From registration to your first report in just a few minutes</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[60%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-emerald-200 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={step.num} className={`text-center anim-fade-up opacity-0-init delay-${(i + 1) * 200}`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-xs font-bold text-gray-400 mb-2">Step {step.num}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PricingSection() {
  return (
    <section id="pricing" className="bg-white py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wide">Pricing</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-3">
          Completely <span className="text-emerald-600">Free!</span>
        </h2>
        <p className="text-gray-500 mb-8">No hidden charges. No credit card required.</p>

        <div className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-200 p-8 shadow-xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />Free Forever Plan
          </div>
          <p className="text-5xl font-black text-indigo-700 mb-1">$0</p>
          <p className="text-gray-400 text-sm mb-8">per month · free forever</p>

          <ul className="space-y-3 text-left mb-8">
            {[
              'Unlimited students',
              'Fee tracking & receipts',
              'Attendance management',
              'Monthly reports & analytics',
              'Mobile & desktop support',
              'Your data is always safe',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href="/dashboard"
            className="block w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] text-center"
          >
            Start Now — It&apos;s Free
          </Link>
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section id="about" className="py-20 relative overflow-hidden">
      <div className="hero-gradient absolute inset-0" />
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl" />
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
          Start today
          <br />
          <span className="gradient-text">completely free!</span>
        </h2>
        <p className="text-lg text-white/70 mb-10 max-w-lg mx-auto">
          Thousands of tutors are already saving time with Tuition Manager.
          Join them today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-base"
          >
            Register — Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/20 transition-all text-base"
          >
            View Demo
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <p className="text-white/40 text-xs mt-6">No credit card needed · Instant access</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4.5 h-4.5 text-white" size={18} />
              </div>
              <span className="text-white font-bold">Tuition Manager</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Simple tuition management software built for teachers.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-white font-semibold text-sm mb-3">Links</p>
            <ul className="space-y-2 text-sm">
              {['Features', 'How it works', 'Pricing'].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-3">Support</p>
            <ul className="space-y-2 text-sm">
              {['About', 'Privacy Policy', 'Contact'].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-600">© 2026 Tuition Manager. All rights reserved.</p>
          <p className="text-xs text-slate-600">Made with ❤️ for teachers</p>
        </div>
      </div>
    </footer>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar scrolled={scrolled} open={menuOpen} setOpen={setMenuOpen} />
      <HeroSection />
      <StatsSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
