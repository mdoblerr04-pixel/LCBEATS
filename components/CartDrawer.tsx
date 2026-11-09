import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CartItem, LicenseType } from '../types';
import { X, ShoppingCart, Download, CreditCard, Wallet, Bitcoin, Check, Lock, AlertCircle, Loader } from './Icons';

// Initialize Stripe with your test key
const stripePromise = loadStripe('pk_test_51Sc7gNHvjKsxsT83u0edKbEm49swN5Ff9FUHbcK6FGchNYhf7tNg8gtN4WnDWeq3DdYihVswE5njk1kLp2zvMffw00pxbUfWRI');

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateLicense: (id: string, license: LicenseType) => void;
}

type PaymentMethod = 'card' | 'paypal' | 'crypto';

// Inner component to use Stripe hooks
const CheckoutForm: React.FC<{ 
  total: number, 
  onClose: () => void,
  paymentMethod: PaymentMethod,
  setPaymentMethod: (m: PaymentMethod) => void
}> = ({ total, onClose, paymentMethod, setPaymentMethod }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (paymentMethod !== 'card') {
      // Handle other methods or show alert
      alert("Método no implementado en demo. Por favor usa Tarjeta.");
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
        setIsProcessing(false);
        return;
    }

    // 1. Create a PaymentMethod
    const { error: paymentMethodError, paymentMethod: paymentMethodResult } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement as any,
    });

    if (paymentMethodError) {
      setError(paymentMethodError.message || 'Error en el pago');
      setIsProcessing(false);
    } else {
      console.log('[PaymentMethod]', paymentMethodResult);
      
      // Simulate Backend Processing delay
      setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
          
          // Close after showing success
          setTimeout(() => {
              onClose();
              setIsSuccess(false); // Reset for next time
          }, 3000);
      }, 2000);
    }
  };

  const cardStyle = {
    style: {
      base: {
        color: "#ffffff",
        fontFamily: '"Inter", sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#737373"
        },
        iconColor: "#eab308"
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444"
      }
    }
  };

  if (isSuccess) {
      return (
          <div className="p-8 text-center bg-green-900/20 border border-green-500/30 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  <Check className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">¡Pago Exitoso!</h3>
              <p className="text-neutral-400 text-sm">Tus beats han sido enviados a tu correo.</p>
          </div>
      )
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 pt-2 bg-neutral-900 border-t border-neutral-800">
      
      {/* Payment Method Selector */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Selecciona Método</h3>
        <div className="grid grid-cols-3 gap-3">
            <button 
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`flex flex-col items-center justify-center gap-2 p-3 border transition-all ${
                paymentMethod === 'card' 
                ? 'bg-neutral-800 border-yellow-500 text-white' 
                : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-600'
            }`}
            >
            <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-yellow-400' : ''}`} />
            <span className="text-[10px] font-bold uppercase">Tarjeta</span>
            </button>
            <button 
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={`flex flex-col items-center justify-center gap-2 p-3 border transition-all ${
                paymentMethod === 'paypal' 
                ? 'bg-neutral-800 border-blue-500 text-white' 
                : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-600'
            }`}
            >
            <Wallet className={`w-6 h-6 ${paymentMethod === 'paypal' ? 'text-blue-400' : ''}`} />
            <span className="text-[10px] font-bold uppercase">PayPal</span>
            </button>
            <button 
            type="button"
            onClick={() => setPaymentMethod('crypto')}
            className={`flex flex-col items-center justify-center gap-2 p-3 border transition-all ${
                paymentMethod === 'crypto' 
                ? 'bg-neutral-800 border-orange-500 text-white' 
                : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-600'
            }`}
            >
            <Bitcoin className={`w-6 h-6 ${paymentMethod === 'crypto' ? 'text-orange-400' : ''}`} />
            <span className="text-[10px] font-bold uppercase">Crypto</span>
            </button>
        </div>
      </div>

      {/* Card Input Section */}
      {paymentMethod === 'card' && (
          <div className="mb-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
             <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Datos de la Tarjeta</label>
             <div className="p-4 bg-black border border-neutral-700 rounded transition-colors focus-within:border-yellow-500 focus-within:ring-1 focus-within:ring-yellow-500">
                 <CardElement options={cardStyle} />
             </div>
             <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase">
                 <Lock className="w-3 h-3 text-green-500" />
                 <span>Pagos Seguros vía Stripe SSL</span>
             </div>
          </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            {error}
        </div>
      )}

      {/* Checkout Button */}
      <div className="mt-4">
        <div className="flex justify-between items-end mb-4 py-4 border-t border-neutral-800 border-dashed">
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-sm">Total a Pagar</span>
            <span className="text-3xl font-bold text-white font-mono tracking-tighter">${total.toFixed(2)}</span>
        </div>
        
        <button 
            type="submit"
            disabled={!stripe || isProcessing}
            className={`w-full py-4 font-bold text-lg uppercase tracking-widest transition-all skew-x-[-10deg] flex items-center justify-center gap-2 ${
                isProcessing 
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]'
            }`}
        >
            <div className="skew-x-[10deg] flex items-center gap-2">
            {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
            ) : (
                <>
                <span>Pagar Ahora</span>
                <Check className="w-5 h-5" />
                </>
            )}
            </div>
        </button>
      </div>
    </form>
  );
};

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem,
  onUpdateLicense
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-neutral-950 border-l border-neutral-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-900">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 font-display uppercase tracking-wider">
            <ShoppingCart className="w-6 h-6 text-yellow-400" />
            Tu Carrito
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-lg transition-colors group">
            <X className="w-6 h-6 text-neutral-400 group-hover:text-red-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-6">
              <div className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
                <ShoppingCart className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-lg uppercase tracking-widest">El carrito está vacío</p>
              <button onClick={onClose} className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold uppercase tracking-wider skew-x-[-10deg]">
                <span className="skew-x-[10deg] inline-block">Ver Catálogo</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-neutral-900 p-4 border border-neutral-800 flex gap-4 transition-all hover:border-neutral-700">
                  <img 
                    src={item.coverUrl} 
                    alt={item.title} 
                    className="w-24 h-24 object-cover border border-neutral-800 grayscale"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-white text-lg uppercase truncate tracking-tight">{item.title}</h3>
                        <button 
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-600 hover:text-red-500 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 font-mono mb-2">LICENCIA COMERCIAL</p>
                    </div>
                    
                    <div className="flex items-end justify-between gap-4">
                      <select 
                        value={item.licenseType}
                        onChange={(e) => onUpdateLicense(item.id, e.target.value as LicenseType)}
                        className="bg-black text-xs text-neutral-300 border border-neutral-700 p-2 focus:outline-none focus:border-yellow-500 uppercase font-bold w-full max-w-[140px]"
                      >
                        {Object.values(LicenseType).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="text-yellow-400 font-bold text-xl font-mono">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
            <Elements stripe={stripePromise}>
                <CheckoutForm 
                    total={total} 
                    onClose={onClose} 
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />
            </Elements>
        )}
      </div>
    </div>
  );
};