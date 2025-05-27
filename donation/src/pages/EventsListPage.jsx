
    import React, { useState, useMemo } from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { useEvents } from '@/context/EventContext';
    import { motion } from 'framer-motion';
    import { CalendarDays, MapPin, Users, DollarSign, AlertTriangle, Search, Filter } from 'lucide-react';

    const EventsListPage = () => {
      const { events } = useEvents();
      const [searchTerm, setSearchTerm] = useState('');
      const [filterDate, setFilterDate] = useState('');

      const filteredEvents = useMemo(() => {
        return events
          .filter(event => {
            const eventDate = new Date(event.date).toISOString().split('T')[0];
            const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  event.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDate = filterDate ? eventDate === filterDate : true;
            return matchesSearch && matchesDate;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date));
      }, [events, searchTerm, filterDate]);

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.05,
          },
        },
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
          },
        },
      };

      return (
        <motion.div 
          className="space-y-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-5xl font-bold gradient-text mb-6">Discover Amazing Events</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Browse through our curated list of events or search for something specific.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-slate-800/50 rounded-xl shadow-lg glassmorphism-card">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="text"
                placeholder="Search events by name, location, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 text-lg bg-slate-700/50 border-slate-600 focus:border-primary"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input 
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-10 py-3 text-lg bg-slate-700/50 border-slate-600 focus:border-primary w-full md:w-auto"
              />
            </div>
             {filterDate && (
                <Button onClick={() => setFilterDate('')} variant="ghost" className="text-accent hover:text-accent/80">Clear Date</Button>
             )}
          </motion.div>

          {filteredEvents.length === 0 ? (
             <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AlertTriangle className="mx-auto h-24 w-24 text-accent mb-6" />
              <h2 className="text-4xl font-semibold mb-4 gradient-text">No Events Found</h2>
              <p className="text-xl text-gray-400 mb-8">
                Sorry, we couldn't find any events matching your criteria. Try adjusting your search or filters.
              </p>
              {events.length > 0 && ( /* Show "Create" button only if there are events at all, implying filters are the issue */
                 <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                   <Link to="/create-event">Or Create a New Event</Link>
                 </Button>
              )}
              {events.length === 0 && ( /* Initial state with no events ever */
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <Link to="/create-event">Create Your First Event</Link>
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <Card className="h-full flex flex-col overflow-hidden transform hover:scale-[1.03] transition-transform duration-300 hover:shadow-primary/40 glassmorphism-card group">
                    <div className="h-48 w-full overflow-hidden">
                        <img  src={event.image || `https://source.unsplash.com/random/400x300?event,${event.name.split(" ")[0]}`} alt={event.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-2xl truncate">{event.name}</CardTitle>
                      <CardDescription className="text-gray-400 flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-primary" />
                        {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-3">
                      <div className="flex items-center text-gray-300">
                        <MapPin className="mr-2 h-5 w-5 text-accent flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <p className="text-gray-400 line-clamp-3">{event.description}</p>
                      <div className="flex justify-between items-center text-sm pt-2">
                        <span className="flex items-center text-green-400 font-medium">
                          <DollarSign className="mr-1 h-4 w-4" /> Price: ${parseFloat(event.price).toFixed(2)}
                        </span>
                        <span className="flex items-center text-blue-400 font-medium">
                          <Users className="mr-1 h-4 w-4" /> Capacity: {event.capacity}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all text-base py-3">
                        <Link to={`/event/${event.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      );
    };

    export default EventsListPage;
  