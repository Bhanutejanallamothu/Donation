
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Progress } from '@/components/ui/progress';
    import { motion } from 'framer-motion';
    import { FolderHeart as HandHeart, PlusSquare, ListChecks, ArrowRight, DollarSign, Users, TrendingUp, ShieldCheck } from 'lucide-react';
    import { useCampaigns } from '@/context/CampaignContext';
    import { useAuth } from '@/context/AuthContext';
    import { format, formatDistanceToNowStrict, differenceInDays, parseISO } from 'date-fns';

    const HomePage = () => {
      const { campaigns } = useCampaigns();
      const { user } = useAuth();
      
      const featuredCampaigns = campaigns
        .filter(campaign => differenceInDays(parseISO(campaign.endDate), new Date()) >= 0) // Active campaigns
        .sort((a, b) => (b.currentAmount / b.goalAmount) - (a.currentAmount / a.goalAmount)) // Sort by progress
        .slice(0, 3);

      const totalRaised = campaigns.reduce((sum, camp) => sum + (camp.currentAmount || 0), 0);
      const totalCampaigns = campaigns.length;
      const totalDonors = campaigns.reduce((sum, camp) => sum + (camp.donations?.length || 0), 0);


      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
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
            damping: 12
          },
        },
      };
      
      const StatCard = ({ title, value, icon, color }) => (
        <motion.div variants={itemVariants}>
            <Card className={`professional-card border-l-4 border-${color}-500 hover:shadow-xl`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground/80">{title}</CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <div className={`text-3xl font-bold text-${color}-500`}>{value}</div>
                    {/* <p className="text-xs text-muted-foreground">{description}</p> */}
                </CardContent>
            </Card>
        </motion.div>
      );

      return (
        <motion.div 
          className="space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.section 
            className="text-center py-16 bg-gradient-to-br from-primary/60 via-sky-500/50 to-emerald-500/50 dark:from-primary/40 dark:via-sky-500/30 dark:to-emerald-500/30 rounded-xl shadow-2xl overflow-hidden"
            variants={itemVariants}
          >
            <div className="relative bg-background/40 dark:bg-card/50 backdrop-blur-md py-10 px-6 rounded-lg inline-block max-w-3xl mx-auto">
              <HandHeart className="absolute -top-6 -left-6 w-20 h-20 text-pink-400 opacity-50 transform rotate-12" />
              <DollarSign className="absolute -bottom-6 -right-6 w-20 h-20 text-green-400 opacity-50 transform -rotate-12" />
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-5">
                Welcome to <br/> <span className="block text-5xl sm:text-6xl gradient-text">HopeFund</span>
              </h1>
              <p className="text-lg sm:text-xl text-foreground/80 dark:text-foreground/70 mb-8 max-w-xl mx-auto">
                Support causes you care about. Create campaigns, inspire hope, and make a tangible difference in the world.
              </p>
              <motion.div className="space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center" variants={itemVariants}>
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 text-md w-full sm:w-auto">
                  <Link to="/campaigns">
                    Browse Campaigns <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-primary text-primary hover:bg-primary/10 font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 text-md w-full sm:w-auto">
                  <Link to={user ? "/create-campaign" : "/register"}>
                    {user ? "Start a Campaign" : "Get Started"}
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="grid md:grid-cols-3 gap-4 sm:gap-6">
             <StatCard title="Total Raised" value={`$${totalRaised.toLocaleString()}`} icon={<TrendingUp className="w-8 h-8 text-green-500" />} color="green" />
             <StatCard title="Active Campaigns" value={totalCampaigns} icon={<ListChecks className="w-8 h-8 text-blue-500" />} color="blue" />
             <StatCard title="Unique Donors" value={totalDonors} icon={<Users className="w-8 h-8 text-purple-500" />} color="purple" />
          </motion.section>


          {featuredCampaigns.length > 0 && (
            <motion.section variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-foreground">Featured <span className="gradient-text">Campaigns</span></h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
                {featuredCampaigns.map(campaign => {
                  const progress = campaign.goalAmount > 0 ? (campaign.currentAmount / campaign.goalAmount) * 100 : 0;
                  const daysLeft = differenceInDays(parseISO(campaign.endDate), new Date());
                  return (
                    <motion.div key={campaign.id} variants={itemVariants}>
                      <Card className="h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden group professional-card flex flex-col">
                        <div className="relative h-52 w-full overflow-hidden">
                          <img  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={campaign.title} src="https://images.unsplash.com/photo-1584441405886-bc91be61e56a" />
                          <div className="absolute top-2 right-2 bg-card/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-foreground">
                            {daysLeft >= 0 ? `${daysLeft} days left` : 'Ended'}
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-xl sm:text-2xl truncate group-hover:text-primary transition-colors">{campaign.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm text-muted-foreground truncate">
                            By: {campaign.organization || 'Community Fundraiser'}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-3">
                          <p className="text-foreground/80 dark:text-foreground/70 line-clamp-2 text-sm sm:text-base">{campaign.description}</p>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="font-medium text-primary">${(campaign.currentAmount || 0).toLocaleString()} raised</span>
                              <span className="text-muted-foreground">of ${(campaign.goalAmount || 0).toLocaleString()}</span>
                            </div>
                            <Progress value={progress} className="w-full h-2" />
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg py-2.5">
                            <Link to={`/campaign/${campaign.id}`}>View & Donate</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
               {campaigns.length > 3 && (
                 <motion.div className="text-center mt-10" variants={itemVariants}>
                    <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10 font-semibold py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 text-base">
                        <Link to="/campaigns">Browse All Campaigns <ArrowRight className="ml-2 h-5 w-5" /></Link>
                    </Button>
                 </motion.div>
                )}
            </motion.section>
          )}
          
          <motion.section variants={itemVariants} className="py-12 bg-card/50 rounded-xl shadow-lg">
            <div className="container mx-auto px-6 text-center">
                <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-3">Secure & Transparent Giving</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    We prioritize the security of your donations and provide transparency on how funds are used. 
                    Join us in making a positive impact with confidence.
                </p>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="text-center py-10">
             <img  class="w-full max-w-2xl sm:max-w-3xl mx-auto rounded-xl shadow-xl border-2 border-border" alt="People collaborating for a charity event" src="https://images.unsplash.com/photo-1682009562551-419cbd18091b" />
          </motion.section>
        </motion.div>
      );
    };

    export default HomePage;
  