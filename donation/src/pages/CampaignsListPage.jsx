
    import React, { useState, useMemo } from 'react';
    import { Link } from 'react-router-dom';
    import { useCampaigns } from '@/context/CampaignContext';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Progress } from '@/components/ui/progress';
    import { motion, AnimatePresence } from 'framer-motion';
    import { PlusSquare, DollarSign, Search, Filter, CalendarClock, TrendingUp, ListFilter } from 'lucide-react';
    import { format, parseISO, differenceInDays } from 'date-fns';

    const CampaignsListPage = () => {
      const { campaigns } = useCampaigns();
      const [searchTerm, setSearchTerm] = useState('');
      const [filterStatus, setFilterStatus] = useState('all'); 
      const [sortOrder, setSortOrder] = useState('endDateAsc'); 

      const filteredAndSortedCampaigns = useMemo(() => {
        let filtered = campaigns.filter(campaign => 
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (campaign.description && campaign.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (campaign.beneficiary && campaign.beneficiary.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (campaign.organization && campaign.organization.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        if (filterStatus !== 'all') {
          const now = new Date();
          if (filterStatus === 'active') {
            filtered = filtered.filter(c => parseISO(c.endDate) >= now);
          } else if (filterStatus === 'ended') {
            filtered = filtered.filter(c => parseISO(c.endDate) < now);
          }
        }
        
        return filtered.sort((a, b) => {
          const dateA = parseISO(a.endDate);
          const dateB = parseISO(b.endDate);
          const progressA = a.goalAmount > 0 ? (a.currentAmount / a.goalAmount) : 0;
          const progressB = b.goalAmount > 0 ? (b.currentAmount / b.goalAmount) : 0;

          switch (sortOrder) {
            case 'endDateAsc': return dateA - dateB;
            case 'endDateDesc': return dateB - dateA;
            case 'goalAmountAsc': return a.goalAmount - b.goalAmount;
            case 'goalAmountDesc': return b.goalAmount - a.goalAmount;
            case 'progressDesc': return progressB - progressA; // Highest progress first
            case 'recent': return parseISO(b.id) - parseISO(a.id); // Assuming ID is timestamp based
            default: return 0;
          }
        });
      }, [campaigns, searchTerm, filterStatus, sortOrder]);
      
      const containerVariants = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
      };

      return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
          <Card className="professional-card shadow-lg overflow-hidden">
            <CardHeader className="bg-card/50 p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <motion.div initial={{opacity:0, x: -20}} animate={{opacity:1, x:0}} transition={{delay: 0.1}}>
                        <h1 className="text-3xl font-bold gradient-text flex items-center"><ListFilter className="mr-3 h-8 w-8"/> Support a Cause</h1>
                        <p className="text-muted-foreground">Browse active campaigns and make a difference today.</p>
                    </motion.div>
                    <motion.div initial={{opacity:0, x: 20}} animate={{opacity:1, x:0}} transition={{delay: 0.2}}>
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Link to="/create-campaign"><PlusSquare className="mr-2 h-5 w-5" /> Start a Campaign</Link>
                        </Button>
                    </motion.div>
                </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-6">
                <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 items-end">
                    <div className="relative">
                        <Label htmlFor="search" className="text-sm font-medium text-foreground/80">Search Campaigns</Label>
                        <Search className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="search"
                            type="text" 
                            placeholder="Search by title, beneficiary..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 professional-input mt-1"
                        />
                    </div>
                     <div>
                        <Label htmlFor="filterStatus" className="text-sm font-medium text-foreground/80">Status</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                            <SelectTrigger className="w-full professional-input mt-1">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Campaigns</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="ended">Ended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div>
                        <Label htmlFor="sortOrder" className="text-sm font-medium text-foreground/80">Sort By</Label>
                        <Select value={sortOrder} onValueChange={setSortOrder}>
                            <SelectTrigger className="w-full professional-input mt-1">
                                <SelectValue placeholder="Sort campaigns" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="endDateAsc">End Date (Soonest)</SelectItem>
                                <SelectItem value="endDateDesc">End Date (Latest)</SelectItem>
                                <SelectItem value="progressDesc">Progress (Most Funded)</SelectItem>
                                <SelectItem value="goalAmountDesc">Goal (Highest)</SelectItem>
                                <SelectItem value="goalAmountAsc">Goal (Lowest)</SelectItem>
                                <SelectItem value="recent">Recently Added</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </motion.div>
            </CardContent>
          </Card>

          {filteredAndSortedCampaigns.length === 0 ? (
             <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="text-center py-12">
                <Filter className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-semibold text-foreground">No Campaigns Found</h2>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or start a new campaign.</p>
                <Button asChild className="mt-6">
                    <Link to="/create-campaign"><PlusSquare className="mr-2 h-4 w-4" /> Create Campaign</Link>
                </Button>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            >
              <AnimatePresence>
                {filteredAndSortedCampaigns.map(campaign => {
                  const progress = campaign.goalAmount > 0 ? Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100) : 0;
                  const daysLeft = differenceInDays(parseISO(campaign.endDate), new Date());
                  const isEnded = daysLeft < 0;

                  return (
                  <motion.div key={campaign.id} variants={itemVariants} layout>
                    <Card className={`professional-card hover:shadow-xl transition-shadow duration-300 flex flex-col h-full overflow-hidden group ${isEnded ? 'opacity-70' : ''}`}>
                      <div className="relative h-48 w-full overflow-hidden">
                        <img  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={campaign.title} src="https://images.unsplash.com/photo-1584441405886-bc91be61e56a" />
                        <div className={`absolute top-2 right-2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold ${isEnded ? 'text-destructive' : 'text-foreground'}`}>
                          {isEnded ? 'Ended' : `${daysLeft} days left`}
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                          <Link to={`/campaign/${campaign.id}`} className="hover:underline">{campaign.title}</Link>
                        </CardTitle>
                         <CardDescription className="text-xs text-muted-foreground truncate">
                            For: {campaign.beneficiary} {campaign.organization ? `(by ${campaign.organization})` : ''}
                         </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-3 pt-2">
                        <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-primary">${(campaign.currentAmount || 0).toLocaleString()}</span>
                            <span className="text-muted-foreground">of ${(campaign.goalAmount || 0).toLocaleString()} goal</span>
                          </div>
                          <Progress value={progress} className="w-full h-1.5" indicatorClassName={isEnded && progress < 100 ? 'bg-destructive' : ''} />
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3 border-t border-border/50">
                        <Button asChild className={`w-full ${isEnded && progress < 100 ? 'bg-muted hover:bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}>
                          <Link to={`/campaign/${campaign.id}`} disabled={isEnded && progress < 100}>
                            {isEnded ? (progress >=100 ? 'View Results' : 'Campaign Ended') : 'Donate Now'}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      );
    };

    export default CampaignsListPage;
  