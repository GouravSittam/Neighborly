import { Calendar, GraduationCap, TreePine } from "lucide-react";

const highlights = [
  {
    icon: Calendar,
    color: "text-blue-500",
    title: "Vibrant Local Events",
    description:
      "From farmers markets to music festivals, there's always something happening to bring neighbors together.",
  },
  {
    icon: GraduationCap,
    color: "text-green-500",
    title: "Top-Rated Schools",
    description:
      "Our neighborhoods are home to some of the best schools, making them perfect for families and lifelong learners.",
  },
  {
    icon: TreePine,
    color: "text-teal-500",
    title: "Green Spaces & Parks",
    description:
      "Enjoy beautiful parks, playgrounds, and walking trails that make outdoor living easy and fun.",
  },
];

export const CommunityHighlights = () => (
  <section className="w-full">
    <div className="container mx-auto px-4 flex flex-col items-center">
      <video
        src="https://cdn.dribbble.com/userupload/3499810/file/original-8a8c67b6f13ca0e45b09465da5a0b03f.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full max-w-2xl mb-10 rounded-2xl shadow-lg object-cover"
        style={{ minHeight: 200 }}
        poster="/neighborhood-fallback.jpg"
        onError={(e) => {
          const video = e.currentTarget;
          video.style.display = "none";
        }}
      />
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-4 text-foreground">
        Discover What Makes Our Neighborhoods Special
      </h2>
      <p className="text-lg text-muted-foreground mb-12 max-w-2xl text-center">
        Explore the unique features and vibrant community life that set our
        neighborhoods apart.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {highlights.map(({ icon: Icon, color, title, description }) => (
          <div
            key={title}
            className="bg-card rounded-xl border border-border/50 card-elevated p-8 flex flex-col items-center hover:shadow-xl dark:hover:shadow-primary/5 transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary/15 mb-5 group-hover:scale-110 transition-transform duration-300">
              <Icon className={`w-8 h-8 ${color}`} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              {title}
            </h3>
            <p className="text-muted-foreground text-center">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
