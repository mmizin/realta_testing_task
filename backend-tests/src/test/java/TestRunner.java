import com.intuit.karate.junit5.Karate;

class TestRunner {

    @Karate.Test
    Karate testBranding() {
        return Karate.run("classpath:branding");
    }

    @Karate.Test
    Karate testRoom() {
        return Karate.run("classpath:room");
    }

    @Karate.Test
    Karate testBooking() {
        return Karate.run("classpath:booking");
    }
}
