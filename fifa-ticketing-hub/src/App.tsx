import React, { useState, useEffect } from "react"
import AuthForm from "./components/auth-form"
import MatchCatalog from "./components/match-catalog"
import CartView from "./components/cart-view"
import CheckoutView from "./components/checkout-view"
import TicketView from "./components/ticket-view"
import OrderHistory from "./components/order-history"
import AdminDashboard from "./components/admin-dashboard"
import { Toaster } from "@/components/ui/sonner"
import { LogOut, User as UserIcon, LayoutDashboard, ShoppingCart, Trophy, History, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Match, Seat, MOCK_MATCHS } from "./mocks/matchs"
import { toast } from "sonner"

interface CartState {
  match: Match;
  seat: Seat;
  quantity: number;
}

interface OrderHistoryItem {
  id: string;
  match: Match;
  seat: Seat;
  transactionId: string;
  method: string;
  amount: number;
  date: string;
}

export default function App() {
  const [user, setUser] = useState<{ email: string; role: "supporter" | "admin" } | null>(null);
  const [currentView, setCurrentView] = useState<"catalog" | "checkout" | "ticket" | "history" | "admin">("catalog");
  
  // États du panier (US-03) et contrôle du volet latéral
  const [cart, setCart] = useState<CartState | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Historique et listes dynamiques (US-06 et US-07)
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [matchsList, setMatchsList] = useState<Match[]>(MOCK_MATCHS);

  // Gestion du cycle de vie et expiration du panier (+expire)
  useEffect(() => {
    if (!cart) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCart(null);
          setIsCartOpen(false);
          setCurrentView("catalog");
          toast.error("⏱️ Votre panier a expiré ! Le siège a été remis en vente.");
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cart]);

  const handleSelectSeat = (match: Match, seat: Seat) => {
    setCart({ match, seat, quantity: 1 });
    setTimeLeft(600);
    setIsCartOpen(true); // Ouverture automatique du tiroir e-commerce
    toast.success(`🎟️ Siège temporairement bloqué !`);
  };

  const handleRemoveFromCart = () => {
    setCart(null);
    setIsCartOpen(false);
    toast.info("Le panier a été vidé.");
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView("checkout");
    toast.success("🔐 Accès à la passerelle de paiement.");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden">
      
      {/* 👑 NAVBAR MONOLITHIQUE FIXE DE LA PLATEFORME */}
      <div className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-950 shadow-md">
        <header className="py-4 px-6 flex justify-between items-center">
          
          {/* Titre / Lien Home */}
          <h1 
            className="text-xl font-black tracking-wider text-amber-500 cursor-pointer flex items-center gap-2 hover:opacity-90 transition-opacity" 
            onClick={() => setCurrentView("catalog")}
          >
            FIFA WORLD CUP 2026
          </h1>
          
          {user && (
            <div className="flex items-center gap-3">
              
              {/* INTERFACE DE CONSOLE ADMIN */}
              {user.role === "admin" && (
                <Button 
                  variant={currentView === "admin" ? "default" : "secondary"} 
                  size="sm"
                  className="rounded-xl font-medium border border-slate-700 bg-white text-slate-900 hover:bg-slate-100 text-xs h-8 mr-1"
                  onClick={() => setCurrentView(currentView === "admin" ? "catalog" : "admin")}
                >
                  <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" /> 
                  {currentView === "admin" ? "Voir le site" : "Console Admin"}
                </Button>
              )}

              {/* 🎯 ACTIONS UTILISATEUR CENTRALISÉES AVEC TEXTES COMPLETS */}
              {currentView !== "admin" && (
                <div className="flex items-center bg-slate-900/60 p-1 rounded-xl border border-slate-800/80 gap-1">
                  
                  {/* Bouton Matchs */}
                  <button 
                    onClick={() => setCurrentView("catalog")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentView === "catalog" || currentView === "checkout" || currentView === "ticket"
                        ? "bg-amber-500 text-slate-950 shadow-sm" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                    }`}
                  >
                    <Trophy className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Matchs</span>
                  </button>

                  {/* Bouton Mes Billets */}
                  <button 
                    onClick={() => setCurrentView("history")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      currentView === "history" 
                        ? "bg-amber-500 text-slate-950 shadow-sm" 
                        : "text-slate-400 hover:text-white hover:bg-slate-800/30"
                    }`}
                  >
                    <History className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mes Billets</span>
                  </button>

                  {/* Bouton Panier Coulissant */}
                  <button 
                    onClick={() => setIsCartOpen(true)}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all group/btn"
                  >
                    <div className="relative">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {cart && (
                        <span className="absolute -top-1.5 -right-2 flex h-3 w-3 items-center justify-center rounded-full bg-amber-500 text-[8px] font-black text-white animate-bounce">
                          1
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:inline">Panier</span>
                  </button>
                </div>
              )}

              {/* COMPOSANT PROFIL D'IDENTITÉ */}
              <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-slate-300">
                <UserIcon className="h-3.5 w-3.5 text-amber-500" />
                <span className="max-w-[100px] truncate hidden md:inline">{user.email}</span>
              </div>

              {/* DÉCONNEXION */}
              <Button variant="destructive" size="sm" className="h-8 text-xs px-2.5 rounded-xl" onClick={() => { setUser(null); setCart(null); setIsCartOpen(false); setCurrentView("catalog"); }}>
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </header>
      </div>

      {/* DRAWER DU PANIER LATÉRAL DROIT */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 z-10 border-l border-slate-200">
            <button 
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors z-30"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-1 flex-1 overflow-y-auto">
              <CartView 
                cartItem={cart} 
                onRemoveItem={handleRemoveFromCart} 
                onCheckout={handleGoToCheckout} 
                timeLeft={timeLeft}
              />
            </div>
          </div>
        </div>
      )}

      {/* CONTENU PRINCIPAL ADAPTÉ AU REMBOURRAGE DE LA NAVBAR */}
      <main className="container mx-auto pb-8 px-4 pt-[90px] relative z-10">
        {!user ? (
          <AuthForm onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)} />
        ) : currentView === "admin" ? (
          <AdminDashboard 
            orders={orders} 
            onMatchAdded={(newMatch) => {
              setMatchsList((prev) => [newMatch, ...prev]);
              setCurrentView("catalog"); 
            }}
          />
        ) : currentView === "catalog" ? (
          <MatchCatalog matchs={matchsList} onSelectSeat={handleSelectSeat} />
        ) : currentView === "checkout" ? (
          <CheckoutView 
            cartItem={cart!} 
            onCancel={() => { setCurrentView("catalog"); setIsCartOpen(true); }}
            onPaymentSuccess={(details) => {
              const newOrder = {
                id: "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
                match: cart!.match,
                seat: cart!.seat,
                transactionId: details.transactionId,
                method: details.method,
                amount: details.amount,
                date: new Date().toLocaleDateString("fr-FR")
              };
              
              setOrders((prev) => [newOrder, ...prev]);
              setCart(null); 
              setCurrentView("ticket"); 
              (window as any).lastOrderDetails = newOrder;
            }}
          />
        ) : currentView === "ticket" ? (
          <TicketView 
            order={(window as any).lastOrderDetails || orders[0]} 
            onGoBack={() => setCurrentView("catalog")}
          />
        ) : (
          <OrderHistory 
            orders={orders} 
            onViewTicket={(order) => {
              (window as any).lastOrderDetails = order; 
              setCurrentView("ticket"); 
            }}
          />
        )}
      </main>

      <Toaster position="top-right" richColors />
    </div>
  )
}