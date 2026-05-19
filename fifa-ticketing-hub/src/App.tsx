import React, { useState, useEffect } from "react"
import AuthForm from "./components/auth-form"
import MatchCatalog from "./components/match-catalog"
import CartView from "./components/cart-view"
import CheckoutView from "./components/checkout-view"
import TicketView from "./components/ticket-view"
import { Toaster } from "@/components/ui/sonner"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, User as UserIcon, LayoutDashboard, ShoppingCart, Ticket, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Match, Seat } from "./mocks/matchs"
import { toast } from "sonner"

interface CartState {
  match: Match;
  seat: Seat;
  quantity: number;
}

// Structure type de la commande finale (alignée sur l'entité Order / Ticket du diagramme UML)
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
  const [currentView, setCurrentView] = useState<"catalog" | "cart" | "checkout" | "ticket" | "history" | "admin">("catalog");
  
  // États du panier (US-03)
  const [cart, setCart] = useState<CartState | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes en secondes

  // Historique persistant des commandes simulé en local (US-06)
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);

  // Gestion asynchrone de l'expiration du panier (+expire() du diagramme UML)
  useEffect(() => {
    if (!cart) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCart(null); // Libère les sièges bloqués
          setCurrentView("catalog");
          toast.error("⏱️ Votre panier a expiré ! Les billets ont été remis en vente.");
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cart]);

  // Action d'ajout au panier indexé sur le Seat (US-03)
  const handleSelectSeat = (match: Match, seat: Seat) => {
    setCart({
      match,
      seat,
      quantity: 1
    });
    setTimeLeft(600);
    setCurrentView("cart");
    toast.success(`🎟️ Siège bloqué (${seat.section}) ! Vous avez 10 minutes pour payer.`);
  };

  const handleRemoveFromCart = () => {
    setCart(null);
    setCurrentView("catalog");
    toast.info("Panier vidé. Les places ont été libérées.");
  };

  const handleGoToCheckout = () => {
    setCurrentView("checkout");
    toast.success("🔐 Accès à la passerelle de paiement sécurisée FIFA (US-04).");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header global */}
      <header className="bg-slate-950 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-black tracking-wider text-amber-500 cursor-pointer" onClick={() => setCurrentView("catalog")}>
          FIFA WORLD CUP 2026
        </h1>
        {user && (
          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Button 
                variant={currentView === "admin" ? "default" : "secondary"} 
                size="sm"
                className="rounded-md font-medium border border-slate-700 bg-white text-slate-900 hover:bg-slate-100"
                onClick={() => setCurrentView(currentView === "admin" ? "catalog" : "admin")}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" /> 
                {currentView === "admin" ? "Voir le site" : "Espace Admin"}
              </Button>
            )}
            <div className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-1.5 rounded-full">
              <UserIcon className="h-4 w-4 text-amber-400" />
              <span>{user.email}</span>
            </div>
            <Button variant="destructive" size="sm" onClick={() => { setUser(null); setCart(null); setCurrentView("catalog"); }}>
              <LogOut className="h-4 w-4 mr-2" /> Déconnexion
            </Button>
          </div>
        )}
      </header>

      {/* Navigation par Onglets */}
      {user && currentView !== "admin" && (
        <div className="bg-white border-b border-slate-200 py-2 flex justify-center">
          <Tabs 
            value={currentView === "checkout" || currentView === "ticket" ? "cart" : currentView} 
            onValueChange={(v) => setCurrentView(v as any)} 
            className="w-full max-w-lg px-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="catalog" className="flex items-center gap-2">
                <Ticket className="h-4 w-4" /> Matchs
              </TabsTrigger>
              <TabsTrigger value="cart" className="flex items-center gap-2 relative">
                <ShoppingCart className="h-4 w-4" /> Panier
                {cart && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white animate-bounce">
                    1
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" /> Mes Billets
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {!user ? (
          <AuthForm onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)} />
        ) : currentView === "admin" ? (
          <div className="p-8 text-center bg-white border rounded-xl shadow max-w-md mx-auto">
            <h2 className="text-xl font-bold">🛠️ Espace Administration (US-07)</h2>
            <p className="text-slate-500 mt-2">Ce panneau s'ouvrira lors de l'étape finale.</p>
          </div>
        ) : currentView === "catalog" ? (
          /* CORRECTION FIX 1 : Affichage du catalogue de matchs quand la vue est sur 'catalog' */
          <MatchCatalog onSelectSeat={handleSelectSeat} />
        ) : currentView === "cart" ? (
          <CartView 
            cartItem={cart} 
            onRemoveItem={handleRemoveFromCart} 
            onCheckout={handleGoToCheckout} 
            timeLeft={timeLeft}
          />
        ) : currentView === "checkout" ? (
          <CheckoutView 
            cartItem={cart!} 
            onCancel={() => setCurrentView("cart")}
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
              setCurrentView("ticket"); // Bascule immédiate sur l'US-05 !
              (window as any).lastOrderDetails = newOrder;
            }}
          />
        ) : currentView === "ticket" ? (
          /* BRANCHEMENT US-05 : Rendu du Billet officiel */
          <TicketView 
            order={(window as any).lastOrderDetails || orders[0]} 
            onGoBack={() => setCurrentView("catalog")}
          />
        ) : (
          /* Ce bloc accueillera la dernière US-06 (Historique global) */
          <div className="p-8 text-center bg-white border rounded-xl shadow max-w-md mx-auto">
            <h2 className="text-xl font-bold">📋 Votre Historique de Commandes (US-06)</h2>
            <p className="text-slate-500 mt-2">Prêt à lister l'ensemble de vos billets achetés.</p>
          </div>
        )}
      </main>

      <Toaster position="top-right" richColors />
    </div>
  )
}