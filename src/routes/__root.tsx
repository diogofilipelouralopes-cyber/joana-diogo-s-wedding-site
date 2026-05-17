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
      { property: "og:title", content: "Casamento Joana&Diogo" },
      { property: "og:description", content: "Bem-vindos ao site do nosso Casamento 😘 Welcome to our wedding website 😘" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Joana & Diogo" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Casamento Joana&Diogo" },
      { name: "twitter:description", content: "Bem-vindos ao site do nosso Casamento 😘 Welcome to our wedding website 😘" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/BYFEOymySMX1cK6cJOdODewLp9l2/social-images/social-1779013495690-IMG_2195.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/BYFEOymySMX1cK6cJOdODewLp9l2/social-images/social-1779013495690-IMG_2195.webp" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
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
