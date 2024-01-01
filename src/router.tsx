import {
  Outlet,
  RouterProvider,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { z } from "zod";

import { App } from "./app";

const treesSearchSchema = z.object({
  filter: z.array(z.string()).optional(),
});

export const rootRoute = new RootRoute({
  component: () => (
    <App>
      <Outlet />
      <TanStackRouterDevtools />
    </App>
  ),
  validateSearch: (search) => treesSearchSchema.parse(search),
});

const statsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/statistics",
  component: function Index() {
    return (
      <div className="p-2">
        <h3>Trees stats!</h3>
      </div>
    );
  },
});

const routeTree = rootRoute.addChildren([statsRoute]);

const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const TanstackRouterProvider = () => <RouterProvider router={router} />;
