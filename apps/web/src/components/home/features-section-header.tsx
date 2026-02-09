export function FeaturesSectionHeader() {
  return (
    <div className="mx-auto max-w-xl text-center mb-14 md:mb-16">
      <h2
        id="features-heading"
        className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4"
      >
        Everything needed to{" "}
        <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          serve a better dish
        </span>
      </h2>
      <p className="text-lg text-muted-foreground md:text-xl leading-relaxed">
        Proven recipes from kitchens that ship. Pick what fits your menu, skip
        the prep work, and get to the table faster.
      </p>
    </div>
  );
}
