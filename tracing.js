'use strict';

const opentelemetry = require('@opentelemetry/api');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes, SemanticAttributes } = require('@opentelemetry/semantic-conventions');

// const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-grpc');
// const { OTLPTraceExporter } = require('@opentelemetry/exporter-otlp-proto');

// opentelemetry.diag.setLogger(
//   new opentelemetry.DiagConsoleLogger(),
//   opentelemetry.DiagLogLevel.DEBUG,
// );

// Add Lightstep access token here
const accessToken = '<accessToken>';
const exporter = new OTLPTraceExporter({
  url: 'https://ingest.lightstep.com/traces/otlp/v0.9',
  headers: {
    'Lightstep-Access-Token': accessToken
  },
});

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'Instructor-service',
  }),
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

const tracer = opentelemetry.trace.getTracer('example-otlp-exporter-node');

// Create a span. A span must be closed.
const parent = tracer.startSpan('parent', {
  attributes: {
  "machineName": "InstructorMachine",
  "owner": "#MyServiceTeam",
  "number": "3",
  }
});


// Creating the bblSort function
 function bblSort(arr){
     
 for(var i = 0; i < arr.length; i++){
// Last i elements are already in place  
   for(var j = 0; j < ( arr.length - i -1 ); j++){
     
     // Checking if the item at present iteration 
     // is greater than the next iteration
     if(arr[j] > arr[j+1]){
         
       // If the condition is true then swap them
       var temp = arr[j]
       arr[j] = arr[j + 1]
       arr[j+1] = temp
     }
   }
 }
 // Print the sorted array
 console.log(arr);
}
  
// This is our unsorted array
var arr = [234, 43, 55, 63,  5, 6, 235];
  
  
// Now pass this array to the bblSort() function
  bblSort(arr);
  
// Be sure to end the span.
parent.end();

// give some time before it is closed
setTimeout(() => {
  // flush and close the connection.
  exporter.shutdown();
}, 2000);