
    import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
    import { useCampaigns } from '@/context/CampaignContext';
    import { useAuth } from '@/context/AuthContext';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { DatePicker } from '@/components/ui/date-picker';
    import { Progress } from '@/components/ui/progress';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { ArrowLeft, Edit3, Trash2, CalendarClock, Target, Users, DollarSign, Building, Gift, ListChecks, Info, Image as ImageIcon, Save } from 'lucide-react';
    import { format, parseISO, differenceInDays, formatDistanceToNowStrict } from 'date-fns';

    const CampaignDetailsPage = () => {
      const { id } = useParams();
      const navigate = useNavigate();
      const reactRouterLocation = useLocation(); // Changed variable name
      const { getCampaignById, updateCampaign, deleteCampaign, addDonation } = useCampaigns();
      const { user } = useAuth();
      const { toast } = useToast();

      const [campaign, setCampaign] = useState(null);
      const [isEditing, setIsEditing] = useState(false);
      
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [goalAmount, setGoalAmount] = useState('');
      const [beneficiary, setBeneficiary] = useState('');
      const [organization, setOrganization] = useState('');
      const [endDate, setEndDate] = useState(null);
      const [image, setImage] = useState('');

      const [donationAmount, setDonationAmount] = useState('');
      const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
      
      useEffect(() => {
        const currentCampaign = getCampaignById(id);
        if (currentCampaign) {
          setCampaign(currentCampaign);
          setTitle(currentCampaign.title);
          setDescription(currentCampaign.description || '');
          setGoalAmount(currentCampaign.goalAmount.toString());
          setBeneficiary(currentCampaign.beneficiary || '');
          setOrganization(currentCampaign.organization || '');
          setEndDate(parseISO(currentCampaign.endDate));
          setImage(currentCampaign.image || '');
        } else {
          toast({ title: "Campaign not found", variant: "destructive" });
          navigate('/campaigns');
        }
      }, [id, getCampaignById, navigate, toast]);

      const handleUpdate = (e) => {
        e.preventDefault();
        if (!title || !goalAmount || !beneficiary || !endDate || !description) {
          toast({ title: "Missing Information", description: "All required fields must be filled.", variant: "destructive" });
          return;
        }
        const updatedCampaignData = { 
            ...campaign, 
            title, 
            description, 
            goalAmount: parseFloat(goalAmount),
            beneficiary,
            organization,
            endDate: endDate.toISOString(), 
            image
        };
        updateCampaign(updatedCampaignData);
        setCampaign(updatedCampaignData); 
        setIsEditing(false);
      };
      
      const handleDelete = () => {
        if(deleteCampaign(id)) {
            navigate('/campaigns');
        }
      };

      const handleDonate = (e) => {
        e.preventDefault();
        const amount = parseFloat(donationAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({ title: "Invalid Amount", description: "Please enter a valid donation amount.", variant: "destructive" });
            return;
        }
        if (!user) {
            toast({ title: "Login Required", description: "Please log in to make a donation.", variant: "destructive"});
            navigate('/login', { state: { from: reactRouterLocation } }); // Used reactRouterLocation
            return;
        }
        addDonation(id, { donorName: user.name, donorEmail: user.email, amount });
        setDonationAmount('');
        setIsDonateDialogOpen(false);
        const updatedCampaign = getCampaignById(id);
        if(updatedCampaign) setCampaign(updatedCampaign);
      };
      
      if (!campaign) {
        return <div className="text-center py-10">Loading campaign details...</div>;
      }

      const progress = campaign.goalAmount > 0 ? Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100) : 0;
      const daysLeft = differenceInDays(parseISO(campaign.endDate), new Date());
      const isCampaignEnded = daysLeft < 0;
      const canEdit = user && user.email === campaign.creatorEmail;

      const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
        exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
      };
      
      const inputMotionProps = {
        whileHover: { scale: 1.01 },
        whileFocus: { scale: 1.01, boxShadow: "0px 0px 6px rgba(var(--primary-rgb), 0.4)" }
      };

      return (
        <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="max-w-3xl mx-auto">
          <Button variant="outline" onClick={() => navigate('/campaigns')} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
          </Button>

          <Card className="professional-card shadow-xl overflow-hidden">
            {!isEditing ? (
              <>
                <div className="relative h-60 md:h-72 w-full">
                    <img  class="w-full h-full object-cover" alt={campaign.title} src="https://images.unsplash.com/photo-1697887940181-5336186a0978" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                        <CardTitle className="text-3xl md:text-4xl font-bold text-white mb-1 shadow-lg">{campaign.title}</CardTitle>
                        {campaign.organization && <CardDescription className="text-md text-gray-200 shadow-md">By {campaign.organization}</CardDescription>}
                    </div>
                </div>
                <CardContent className="pt-6 space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="font-semibold text-primary">
                            ${(campaign.currentAmount || 0).toLocaleString()} raised
                        </span>
                        <span className="text-muted-foreground">
                            ${(campaign.goalAmount || 0).toLocaleString()} goal
                        </span>
                    </div>
                    <Progress value={progress} className="w-full h-3 mb-3" />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{Math.round(progress)}% funded</span>
                        <span>
                            {isCampaignEnded ? 'Campaign Ended' : `${daysLeft} days left`}
                        </span>
                    </div>
                  </div>
                  
                  <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
                    <p className="text-foreground/90">{campaign.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="flex items-center">
                      <Target className="mr-3 h-5 w-5 text-primary/80" />
                      <div>
                        <span className="font-medium text-foreground/90">Beneficiary:</span>
                        <span className="ml-1 text-foreground/80">{campaign.beneficiary}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CalendarClock className="mr-3 h-5 w-5 text-primary/80" />
                      <div>
                        <span className="font-medium text-foreground/90">Ends:</span>
                        <span className="ml-1 text-foreground/80">{format(parseISO(campaign.endDate), 'PPP')}</span>
                      </div>
                    </div>
                  </div>

                  {!isCampaignEnded && (
                    <Button size="lg" className="w-full mt-4 text-lg py-3 bg-green-600 hover:bg-green-700" onClick={() => setIsDonateDialogOpen(true)}>
                        <Gift className="mr-2 h-5 w-5"/> Donate Now
                    </Button>
                  )}
                  {isCampaignEnded && (
                     <p className="text-center font-semibold text-lg text-muted-foreground p-3 bg-muted/50 rounded-md">
                        This campaign has ended. Thank you to all donors!
                    </p>
                  )}
                  
                  {(campaign.donations?.length || 0) > 0 && (
                    <div className="pt-4">
                        <h4 className="text-lg font-semibold mb-2 text-foreground flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary"/>Recent Donations</h4>
                        <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs bg-muted/30 p-3 rounded-md">
                            {(campaign.donations || []).slice().reverse().slice(0,5).map(d => (
                                <div key={d.id || d.date} className="flex justify-between items-center p-1.5 bg-card/50 rounded">
                                    <span>{d.donorName || 'Anonymous'}</span>
                                    <span className="font-semibold text-primary/90">${parseFloat(d.amount).toLocaleString()}</span>
                                    <span className="text-muted-foreground/70">{formatDistanceToNowStrict(parseISO(d.date), {addSuffix: true})}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}

                </CardContent>
                {canEdit && (
                    <CardFooter className="border-t border-border/50 pt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                        <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full sm:w-auto">
                        <Edit3 className="mr-2 h-4 w-4" /> Edit Campaign
                        </Button>
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full sm:w-auto">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Campaign
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete "{campaign.title}". This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Yes, delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                )}
              </>
            ) : (
              <form onSubmit={handleUpdate}>
                <CardHeader className="border-b border-border/50 pb-4">
                  <CardTitle className="text-2xl font-semibold gradient-text">Edit Campaign</CardTitle>
                  <CardDescription>Update the details of your campaign.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium flex items-center"><Target className="mr-2 h-4 w-4"/>Title</Label>
                    <motion.div {...inputMotionProps}>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 professional-input" required />
                    </motion.div>
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-sm font-medium flex items-center"><Info className="mr-2 h-4 w-4"/>Description</Label>
                    <motion.div {...inputMotionProps}>
                    <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-[100px] professional-input" required/>
                    </motion.div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="goalAmount" className="text-sm font-medium flex items-center"><DollarSign className="mr-2 h-4 w-4"/>Goal Amount ($)</Label>
                        <motion.div {...inputMotionProps}>
                        <Input id="goalAmount" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} className="mt-1 professional-input" min="1" required/>
                        </motion.div>
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-sm font-medium flex items-center"><CalendarClock className="mr-2 h-4 w-4"/>End Date</Label>
                      <motion.div {...inputMotionProps}>
                      <DatePicker date={endDate} setDate={setEndDate} className="mt-1 w-full professional-input" />
                      </motion.div>
                    </div>
                  </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="beneficiary" className="text-sm font-medium flex items-center"><Users className="mr-2 h-4 w-4"/>Beneficiary</Label>
                        <motion.div {...inputMotionProps}>
                        <Input id="beneficiary" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} className="mt-1 professional-input" required/>
                        </motion.div>
                     </div>
                    <div>
                      <Label htmlFor="organization" className="text-sm font-medium flex items-center"><Building className="mr-2 h-4 w-4"/>Organization (Optional)</Label>
                      <motion.div {...inputMotionProps}>
                      <Input id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} className="mt-1 professional-input" />
                      </motion.div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="image" className="text-sm font-medium flex items-center"><ImageIcon className="mr-2 h-4 w-4"/>Image URL (Optional)</Label>
                    <motion.div {...inputMotionProps}>
                    <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} className="mt-1 professional-input" />
                    </motion.div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-border/50 pt-4 flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="px-5 py-2">Cancel</Button>
                  <Button type="submit" className="px-5 py-2 bg-primary hover:bg-primary/90"><Save className="mr-2 h-4 w-4"/>Save Changes</Button>
                </CardFooter>
              </form>
            )}
          </Card>

          <Dialog open={isDonateDialogOpen} onOpenChange={setIsDonateDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="gradient-text">Make a Donation</DialogTitle>
                <DialogDescription>
                  Support "{campaign.title}" with your generous contribution.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleDonate} className="py-4 space-y-4">
                <div>
                    <Label htmlFor="donationAmount">Amount ($)</Label>
                    <Input 
                        id="donationAmount" 
                        type="number" 
                        value={donationAmount} 
                        onChange={(e) => setDonationAmount(e.target.value)} 
                        placeholder="e.g., 50" 
                        className="professional-input mt-1"
                        min="1"
                        required 
                    />
                </div>
                {user && <p className="text-sm text-muted-foreground">You are donating as: {user.name} ({user.email})</p>}
                {!user && <p className="text-sm text-destructive">Please <Link to="/login" state={{from: reactRouterLocation}} className="underline">log in</Link> to complete your donation.</p>}
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDonateDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={!user}>Confirm Donation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

        </motion.div>
      );
    };

    export default CampaignDetailsPage;
  