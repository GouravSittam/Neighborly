"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface Gallery4Item {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items?: Gallery4Item[];
}

const data = [
  {
    id: "downtown-loft",
    title: "Downtown Urban Loft District",
    description:
      "Experience vibrant city living with walkable access to restaurants, nightlife, and cultural attractions. Perfect for young professionals who thrive in bustling environments.",
    href: "#downtown-loft",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1080&h=720&fit=crop&crop=faces",
  },
  {
    id: "suburban-family",
    title: "Family-Friendly Suburban Haven",
    description:
      "Discover quiet tree-lined streets with excellent schools, parks, and family amenities. Ideal for growing families seeking safety and community connections.",
    href: "#suburban-family",
    image:
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1080&h=720&fit=crop&crop=faces",
  },
  {
    id: "waterfront-luxury",
    title: "Waterfront Luxury Community",
    description:
      "Enjoy premium amenities with stunning water views, marina access, and upscale dining. Perfect for those seeking luxury lifestyle and recreational activities.",
    href: "#waterfront-luxury",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1080&h=720&fit=crop&crop=faces",
  },
  {
    id: "historic-charm",
    title: "Historic Arts & Culture District",
    description:
      "Immerse yourself in rich history with preserved architecture, local galleries, and artisan shops. Ideal for creatives and culture enthusiasts.",
    href: "#historic-charm",
    image:
      "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=1080&h=720&fit=crop&crop=faces",
  },
  {
    id: "tech-corridor",
    title: "Innovation Tech Corridor",
    description:
      "Connect with the future in this modern district featuring co-working spaces, tech companies, and cutting-edge amenities for the digitally-minded professional.",
    href: "#tech-corridor",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1080&h=720&fit=crop&crop=faces",
  },
];

const Gallery4 = ({
  title = "Your Perfect Neighborhood Matches",
  description = "Discover neighborhoods that align with your lifestyle preferences, commute needs, and personal priorities. Our data-driven algorithm has curated these matches specifically for you.",
  items = data,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="py-16 sm:py-24 md:py-32">
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between md:mb-14 lg:mb-16 gap-4 md:gap-0">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-medium md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="max-w-lg text-muted-foreground text-base md:text-lg">
              {description}
            </p>
          </div>
          <div className="hidden shrink-0 gap-2 md:flex">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="max-w-full sm:max-w-[320px] pl-[10px] sm:pl-[20px] lg:max-w-[360px]"
              >
                <a href={item.href} className="group rounded-xl block">
                  <div className="group relative h-full min-h-[22rem] sm:min-h-[27rem] max-w-full overflow-hidden rounded-xl md:aspect-[5/4] lg:aspect-[16/9]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 h-full bg-[linear-gradient(hsl(var(--primary)/0),hsl(var(--primary)/0.4),hsl(var(--primary)/0.8)_100%)] mix-blend-multiply" />
                    <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-4 sm:p-6 text-primary-foreground md:p-8">
                      <div className="mb-2 pt-4 text-lg sm:text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                        {item.title}
                      </div>
                      <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9 text-sm md:text-base">
                        {item.description}
                      </div>
                      <div className="flex items-center text-sm">
                        Explore neighborhood{" "}
                        <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery4 };
