
    import React, { useState } from 'react';
    import { useParams, useNavigate, Link } from 'react-router-dom';
    import { useEvents } from '@/context/EventContext';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { CalendarDays, MapPin, Users, DollarSign, Edit, Trash2, UserPlus, Ticket, ListChecks, ArrowLeft } from 'lucide-react';

    const EventDetailsPage = () => {
      const { id } = useParams();
      const navigate = useNavigate();
      const { getEventById, deleteEvent, registerAttendee } = useEvents();
      const { toast } = useToast();
      const event = getEventById(id);

      const [registrantName, setRegistrantName] = useState('');
      const [registrantEmail, setRegistrantEmail] = useState('');

      if (!event) {
        return (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-destructive">Event not found.</h2>
            <Button onClick={() => navigate('/events')} className="mt-4">Back to Events</Button>
          </div>
        );
      }
      
      const handleDelete = () => {
        deleteEvent(id);
        navigate('/events');
      };

      const handleRegister = (e) => {
        e.preventDefault();
        if (!registrantName || !registrantEmail) {
          toast({ title: "Missing Information", description: "Please provide name and email.", variant: "destructive" });
          return;
        }
        registerAttendee(id, { name: registrantName, email: registrantEmail });
        setRegistrantName('');
        setRegistrantEmail('');
      };
      
      const attendeesCount = event.attendees ? event.attendees.length : 0;
      const spotsLeft = event.capacity - attendeesCount;

      const pageVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } }
      };

      const itemVariants = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
      };

      return (
        <motion.div 
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="max-w-4xl mx-auto"
        >
          <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 bg-background/70 hover:bg-background/90">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Card className="overflow-hidden shadow-2xl">
            <motion.div variants={itemVariants}>
              <div className="h-64 md:h-80 relative">
                <img  class="w-full h-full object-cover" alt={`Promotional image for ${event.name}`} src="https://images.unsplash.com/photo-1494953947651-6dfa8557072d" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <CardHeader className="absolute bottom-0 left-0 p-6 w-full">
                  <CardTitle className="text-4xl md:text-5xl font-bold text-white shadow-text">{event.name}</CardTitle>
                </CardHeader>
              </div>
            </motion.div>
            
            <CardContent className="p-6 md:p-8 space-y-6">
              <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-6 text-lg">
                <div className="flex items-start space-x-3">
                  <CalendarDays className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-300">Date & Time</p>
                    <p className="text-gray-100">{new Date(event.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-300">Location</p>
                    <p className="text-gray-100">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-300">Price</p>
                    <p className="text-gray-100">${parseFloat(event.price).toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-300">Capacity & Availability</p>
                    <p className="text-gray-100">{attendeesCount} / {event.capacity} attendees ({spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'})</p>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h3 className="text-2xl font-semibold mb-2 gradient-text">About this Event</h3>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{event.description}</p>
              </motion.div>

              {spotsLeft > 0 && (
                <motion.div variants={itemVariants}>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                        <Ticket className="mr-2 h-5 w-5" /> Register for this Event
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Register for {event.name}</DialogTitle>
                        <DialogDescription>
                          Fill in your details to secure your spot. Only {spotsLeft} spots remaining!
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleRegister} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="name" className="text-right">Name</Label>
                          <Input id="name" value={registrantName} onChange={(e) => setRegistrantName(e.target.value)} className="col-span-3" placeholder="Your Name" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="email" className="text-right">Email</Label>
                          <Input id="email" type="email" value={registrantEmail} onChange={(e) => setRegistrantEmail(e.target.value)} className="col-span-3" placeholder="your@email.com" required />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit">Register</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </motion.div>
              )}
              {spotsLeft <= 0 && (
                <motion.p variants={itemVariants} className="text-xl font-semibold text-center text-destructive py-4 px-6 bg-destructive/10 rounded-md">
                  This event is currently full.
                </motion.p>
              )}

              {event.attendees && event.attendees.length > 0 && (
                <motion.div variants={itemVariants}>
                  <h3 className="text-2xl font-semibold mb-4 gradient-text flex items-center"><ListChecks className="mr-2 h-6 w-6 text-primary"/>Registered Attendees ({attendeesCount})</h3>
                  <div className="max-h-60 overflow-y-auto bg-slate-800/50 p-4 rounded-lg space-y-2">
                    {event.attendees.map(attendee => (
                      <div key={attendee.registrationId} className="p-3 bg-slate-700/70 rounded-md shadow">
                        <p className="font-medium text-gray-200">{attendee.name}</p>
                        <p className="text-sm text-gray-400">{attendee.email}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </CardContent>
            <CardFooter className="p-6 md:p-8 bg-slate-800/30 border-t border-slate-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <Button variant="outline" className="w-full sm:w-auto hover:bg-primary/10 hover:text-primary border-primary text-primary">
                <Edit className="mr-2 h-4 w-4" /> Edit Event (Coming Soon)
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the event "{event.name}" and all its data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Yes, delete event</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default EventDetailsPage;
  