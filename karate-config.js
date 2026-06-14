function fn() {
  var env = karate.env || 'dev';
  var config = {
    baseUrl: 'https://automationintesting.online/'
  };
  return config;
}