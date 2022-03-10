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
const accessToken = '<LS_ACCESS_TOKEN>';
const exporter = new OTLPTraceExporter({
  url: 'https://ingest.lightstep.com/traces/otlp/v0.9',
  headers: {
    'Lightstep-Access-Token': accessToken
  },
});

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'basic-service',
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
//Create child span from active context
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parent);
  const span = tracer.startSpan('firstLoop', undefined, ctx);
  span.setAttribute("iteration", i.toString());
// Last i elements are already in place  
   for(var j = 0; j < ( arr.length - i -1 ); j++){
     //Create innermost span
     const innerSpan = tracer.startSpan('secondLoop', undefined, opentelemetry.context.active());
     // Checking if the item at present iteration 
     // is greater than the next iteration
     if(arr[j] > arr[j+1]){
         
       // If the condition is true then swap them
       var temp = arr[j]
       arr[j] = arr[j + 1]
       arr[j+1] = temp
     }
     //End second loop span
     span.end();
   }
   //End first loop span
   span.end();
 }
 // Print the sorted array
 console.log(arr);
}
  
// This is our unsorted array
var arr = [234, 43, 55, 63,  5, 6, 235, 547];
  
  
// Now pass this array to the bblSort() function
bblSort(arr);

// Be sure to end the span.
parent.end();

// give some time before it is closed
setTimeout(() => {
  // flush and close the connection.
  exporter.shutdown();
}, 2000);








// for (let i = 0; i < 10; i += 1) {
//   doWork(parentSpan);
// }
// // Be sure to end the span.
// parentSpan.end();


// function doWork(parent) {
//   // Start another span. In this example, the main method already started a
//   // span, so that'll be the parent span, and this will be a child span.
//   const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parent);
//   const span = tracer.startSpan('doWork', undefined, ctx);

//   // simulate some random work.
//   for (let i = 0; i <= Math.floor(Math.random() * 40000000); i += 1) {
//     // empty
//   }
//   // Set attributes to the span.
//   span.setAttribute('key', 'value');

//   span.setAttribute('mapAndArrayValue', [
//     0, 1, 2.25, 'otel', {
//       foo: 'bar',
//       baz: 'json',
//       array: [1, 2, 'boom'],
//     },
//   ]);

//   // Annotate our span to capture metadata about our operation
//   span.addEvent('invoking doWork');

//   // end span
//   span.end();
// }
