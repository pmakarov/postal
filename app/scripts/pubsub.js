/**
 * Created by paulmakarov on 6/20/15.
 */
        // Define the publish and subscribe jQuery extensions.
        // These will allow for pub-sub without the overhead
        // of DOM-related eventing.
        (function( $ ){
            "use strict";
            // Create a collection of subscriptions which are just a
            // combination of event types and event callbacks
            // that can be alerted to published events.
            var subscriptions = {};


            // Create the subscribe extensions. This will take the
            // subscriber (context for callback execution), the
            // event type, and a callback to execute.
            $.subscribe = function( eventType, subscriber, callback ){
                // Check to see if this event type has a collection
                // of subscribers yet.
                if (!(eventType in subscriptions)){

                    // Create a collection for this event type.
                    subscriptions[ eventType ] = [];

                }

                // Check to see if the type of callback is a string.
                // If it is, we are going to convert it to a method
                // call.
                if (typeof( callback ) == "string"){

                    // Convert the callback name to a reference to
                    // the callback on the subscriber object.
                    callback = subscriber[ callback ];

                }

                // Add this subscriber for the given event type..
                subscriptions[ eventType ].push({
                    subscriber: subscriber,
                    callback: callback
                });
            };


            // Create the unsubscribe extensions. This allows a
            // subscriber to unbind its previously-bound callback.
            $.unsubscribe = function( eventType, callback ){
                // Check to make sure the event type collection
                // currently exists.
                if (
                    !(eventType in subscriptions) ||
                    !subscriptions[ eventType ].length
                    ){

                    // Return out - if there's no subscriber
                    // collection for this event type, there's
                    // nothing for us to unbind.
                    return;

                }

                // Map the current subscription collection to a new
                // one that doesn't have the given callback.
                subscriptions[ eventType ] = $.map(
                    subscriptions[ eventType ],
                    function( subscription ){
                        // Check to see if this callback matches the
                        // one we are unsubscribing. If it does, we
                        // are going to want to remove it from the
                        // collection.
                        if (subscription.callback == callback){

                            // Return null to remove this matching
                            // callback from the subsribers.
                            return( null );

                        } else {

                            // Return the given subscription to keep
                            // it in the subscribers collection.
                            return( subscription );

                        }
                    }
                );
            };


            // Create the publish extension. This takes the
            // publishing object, the type of event, and any
            // additional data that need to be published with the
            // event.
            $.publish = function( publisher, eventType, data ){
                // Package up the event into a simple object.
                var event = {
                    type: eventType,
                    target: publisher,
                    data: (data || []),
                    result: null
                };

                // Now, create the arguments that we are going to
                // use to invoke the subscriber's callback.
                var eventArguments = [ event ].concat( event.data );

                // Loop over the subsribers for this event type
                // and invoke their callbacks.
                $.each(
                    subscriptions[ eventType ],
                    function( index, subscription ){

                        // Invoke the callback in the subscription
                        // context and store the result of the
                        // callback in the event.
                        event.result = subscription.callback.apply(
                            subscription.subscriber,
                            eventArguments
                        );

                        // Return the result of the callback to allow
                        // the subscriber to cacnel the immediate
                        // propagation of the event to other
                        // subscribers to this event type.
                        return( event.result );

                    }
                );

                // Return the event object. This event object may have
                // been augmented by any one of the subsrcibers.
                return( event );
            };


        })( jQuery );