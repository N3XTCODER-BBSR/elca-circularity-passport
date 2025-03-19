const appsignal = require("@appsignal/nodejs");

new appsignal.Appsignal({
  active: true,
  name: "elca-app",
  disableDefaultInstrumentations: [
    // Add the following line inside the list
    "@opentelemetry/instrumentation-http",
  ]
});