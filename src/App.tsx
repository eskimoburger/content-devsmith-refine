import LuckyCard from "./components/LuckyCard";

const prizes = [
  "🥤 Devsmith Mug",
  "🎫 Odoo Development Coupon with Devsmith",
  "💬 Devsmith Sticker",
  "👕 Devsmith T-shirt",
  "💻 Devsmith Notebook",
  "🎒 Devsmith Backpack",
  "☕ Premium Coffee Mug",
  "🎧 Wireless Earphones",
  "🎁 Thanks for participating!",
];

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <LuckyCard prizes={prizes} />

      {/* <footer className="mt-10 text-center text-xs uppercase tracking-[0.4em] text-teal/80 sm:text-sm">
        Powered by Devsmith
      </footer> */}
    </main>
  );
}
