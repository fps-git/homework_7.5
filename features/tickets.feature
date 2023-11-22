Feature: Testing of ticket purchase
    Scenario: Should buy a standard ticket
        Given user is on "/client/index.php" page
        When user buys a "standart" ticket to the nearest movie
        Then user gets a QR code for his reservation with "1000" rubles price

    Scenario: Should buy a vip ticket
        Given user is on "/client/index.php" page
        When user buys a "vip" ticket to the nearest movie
        Then user gets a QR code for his reservation with "3500" rubles price

    Scenario: Should not buy a ticket because of taken chair
        Given user is on "/client/index.php" page
        When user buys a nearest movie ticket and try to chose taken chair
        Then user can't click on the confirmation button