import Link from "next/link";
 
import { Button } from "@/components/ui/button";
 
export function CtaBanner() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="section-shell border-secondary/20 bg-[linear-gradient(135deg,rgba(16,61,46,0.98),rgba(16,61,46,0.92)_54%,rgba(178,146,103,0.56))] text-white">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-secondary">Ready to Build?</p>
              <h2 className="font-heading text-4xl font-semibold text-balance">
                Ready to Build Your Next Digital Solution?
              </h2>
              <p className="max-w-2xl text-base leading-8 text-stone-200/80">
                Partner with Amolex Digital Tech to create innovative digital platforms, intelligent systems, and
                powerful marketing strategies that drive real business growth.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/contact?service=website-development">Start Your Project</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
