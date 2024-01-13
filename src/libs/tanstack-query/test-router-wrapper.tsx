import {
  RouterProvider,
  Router,
  RootRoute,
  createBrowserHistory,
} from "@tanstack/react-router";

const createTestRouter = (children: React.ReactNode) => {
  const history = createBrowserHistory();
  const rootRoute = new RootRoute({ component: () => <>{children}</> });
  const routeTree = rootRoute;
  return new Router({ history, routeTree });
};

export const TestRouterWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = createTestRouter(children);
  return <RouterProvider router={router} />;
};
