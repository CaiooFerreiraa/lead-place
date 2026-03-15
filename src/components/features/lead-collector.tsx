"use client";

import { useEffect, useState, useCallback } from "react";
import { getMetadataUseCase, getLeadsUseCase, extractLeadUseCase } from "@/infrastructure/factory";
import { City, Category, Lead } from "@/domain/entities/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { env } from "@/lib/env";
import { 
  Phone, 
  MapPin, 
  Search, 
  Download, 
  ExternalLink, 
  RefreshCw, 
  Layers, 
  Globe, 
  Zap, 
  Star,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function LeadCollector() {
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [categoryInput, setCategoryInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [extractionLoading, setExtractionLoading] = useState<Record<number, boolean>>({});
  
  // WhatsApp Message State
  const [message, setMessage] = useState<string>("Olá, vi seu anúncio e gostaria de mais informações.");
  const [selectedLeadForMessage, setSelectedLeadForMessage] = useState<Lead | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const adminPhone = env.NEXT_PUBLIC_PHONE_NUMBER;

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    async function fetchMeta() {
      try {
        const [citiesData, categoriesData] = await Promise.all([
          getMetadataUseCase.getCities(),
          getMetadataUseCase.getCategories(),
        ]);
        setCities(citiesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Meta fetch error:", error);
        toast.error("Erro ao sincronizar metadados");
      } finally {
        setMetaLoading(false);
      }
    }
    fetchMeta();
  }, []);

  const handleSearch = async (): Promise<void> => {
    if (!categoryInput) {
      toast.warning("Por favor, digite um segmento ou categoria");
      return;
    }
    setLoading(true);
    setLeads([]);
    
    try {
      // Usar a categoria digitada ou a selecionada
      const data = await getLeadsUseCase.execute(categoryInput, selectedCity);
      if (data && data.length > 0) {
        setLeads(data);
        setCurrentPage(1); // Reset to first page on new search
        toast.success(`${data.length} leads encontrados com sucesso`);
      } else {
        toast.info("Nenhum lead encontrado para este filtro");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Ocorreu um erro na busca de leads");
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async (productId: number) => {
    setExtractionLoading(prev => ({ ...prev, [productId]: true }));
    try {
      const data = await extractLeadUseCase.execute(productId);
      if (data) {
        setLeads(prev => prev.map(l => l.productId === productId ? { ...l, ...data } : l));
        toast.success("Dados extraídos com sucesso");
      }
    } catch (error) {
      console.error("Extract error:", error);
      toast.error("Erro ao extrair detalhes do lead");
    } finally {
      setExtractionLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleDownloadCSV = () => {
    if (leads.length === 0) return;
    
    const headers = ["Nome", "Telefone", "Canal", "URL"];
    const rows = leads.map(l => [
      l.name || "N/A",
      l.phone || "PENDING",
      l.isWhatsapp ? "WhatsApp" : (l.phone ? "Landline" : "Pending"),
      l.url
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers, ...rows].map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_${categoryInput}_${selectedCity || 'geral'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination Logic
  const totalPages = Math.ceil(leads.length / ITEMS_PER_PAGE);
  const paginatedLeads = leads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleSendWhatsApp = (lead: Lead) => {
    if (!lead.phone) return;
    
    // Clean phone number (remove non-digits)
    const cleanPhone = lead.phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
    setIsMessageDialogOpen(false);
    toast.success("Redirecionando para o WhatsApp...");
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF]">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-50 to-transparent -z-10" />
      
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-8"
        >
          <div className="flex justify-center flex-wrap gap-3">
            <Badge className="bg-emerald-500/10 text-emerald-600 border-none px-4 py-1 rounded-full font-bold text-[10px] tracking-wider uppercase">
              <Zap className="w-3 h-3 mr-1.5 inline" /> Extração Instantânea
            </Badge>
            <Badge className="bg-slate-900/5 text-slate-500 border-none px-4 py-1 rounded-full font-bold text-[10px] tracking-wider uppercase">
              <Star className="w-3 h-3 mr-1.5 inline" /> AI-Powered Analysis
            </Badge>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-display font-black tracking-tight text-slate-900">
              Target <span className="relative inline-block">
                Leads
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-1 bg-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                />
              </span>
            </h1>
            <p className="text-slate-500 max-w-xl mx-auto text-xl font-light leading-relaxed">
              Encontre e extraia contatos qualificados por segmento e localização com tecnologia de rastreamento avançada.
            </p>
          </div>
        </motion.div>

        {/* Search Control */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative group lg:max-w-4xl lg:mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-sky-500/20 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          <Card className="relative border-none shadow-2xl shadow-slate-200/50 bg-white md:rounded-[2rem] rounded-3xl overflow-hidden p-1">
            <CardContent className="p-2 md:p-3">
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="relative flex items-center group/input">
                    <div className="absolute left-5 text-slate-400 group-focus-within/input:text-emerald-500 transition-colors">
                      <Layers className="w-5 h-5" />
                    </div>
                    <Input 
                      placeholder="Qual segmento? (Ex: Oficinas, Escolas...)"
                      className="h-16 pl-14 pr-6 bg-slate-50/50 border-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 rounded-2xl md:rounded-l-[1.5rem] md:rounded-r-none text-lg font-medium placeholder:text-slate-300 transition-all border-r border-slate-100"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10 text-slate-400 pointer-events-none">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <Combobox 
                      options={cities.map(c => ({ value: c.slug || c.id, label: c.name }))}
                      value={selectedCity}
                      onValueChange={setSelectedCity}
                      disabled={metaLoading}
                      placeholder={metaLoading ? "Carregando..." : "Todas as cidades"}
                      className="h-16 pl-12 border-none bg-slate-50/50 focus-visible:ring-2 focus-visible:ring-emerald-500/20 rounded-2xl md:rounded-none text-lg font-medium shadow-none hover:bg-slate-100/50 transition-all"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleSearch} 
                  disabled={loading || !categoryInput}
                  className="h-16 lg:w-48 bg-slate-900 hover:bg-emerald-600 text-white font-black rounded-2xl lg:rounded-r-[1.5rem] lg:rounded-l-none text-lg transition-all duration-500 disabled:opacity-50 group active:scale-95 shadow-lg shadow-slate-200"
                >
                  {loading ? (
                    <RefreshCw className="h-6 w-6 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-3">
                      Buscar <Search className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
              <span className="block w-8 h-[2px] bg-slate-200" />
              {leads.length > 0 ? `${leads.length} Resultados Encontrados` : "Painel de Resultados"}
            </h2>
            {leads.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownloadCSV}
                className="text-xs font-bold text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full px-4 h-9"
              >
                <Download className="w-4 h-4 mr-2" /> Exportar CSV
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center gap-6">
                    <Skeleton className="h-14 w-14 rounded-2xl bg-slate-100" />
                    <div className="space-y-3 flex-1">
                      <Skeleton className="h-5 w-2/3 rounded-lg bg-slate-100" />
                      <Skeleton className="h-4 w-1/3 rounded-lg bg-slate-50" />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : leads.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {paginatedLeads.map((lead, idx) => (
                  <motion.div
                    key={lead.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group"
                  >
                    <Card className="h-full border border-slate-100 bg-white hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 rounded-[2rem] overflow-hidden flex flex-col">
                      <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <Layers className="w-6 h-6" />
                          </div>
                          <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase border-slate-100 text-slate-400 rounded-full px-3 py-1">
                            ID: {lead.productId}
                          </Badge>
                        </div>

                        <div className="space-y-2 flex-1">
                          <h3 className="text-xl font-display font-bold text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors uppercase truncate">
                            {lead.name || "Sem Nome Identificado"}
                          </h3>
                          <a 
                            href={lead.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs font-medium text-slate-400 hover:text-slate-600 inline-flex items-center gap-1.5 no-underline transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" /> Ver página fonte
                          </a>
                        </div>

                        <div className="pt-4 border-t border-slate-50 space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">Contato Principal</span>
                            <div className="flex gap-2">
                              {lead.isWhatsapp && (
                                <Badge className="bg-emerald-500 text-white border-none text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md">WHATSAPP</Badge>
                              )}
                              {lead.phone && (
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  className="h-6 w-6 rounded-md hover:bg-emerald-50 hover:text-emerald-600"
                                  onClick={() => {
                                    setSelectedLeadForMessage(lead);
                                    setIsMessageDialogOpen(true);
                                  }}
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="min-h-[56px] flex items-center">
                            {lead.phone ? (
                              <div className="w-full flex items-center justify-between bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                                <div className="flex items-center gap-3">
                                  <Phone className="w-4 h-4 text-emerald-500" />
                                  <span className="font-mono text-lg font-bold text-slate-700">{lead.phone}</span>
                                </div>
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              </div>
                            ) : (
                              <Button 
                                onClick={() => handleExtract(lead.productId)}
                                disabled={extractionLoading[lead.productId]}
                                className="w-full h-14 bg-slate-900 border-none rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 text-sm uppercase tracking-wider"
                              >
                                {extractionLoading[lead.productId] ? (
                                  <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                  <>Sincronizar Dados <Zap className="w-4 h-4" /></>
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
              >
                <div className="space-y-6 max-w-sm mx-auto">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
                    <Search className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-display font-bold text-slate-900">Nenhum dado selecionado</h3>
                    <p className="text-slate-400 font-light text-base leading-relaxed">
                      Sua mineração aparecerá aqui após definir o segmento e a cidade acima.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination Controls */}
          {leads.length > ITEMS_PER_PAGE && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 pt-8"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border-slate-100 bg-white shadow-sm hover:border-emerald-500/30 hover:text-emerald-600 disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Mostrar apenas as primeiras e últimas páginas se houver muitas
                  if (
                    totalPages > 7 &&
                    page !== 1 &&
                    page !== totalPages &&
                    Math.abs(page - currentPage) > 1
                  ) {
                    if (page === 2 || page === totalPages - 1) return <span key={page} className="px-2 text-slate-300">...</span>;
                    return null;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className={`min-w-[40px] h-10 rounded-xl font-bold transition-all ${
                        currentPage === page 
                          ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                          : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border-slate-100 bg-white shadow-sm hover:border-emerald-500/30 hover:text-emerald-600 disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* WhatsApp Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display font-black">Enviar Mensagem</DialogTitle>
            <DialogDescription className="text-slate-500">
              Personalize a mensagem inicial para {selectedLeadForMessage?.name || "este lead"}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              className="min-h-[120px] bg-slate-50/50 border-slate-100 rounded-2xl p-4 text-base focus-visible:ring-emerald-500/20"
            />
            {adminPhone && (
              <p className="mt-3 text-[10px] text-slate-400 font-medium flex items-center gap-1.5 uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Enviando via {adminPhone}
              </p>
            )}
          </div>
          <DialogFooter className="sm:justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setIsMessageDialogOpen(false)}
              className="rounded-2xl h-12 px-6 font-bold border-slate-100 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={() => selectedLeadForMessage && handleSendWhatsApp(selectedLeadForMessage)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl h-12 px-8 font-black flex gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-200"
            >
              Enviar via WhatsApp <Send className="w-4 h-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
