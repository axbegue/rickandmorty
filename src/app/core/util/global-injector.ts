import { Injector } from '@angular/core';

export let globalInjector: Injector;

export function setGlobalInjector(injector: Injector) {
  if (globalInjector) {
    // just being cautious here, this shouldn't happen
  } else {
    globalInjector = injector;
  }
}
