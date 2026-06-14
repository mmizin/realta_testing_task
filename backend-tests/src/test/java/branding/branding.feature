Feature: Branding contract

  Background:
    * url baseUrl
    * def validators = call read('classpath:utils/data-validation.js')

  Scenario: Branding info exposes the correct name and a valid contact email
    * def companyName = 'Shady Meadows B&B'
    Given path '/branding'
    When method GET
    Then status 200
    And match response.name == companyName
    And match validators.isValidContact(response.contact) == true
    And match validators.isValidEmail(response.contact.email) == true
    And match response.description == '#string'
    And match response.directions == '#string'
