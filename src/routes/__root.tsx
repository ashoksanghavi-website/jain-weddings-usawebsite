import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import BackToTop from "@/components/site/BackToTop";
import { InvitePopup } from "@/components/site/InvitePopup";
import { notFoundPage, site } from "@/data/site";
import { Button, Kicker } from "@/components/site/primitives";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-paper px-4">
      <div className="max-w-xl text-center">
        <Kicker>{site.brand}</Kicker>
        <h1 className="mt-4 text-ink">{notFoundPage.h1}</h1>
        <p className="mx-auto mt-4 prose-measure text-mist">{notFoundPage.line}</p>
        <div className="mt-8">
          <Button to="/">{notFoundPage.button}</Button>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="max-w-md text-center">
        <h2 className="font-display text-2xl text-ink">This page didn't load</h2>
        <p className="mt-2 text-sm text-mist">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-[44px] items-center rounded-full bg-kumkum px-6 font-util text-[11.5px] uppercase tracking-[0.16em] text-paper"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-[44px] items-center rounded-full border border-gold/60 px-6 font-util text-[11.5px] uppercase tracking-[0.16em] text-ink"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Ashok Hiralal Sanghavi" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Jost:wght@400;500;600&family=Tiro+Devanagari+Sanskrit&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-kumkum focus:px-5 focus:py-3 focus:font-util focus:text-[12px] focus:uppercase focus:tracking-[0.16em] focus:text-paper"
      >
        Skip to content
      </a>
      <Header />
      <main
        id="main"
        key={pathname}
        className="pt-[74px] min-[520px]:pt-[112px] animate-in fade-in duration-[350ms]"
      >
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
      <InvitePopup />
    </QueryClientProvider>
  );
}
