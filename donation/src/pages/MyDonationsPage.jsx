
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { useCampaigns } from '@/context/CampaignContext';
    import { useAuth } from '@/context/AuthContext';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { motion } from 'framer-motion';
    import { Gift, DollarSign, CalendarDays, FolderHeart as SearchHeart } from 'lucide-react';
    import { format, parseISO } from 'date-fns';

    const MyDonationsPage = () => {
        const { getUserDonations } = useCampaigns();
        const { user } = useAuth();
        const donations = getUserDonations();

        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
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

        if (!user) {
            return (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-center py-10"
                >
                    <h1 className="text-2xl font-semibold">Please log in to view your donations.</h1>
                    <Button asChild className="mt-4">
                        <Link to="/login">Login</Link>
                    </Button>
                </motion.div>
            );
        }

        return (
            <motion.div 
                className="max-w-4xl mx-auto space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <Card className="professional-card shadow-xl">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold gradient-text flex items-center">
                                <Gift className="mr-3 h-8 w-8 text-primary" /> My Donation History
                            </CardTitle>
                            <CardDescription>
                                Thank you for your generosity, {user.name}! Here's a record of your contributions.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </motion.div>

                {donations.length === 0 ? (
                    <motion.div 
                        variants={itemVariants} 
                        className="text-center py-12 bg-card rounded-lg shadow-md"
                    >
                        <SearchHeart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h2 className="text-2xl font-semibold text-foreground">No Donations Yet</h2>
                        <p className="text-muted-foreground mt-2">You haven't made any donations. Find a cause to support!</p>
                        <Button asChild className="mt-6">
                            <Link to="/campaigns">Browse Campaigns</Link>
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div 
                        className="space-y-4"
                        variants={containerVariants}
                    >
                        {donations.map(donation => (
                            <motion.div key={donation.id || donation.date} variants={itemVariants}>
                                <Card className="professional-card hover:shadow-lg transition-shadow">
                                    <CardHeader className="flex flex-row items-start gap-4">
                                        {donation.campaignImage && (
                                             <img  class="w-20 h-20 md:w-24 md:h-24 rounded-md object-cover" alt={donation.campaignTitle} src="https://images.unsplash.com/photo-1662561558497-f0bb2861edba" />
                                        )}
                                        <div className="flex-grow">
                                            <CardTitle className="text-xl hover:text-primary">
                                                <Link to={`/campaign/${donation.campaignId}`}>{donation.campaignTitle}</Link>
                                            </CardTitle>
                                            <CardDescription className="text-sm text-muted-foreground">Donated on: {format(parseISO(donation.date), 'PPP p')}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex justify-between items-center pt-0 pb-4 px-6">
                                        <div className="flex items-center text-xl font-semibold text-green-500">
                                            <DollarSign className="mr-1 h-6 w-6"/> {parseFloat(donation.amount).toFixed(2)}
                                        </div>
                                        <Button variant="outline" size="sm" asChild>
                                            <Link to={`/campaign/${donation.campaignId}`}>View Campaign</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        );
    };

    export default MyDonationsPage;
  