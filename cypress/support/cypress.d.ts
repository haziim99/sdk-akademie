/// <reference types="cypress" />

declare namespace Cypress {
  interface Cypress {
    on(event: 'uncaught:exception', handler: (err: any) => boolean): void;
  }
}
