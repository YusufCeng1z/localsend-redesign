import { Header } from "@/components/header/header";
import { Download } from "@/components/hero/download";
import { Features } from "@/components/features/features";
import { How } from "@/components/features/how";
import { Product } from "@/components/hero/product";
import { OpenSource } from "@/components/sections/open-source";
import { Community } from "@/components/sections/community";
import { Faq } from "@/components/sections/faq";
import { Closing } from "@/components/sections/closing";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/hero/hero";

export default function Home() {
  return (
    <main id="main" className="relative flex-1 overflow-clip px-4 pt-0">
      <Header />
      {/* Lifts the hero above the product while a dropdown inside it is open. */}
      <div className="relative has-[[data-menu]]:z-30">
        <Hero actions={<Download />} />
      </div>
      <div className="relative z-10">
        <Product />
      </div>
      <div className="relative z-10 bg-background">
        <Features />
        <How />
        <OpenSource />
        <Community />
        <Faq />
        <Closing />
        <Footer />
      </div>
    </main>
  );
}
