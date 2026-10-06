import {
  Building2,
  Contact,
  Mail,
  MessageCircle,
  Scale,
  Scissors,
  Sheet,
  ShoppingBag,
  Stethoscope,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';

// Ícones Lucide (traço fino). Chaves usadas em content.ts.
export const icons: Record<string, LucideIcon> = {
  whatsapp: MessageCircle,
  sheet: Sheet,
  mail: Mail,
  crm: Contact,
  clinica: Stethoscope,
  restaurante: UtensilsCrossed,
  imobiliaria: Building2,
  salao: Scissors,
  loja: ShoppingBag,
  advocacia: Scale,
};
