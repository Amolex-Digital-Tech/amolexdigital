import { metrics } from "@/lib/data";

export function MetricsStrip() {
  return (
    <section className="py-8">
      <div className="container">
        <div className="section-shell overflow-hidden py-6">
          <div className="flex min-w-max gap-10 animate-marquee">
            {[...metrics, ...metrics].map((metric, index) => (
              <div key={`${metric.label}-${index}`} className="min-w-[220px]">
                <p className="text-3xl font-semibold">{metric.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
