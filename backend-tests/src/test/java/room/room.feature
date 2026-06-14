Feature: Room inventory

    Background:
        * url baseUrl

    Scenario: Room list is returned and at least one room has a positive price
        Given path '/room'
        When method GET
        Then status 200
        And match response.rooms == '#array'
        And match each response.rooms ==
      """
      {
        roomid: '#number',
        roomName: '#string',
        type: '#string',
        accessible: '#boolean',
        description: '#string',
        image: '#string',
        roomPrice: '#number',
        features: '#array'
      }
      """
        * def pricedRooms = karate.filter(response.rooms, function(room){ return room.roomPrice > 0 })
        * if (pricedRooms.length == 0) karate.fail('Expected at least one room with roomPrice > 0')
