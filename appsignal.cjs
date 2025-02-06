const { Appsignal } = require("@appsignal/nodejs");

new Appsignal({
  active: true,
  name: "elca-app",
  disableDefaultInstrumentations: [
    // Add the following line inside the list
    "@opentelemetry/instrumentation-http",
  ]
});