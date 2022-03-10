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
//Fetch active context and create a child span
  const ctx = opentelemetry.trace.setSpan(opentelemetry.context.active(), parent);
  const span = tracer.startSpan('outerLoop', undefined, ctx);
  span.setAttribute("outer iteration", i.toString());
  if ( i > 10){
    span.recordException("I've done enough work")
    span.setStatus({
      code: opentelemetry.SpanStatusCode.ERROR,
      message: 'Error.'
    })
   span.end()
   throw 'Array too large! Stopping execution';
   break;
  }
// Last i elements are already in place  
   for(var j = 0; j < ( arr.length - i -1 ); j++){
     
     //Create innermost span
     //Fetch active context and create a child span
     const ctx2 = opentelemetry.trace.setSpan(opentelemetry.context.active(), span);
     const innerSpan = tracer.startSpan('innerLoop', undefined, ctx2);
     innerSpan.setAttribute("inner iteration", j.toString());
     // Checking if the item at present iteration 
     // is greater than the next iteration
     if(arr[j] > arr[j+1]){
         
       // If the condition is true then swap them
       var temp = arr[j]
       arr[j] = arr[j + 1]
       arr[j+1] = temp

       // If the condition is true then add an event
       innerSpan.addEvent('swapLog', {
         'log.severity': 'event',
         'log.message': 'Swap occurred',
         'iteration': j.toString(),
       });
     }
     //End second loop span
     innerSpan.end();
   }
   //End first loop span
   span.end();
 }
 // Print the sorted array
 console.log(arr);
}
  
// This is our unsorted array
var arr = [234, 43, 55, 63,  5, 6, 235, 547, 100, 232, 14, 42, 1000, 4329, 433];
  
  
// Now pass this array to the bblSort() function
  try {
    bblSort(arr);
  } catch(e) {
    parent.recordException(e),
    parent.setStatus({ code: opentelemetry.SpanStatusCode.ERROR })
  }

// Be sure to end the span.
parent.end();

// give some time before it is closed
setTimeout(() => {
  // flush and close the connection.
  exporter.shutdown();
}, 2000);