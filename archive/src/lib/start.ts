import { createRouteAction, ServerFunctionEvent } from "solid-start";
import { RouteAction } from "solid-start/data/createRouteAction";

interface ActionEvent extends ServerFunctionEvent {}

type Options = Parameters<typeof createRouteAction>[1];

export function createLazyRouteAction<T = void, R = void>(
  loader: () => Promise<{ default: (arg: T, event: ActionEvent) => Promise<R> | R }>,
  options?: Options,
): RouteAction<T, R> {
  return createRouteAction(async (arg: T, event: ActionEvent): Promise<R> => {
    const { default: actionFn } = await loader();
    return await actionFn(arg, event);
  }, options);
}
