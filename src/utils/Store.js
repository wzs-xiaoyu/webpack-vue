import { createNamespacedHelpers } from "vuex";
import store from "../store.js";
export default function(module) {
  const name = "store" + Math.random();
  store.registerModule(name, module);
  return { ...createNamespacedHelpers(name), moduleName: name };
}
