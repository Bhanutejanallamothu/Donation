
    import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { DatePicker } from '@/components/ui/date-picker';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useCampaigns } from '@/context/CampaignContext';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { PlusCircle, Target, Users, CalendarClock, Image as ImageIcon, DollarSign, Building, Info } from 'lucide-react';

    const CreateCampaignPage = () => {
      const navigate = useNavigate();
      const { addCampaign } = useCampaigns();
      const { toast } = useToast();

      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [goalAmount, setGoalAmount] = useState('');
      const [beneficiary, setBeneficiary] = useState('');
      const [organization, setOrganization] = useState('');
      const [endDate, setEndDate] = useState(null);
      const [image, setImage] = useState('');


      const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !goalAmount || !beneficiary || !endDate || !description) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          return;
        }
        addCampaign({ 
            title, 
            description, 
            goalAmount: parseFloat(goalAmount), 
            beneficiary, 
            organization,
            endDate: endDate.toISOString(), 
            image 
        });
        navigate('/campaigns');
      };

      const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      };
      
      const inputMotionProps = {
        whileHover: { scale: 1.02 },
        whileFocus: { scale: 1.02, boxShadow: "0px 0px 8px rgba(var(--primary-rgb), 0.5)" }
      };


      return (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={formVariants}
          className="max-w-2xl mx-auto"
        >
          <Card className="professional-card shadow-xl">
            <CardHeader className="text-center">
              <div className="inline-block mx-auto p-3 bg-primary/10 rounded-full mb-3">
                 <PlusCircle className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold gradient-text">Launch Your Campaign</CardTitle>
              <CardDescription className="text-lg text-foreground/70">Tell us about your cause and start fundraising today.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-foreground/90 flex items-center"><Target className="mr-2 h-4 w-4 text-primary"/>Campaign Title</Label>
                  <motion.div {...inputMotionProps}>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Aid for Flood Victims"
                      className="mt-1 professional-input"
                      required
                    />
                  </motion.div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-foreground/90 flex items-center"><Info className="mr-2 h-4 w-4 text-primary"/>Description</Label>
                   <motion.div {...inputMotionProps}>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your campaign, its impact, and why people should donate..."
                      className="mt-1 min-h-[120px] professional-input"
                      required
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="goalAmount" className="text-sm font-medium text-foreground/90 flex items-center"><DollarSign className="mr-2 h-4 w-4 text-primary"/>Fundraising Goal ($)</Label>
                        <motion.div {...inputMotionProps}>
                        <Input
                            id="goalAmount"
                            type="number"
                            value={goalAmount}
                            onChange={(e) => setGoalAmount(e.target.value)}
                            placeholder="e.g., 5000"
                            className="mt-1 professional-input"
                            min="1"
                            required
                        />
                        </motion.div>
                    </div>
                    <div>
                        <Label htmlFor="endDate" className="text-sm font-medium text-foreground/90 flex items-center"><CalendarClock className="mr-2 h-4 w-4 text-primary"/>End Date</Label>
                        <motion.div {...inputMotionProps}>
                            <DatePicker date={endDate} setDate={setEndDate} className="mt-1 w-full professional-input" />
                        </motion.div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="beneficiary" className="text-sm font-medium text-foreground/90 flex items-center"><Users className="mr-2 h-4 w-4 text-primary"/>Beneficiary</Label>
                         <motion.div {...inputMotionProps}>
                            <Input
                            id="beneficiary"
                            value={beneficiary}
                            onChange={(e) => setBeneficiary(e.target.value)}
                            placeholder="e.g., Local Community Kitchen"
                            className="mt-1 professional-input"
                            required
                            />
                        </motion.div>
                    </div>
                     <div>
                        <Label htmlFor="organization" className="text-sm font-medium text-foreground/90 flex items-center"><Building className="mr-2 h-4 w-4 text-primary"/>Organization (Optional)</Label>
                        <motion.div {...inputMotionProps}>
                            <Input
                            id="organization"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            placeholder="e.g., Your Charity Name"
                            className="mt-1 professional-input"
                            />
                        </motion.div>
                    </div>
                </div>
                 <div>
                  <Label htmlFor="image" className="text-sm font-medium text-foreground/90 flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-primary"/>Campaign Image URL (Optional)</Label>
                  <motion.div {...inputMotionProps}>
                    <Input
                      id="image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/your-campaign-image.jpg"
                      className="mt-1 professional-input"
                    />
                  </motion.div>
                </div>


                <div className="flex justify-end space-x-3 pt-4">
                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="button" variant="outline" onClick={() => navigate(-1)} className="px-6 py-2 text-base">
                        Cancel
                    </Button>
                   </motion.div>
                   <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="submit" className="px-8 py-2 text-base bg-primary hover:bg-primary/90">
                        Launch Campaign
                    </Button>
                   </motion.div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default CreateCampaignPage;
  