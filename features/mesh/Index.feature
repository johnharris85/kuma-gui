Feature: mesh / index
  Background:
    Given the CSS selectors
      | Alias         | Selector                         |
      | main-nav      | .app-sidebar                     |
      | mesh-selector | [data-testid="mesh-selector"]    |

  Scenario: Mesh Selection
    Given the environment
      """
      KUMA_MESH_COUNT: 2
      """
    And the URL "/meshes" responds with
      """
      body:
        items:
          - name: default
          - name: aalphabetically-second-because-of-default
      """
    And the URL "/mesh-insights/default" responds with
      """
      body:
        dataplanesByType:
          gateway:
            total: 1
      """
    And the URL "/mesh-insights/aalphabetically-second-because-of-default" responds with
      """
      body:
        dataplanesByType:
          gateway:
            total: 10
      """
    When I visit the "/" URL
    Then the "$main-nav .nav-item-gateway-list-view" element contains "1"
    When I "select" 1 on the "$mesh-selector" element
    Then the "$main-nav .nav-item-gateway-list-view" element contains "10"

