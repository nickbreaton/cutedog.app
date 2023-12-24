import { createComputed, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";
import { isServer } from "solid-js/web";

export function createCoordsStore() {
  const [store, set] = createStore({ lat: 0, lon: 0 });

  createComputed(() => {
    if (isServer) {
      return;
    }

    let timeout: NodeJS.Timeout;

    function update() {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        set({ lat, lon });
        timeout = setTimeout(update, 1000);
      });
    }

    update();
    onCleanup(() => clearTimeout(timeout));
  });

  return store;
}
