import { createRouteAction, ServerFunctionEvent } from "solid-start";

interface ActionEvent extends ServerFunctionEvent {}

type Options = Parameters<typeof createRouteAction>[1];

export function createLazyRouteAction<T, R>(
  loader: () => Promise<{ default: (arg: T, event: ActionEvent) => Promise<R> | R }>,
  options?: Options
) {
  return createRouteAction(async (arg: T, event: ActionEvent): Promise<R> => {
    const { default: actionFn } = await loader();
    return await actionFn(arg, event);
  }, options);
}
