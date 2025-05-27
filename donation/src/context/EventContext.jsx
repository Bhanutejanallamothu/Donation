
    import React, { createContext, useContext, useEffect } from 'react';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';

    const EventContext = createContext();

    export const useEvents = () => useContext(EventContext);

    const sampleEvents = [
      {
        id: 'sample-1',
        name: 'Tech Conference 2025',
        date: new Date(2025, 7, 15, 9, 0, 0).toISOString(),
        location: 'Metro Convention Hall',
        description: 'Join us for the largest tech conference of the year, featuring keynote speakers from top tech companies, hands-on workshops, and networking opportunities. Explore the latest trends in AI, blockchain, and cloud computing.',
        capacity: 500,
        price: 99.99,
        attendees: [
          { name: 'Alice Johnson', email: 'alice@example.com', registrationId: 'sample-reg-1' },
          { name: 'Bob Smith', email: 'bob@example.com', registrationId: 'sample-reg-2' }
        ],
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f'
      },
      {
        id: 'sample-2',
        name: 'Summer Music Festival',
        date: new Date(2025, 6, 20, 14, 0, 0).toISOString(),
        location: 'Greenfield Park',
        description: 'Experience an unforgettable weekend of live music across multiple genres. Featuring international artists, local bands, food trucks, and art installations. Fun for all ages!',
        capacity: 2000,
        price: 75.00,
        attendees: [],
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
      },
      {
        id: 'sample-3',
        name: 'Art & Craft Workshop',
        date: new Date(2025, 5, 10, 10, 0, 0).toISOString(),
        location: 'Community Art Center',
        description: 'Unleash your creativity in our hands-on Art & Craft Workshop. Learn new skills like pottery, painting, and jewelry making from experienced artists. All materials provided.',
        capacity: 30,
        price: 45.50,
        attendees: [],
        image: 'https://images.unsplash.com/photo-1501426026826-31c667bdf23d'
      }
    ];

    export const EventProvider = ({ children }) => {
      const [events, setEvents] = useLocalStorage('events', []);
      const { toast } = useToast();

      useEffect(() => {
        if (events.length === 0) {
          setEvents(sampleEvents);
        }
      }, []);

      const addEvent = (event) => {
        const newEvent = { ...event, id: Date.now().toString(), attendees: [] };
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        toast({
          title: "Event Created!",
          description: `"${event.name}" has been successfully created.`,
          variant: "default",
        });
      };

      const getEventById = (id) => {
        return events.find(event => event.id === id);
      };
      
      const updateEvent = (updatedEvent) => {
        setEvents(prevEvents => 
          prevEvents.map(event => event.id === updatedEvent.id ? updatedEvent : event)
        );
        toast({
          title: "Event Updated!",
          description: `"${updatedEvent.name}" has been successfully updated.`,
        });
      };

      const deleteEvent = (eventId) => {
        const eventToDelete = events.find(e => e.id === eventId);
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        if (eventToDelete) {
          toast({
            title: "Event Deleted!",
            description: `"${eventToDelete.name}" has been successfully deleted.`,
            variant: "destructive",
          });
        }
      };
      
      const registerAttendee = (eventId, attendeeDetails) => {
        setEvents(prevEvents =>
          prevEvents.map(event => {
            if (event.id === eventId) {
              if (event.attendees.length < event.capacity) {
                const updatedAttendees = [...event.attendees, { ...attendeeDetails, registrationId: Date.now().toString() }];
                toast({
                  title: "Registration Successful!",
                  description: `You've successfully registered for "${event.name}".`,
                });
                return { ...event, attendees: updatedAttendees };
              } else {
                toast({
                  title: "Registration Failed",
                  description: `Sorry, "${event.name}" is already full.`,
                  variant: "destructive",
                });
                return event;
              }
            }
            return event;
          })
        );
      };


      return (
        <EventContext.Provider value={{ events, addEvent, getEventById, updateEvent, deleteEvent, registerAttendee }}>
          {children}
        </EventContext.Provider>
      );
    };
  