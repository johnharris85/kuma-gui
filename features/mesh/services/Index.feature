Feature: mesh / services / index
  Background:
    Given the CSS selectors
      | Alias               | Selector                              |
      | items               | [data-testid='service-collection']    |
      | children            | [data-testid='data-plane-collection'] |
      | items-header        | $items th                             |
      | item                | $items tbody tr                       |
      | navigation          | .route-mesh-view-tabs ul >            |
      | button-tab-selected | $navigation li:nth-child(2).active    |
      | breadcrumbs         | .k-breadcrumbs                        |
    And the environment
      """
      KUMA_SERVICEINSIGHT_COUNT: 2
      """
    And the URL "/meshes/default/service-insights" responds with
      """
      body:
        items:
        - name: fake-service-1
        - name: fake-service-2
      """
    When I visit the "/mesh/default/services" URL

  Scenario: The items have the correct columns
    Then the "$items-header" element exists 6 times
    Then the "$items-header" elements contain
      | Value                       |
      | Name                        |
      | Type                        |
      | Address                     |
      | DP proxies (online / total) |
      | Status                      |

  Scenario: The items have the expected content and UI elements
    Then the "$button-tab-selected" element exists
    Then the "$item" element exists 2 times
    Then the "$item:nth-child(1)" element contains
      | Value          |
      | fake-service-1 |
  Scenario: Clicking the link goes to the detail page and back again
    Given the URL "/meshes/default/service-insights/fake-service-1" responds with
      """
      body:
        serviceType: external
      """
    And the URL "/meshes/default/service-insights/fake-service-2" responds with
      """
      body:
        serviceType: internal
      """
    Then the "$item:nth-child(1) td:nth-child(1)" element contains "fake-service-1"
    When I click the "$item:nth-child(1) td:first-of-type a" element
    Then the URL contains "service/fake-service-1"
    # In this case $children refers to the data-plane-proxy table
    # external services shouldn't have this
    Then the "$children" element doesn't exist

    When I click the "$breadcrumbs > .k-breadcrumbs-item:nth-child(3) > a" element
    Then the "$item" element exists 2 times
    Then the "$item:nth-child(2) td:nth-child(1)" element contains "fake-service-2"
    When I click the "$item:nth-child(2) td:first-of-type a" element
    Then the URL contains "service/fake-service-2"
    Then the "[data-testid='service-detail-view']" element contains "fake-service-2 Service"
    # In this case $children refers to the data-plane-proxy table
    Then the "$children" element exists
