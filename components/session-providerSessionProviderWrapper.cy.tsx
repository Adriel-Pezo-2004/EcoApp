import React from 'react'
import { SessionProviderWrapper } from './session-provider'

describe('<SessionProviderWrapper />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SessionProviderWrapper />)
  })
})