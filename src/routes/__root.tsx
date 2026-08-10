import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Casamento Joana&Diogo" },
      { name: "description", content: "Bem-vindos ao site do nosso Casamento 😘 Welcome to our wedding website 😘" },
      { name: "author", content: "Joana & Diogo" },
      { name: "google-site-verification", content: "g4kD7YZS7_VFe2sZ4vexnJZGI2ORqdJDN4O5oRRybhc" },
      { name: "theme-color", content: "#6B7A4F" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Joana & Diogo" },


      { property: "og:title", content: "Casamento Joana&Diogo" },
      { property: "og:description", content: "Bem-vindos ao site do nosso Casamento 😘 Welcome to our wedding website 😘" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Joana & Diogo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Casamento Joana&Diogo" },
      { name: "twitter:description", content: "Bem-vindos ao site do nosso Casamento 😘 Welcome to our wedding website 😘" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/BYFEOymySMX1cK6cJOdODewLp9l2/social-images/social-1779014286961-Casamento_Joana__Diogo.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/BYFEOymySMX1cK6cJOdODewLp9l2/social-images/social-1779014286961-Casamento_Joana__Diogo.webp" },
    ],
    links: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },

      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Lato:wght@300;400&family=Allura&display=swap",
      },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/app-icon-192.png" },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
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
  return <Outlet />;
}
