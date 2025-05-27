
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { DatePicker } from '@/components/ui/date-picker';
    import { useEvents } from '@/context/EventContext';
    import { motion } from 'framer-motion';
    import { CalendarPlus, MapPin, Users, DollarSign, Info } from 'lucide-react';

    const CreateEventPage = () => {
      const [eventName, setEventName] = useState('');
      const [eventDate, setEventDate] = useState(null);
      const [eventLocation, setEventLocation] = useState('');
      const [eventDescription, setEventDescription] = useState('');
      const [eventCapacity, setEventCapacity] = useState('');
      const [ticketPrice, setTicketPrice] = useState('');

      const { addEvent } = useEvents();
      const navigate = useNavigate();

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!eventName || !eventDate || !eventLocation || !eventDescription || !eventCapacity || !ticketPrice) {
          alert('Please fill in all fields.');
          return;
        }
        addEvent({
          name: eventName,
          date: eventDate.toISOString(),
          location: eventLocation,
          description: eventDescription,
          capacity: parseInt(eventCapacity),
          price: parseFloat(ticketPrice),
        });
        navigate('/events');
      };
      
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
      };

      return (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <Card className="shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl">Create New Event</CardTitle>
                <CardDescription className="text-lg text-gray-400">
                  Fill in the details below to bring your event to life.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="eventName" className="text-lg flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />Event Name</Label>
                    <Input
                      id="eventName"
                      type="text"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      placeholder="e.g., Annual Tech Conference"
                      className="text-lg p-3"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="eventDate" className="text-lg flex items-center"><CalendarPlus className="mr-2 h-5 w-5 text-primary" />Event Date</Label>
                    <DatePicker date={eventDate} setDate={setEventDate} className="text-lg p-3 w-full" />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="eventLocation" className="text-lg flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" />Location</Label>
                    <Input
                      id="eventLocation"
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="e.g., City Convention Center"
                      className="text-lg p-3"
                      required
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="eventCapacity" className="text-lg flex items-center"><Users className="mr-2 h-5 w-5 text-primary" />Capacity</Label>
                    <Input
                      id="eventCapacity"
                      type="number"
                      value={eventCapacity}
                      onChange={(e) => setEventCapacity(e.target.value)}
                      placeholder="e.g., 500"
                      className="text-lg p-3"
                      min="1"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="ticketPrice" className="text-lg flex items-center"><DollarSign className="mr-2 h-5 w-5 text-primary" />Ticket Price ($)</Label>
                    <Input
                      id="ticketPrice"
                      type="number"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(e.target.value)}
                      placeholder="e.g., 25.00"
                      className="text-lg p-3"
                      min="0"
                      step="0.01"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="eventDescription" className="text-lg flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />Description</Label>
                    <Textarea
                      id="eventDescription"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Provide a detailed description of your event..."
                      className="text-lg p-3 min-h-[150px]"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button type="submit" size="lg" className="w-full text-lg py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 transform hover:scale-105">
                      Create Event
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      );
    };

    export default CreateEventPage;
  