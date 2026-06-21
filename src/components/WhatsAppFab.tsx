import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const contacts = [
  { name: "Joana", phone: "+351 912 633 104", url: "https://wa.me/351912633104" },
  { name: "Diogo", phone: "+32 493 945 581", url: "https://wa.me/32493945581" },
];

export function WhatsAppFab() {
  const [open, setOpen] = useState(false);
  return (
    <div className="whatsappfab fixed bottom-6 left-6 z-40 flex flex-col-reverse items-start gap-3">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
      {open && (
        <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-[200px]">
          {contacts.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-5 py-3 hover:bg-secondary transition-colors border-b last:border-b-0 border-border"
            >
              <div className="font-display text-base text-primary">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.phone}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
