import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: JSX.Element;
  items?: MenuItem[];
}

interface Navbar1AuthButton {
  text: string;
  url?: string;
  action?: () => void;
}

interface Navbar1Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  menu?: MenuItem[];
  mobileExtraLinks?: {
    name: string;
    url: string;
  }[];
  auth?: {
    login: Navbar1AuthButton;
    signup: Navbar1AuthButton;
  };
  themeToggle?: React.ReactNode;
}

const Navbar1 = ({
  logo = {
    url: "https://www.shadcnblocks.com",
    src: "https://www.shadcnblocks.com/images/block/block-1.svg",
    alt: "logo",
    title: "Shadcnblocks.com",
  },
  menu = [
    { title: "Home", url: "#" },
    {
      title: "Products",
      url: "#",
      items: [
        {
          title: "Blog",
          description: "The latest industry news, updates, and info",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Company",
          description: "Our mission is to innovate and empower the world",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Careers",
          description: "Browse job listing and discover our workspace",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Support",
          description:
            "Get in touch with our support team or visit our community forums",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Resources",
      url: "#",
      items: [
        {
          title: "Help Center",
          description: "Get all the answers you need right here",
          icon: <Zap className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Contact Us",
          description: "We are here to help you with any questions you have",
          icon: <Sunset className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Status",
          description: "Check the current status of our services and APIs",
          icon: <Trees className="size-5 shrink-0" />,
          url: "#",
        },
        {
          title: "Terms of Service",
          description: "Our terms and conditions for using our services",
          icon: <Book className="size-5 shrink-0" />,
          url: "#",
        },
      ],
    },
    {
      title: "Pricing",
      url: "#",
    },
    {
      title: "Blog",
      url: "#",
    },
  ],
  mobileExtraLinks = [
    { name: "Press", url: "#" },
    { name: "Contact", url: "#" },
    { name: "Imprint", url: "#" },
    { name: "Sitemap", url: "#" },
  ],
  auth = {
    login: { text: "Log in", url: "#" },
    signup: { text: "Sign up", url: "#" },
  },
  themeToggle,
}: Navbar1Props) => {
  return (
    <section className="py-4">
      <div className="container px-2 sm:px-4 md:px-6 lg:px-8 mx-auto">
        <nav className="hidden justify-between lg:flex">
          <div className="flex items-center gap-4 md:gap-6">
            <a href={logo.url} className="flex items-center gap-2 min-w-0">
              <img
                src={logo.src}
                className="w-8 h-8 object-contain"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold truncate">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center">
              <NavigationMenu>
                <NavigationMenuList>
                  {menu.map((item) => renderMenuItem(item))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {themeToggle}
            {auth.login.action ? (
              <Button
                variant="outline"
                size="sm"
                className="min-w-[44px] min-h-[44px]"
                onClick={auth.login.action}
              >
                {auth.login.text}
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="min-w-[44px] min-h-[44px]"
              >
                <a href={auth.login.url}>{auth.login.text}</a>
              </Button>
            )}
            {auth.signup.action ? (
              <Button
                size="sm"
                className="min-w-[44px] min-h-[44px]"
                onClick={auth.signup.action}
              >
                {auth.signup.text}
              </Button>
            ) : (
              <Button asChild size="sm" className="min-w-[44px] min-h-[44px]">
                <a href={auth.signup.url}>{auth.signup.text}</a>
              </Button>
            )}
          </div>
        </nav>
        <div className="block lg:hidden">
          <div className="flex items-center justify-between">
            <a href={logo.url} className="flex items-center gap-2 min-w-0">
              <img
                src={logo.src}
                className="w-8 h-8 object-contain"
                alt={logo.alt}
              />
              <span className="text-lg font-semibold truncate">
                {logo.title}
              </span>
            </a>
            <div className="flex items-center gap-2">
              {themeToggle}
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="min-w-[44px] min-h-[44px]"
                  >
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="overflow-y-auto px-4 pt-6 pb-8 w-full max-w-xs sm:max-w-sm">
                  <SheetHeader>
                    <SheetTitle>
                      <a
                        href={logo.url}
                        className="flex items-center gap-2 min-w-0"
                      >
                        <img
                          src={logo.src}
                          className="w-8 h-8 object-contain"
                          alt={logo.alt}
                        />
                        <span className="text-lg font-semibold truncate">
                          {logo.title}
                        </span>
                      </a>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="my-6 flex flex-col gap-6">
                    <Accordion
                      type="single"
                      collapsible
                      className="flex w-full flex-col gap-4"
                    >
                      {menu.map((item) => renderMobileMenuItem(item))}
                    </Accordion>
                    <div className="border-t py-4">
                      <div className="grid grid-cols-2 justify-start gap-2">
                        {mobileExtraLinks.map((link, idx) => (
                          <a
                            key={idx}
                            className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground w-full"
                            href={link.url}
                          >
                            {link.name}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {auth.login.action ? (
                        <Button
                          variant="outline"
                          className="min-w-[44px] min-h-[44px]"
                          onClick={auth.login.action}
                        >
                          {auth.login.text}
                        </Button>
                      ) : (
                        <Button
                          asChild
                          variant="outline"
                          className="min-w-[44px] min-h-[44px]"
                        >
                          <a href={auth.login.url}>{auth.login.text}</a>
                        </Button>
                      )}
                      {auth.signup.action ? (
                        <Button
                          size="sm"
                          className="min-w-[44px] min-h-[44px]"
                          onClick={auth.signup.action}
                        >
                          {auth.signup.text}
                        </Button>
                      ) : (
                        <Button asChild className="min-w-[44px] min-h-[44px]">
                          <a href={auth.signup.url}>{auth.signup.text}</a>
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title} className="text-muted-foreground">
        <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            <NavigationMenuLink>
              {item.items.map((subItem) => (
                <li key={subItem.title}>
                  <a
                    className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                    href={subItem.url}
                  >
                    {subItem.icon}
                    <div>
                      <div className="text-sm font-semibold">
                        {subItem.title}
                      </div>
                      {subItem.description && (
                        <p className="text-sm leading-snug text-muted-foreground">
                          {subItem.description}
                        </p>
                      )}
                    </div>
                  </a>
                </li>
              ))}
            </NavigationMenuLink>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <a
      key={item.title}
      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
      href={item.url}
    >
      {item.title}
    </a>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <a
              key={subItem.title}
              className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
              href={subItem.url}
            >
              {subItem.icon}
              <div>
                <div className="text-sm font-semibold">{subItem.title}</div>
                {subItem.description && (
                  <p className="text-sm leading-snug text-muted-foreground">
                    {subItem.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a key={item.title} href={item.url} className="font-semibold">
      {item.title}
    </a>
  );
};

export { Navbar1 };
