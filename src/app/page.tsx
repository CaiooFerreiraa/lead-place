import { LeadCollector } from "@/components/features/lead-collector";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Header / Navbar */}
      <header className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">LeadsCollector</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Histórico</a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Configurações</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status API</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-slate-700">Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative overflow-hidden pt-12">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-50/50 rounded-full blur-3xl -z-10 opacity-30 pointer-events-none" />
        <div className="absolute top-[20%] right-0 w-[500px] h-[500px] bg-sky-50/50 rounded-full blur-3xl -z-10 opacity-20 pointer-events-none" />
        
        <LeadCollector />
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © 2026 LeadsCollector. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600">Privacidade</a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600">Termos</a>
            <a href="#" className="text-xs text-slate-400 hover:text-slate-600">Suporte</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
