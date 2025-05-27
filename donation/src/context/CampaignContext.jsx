
    import React, { createContext, useContext, useState, useEffect } from 'react';
    import useLocalStorage from '@/hooks/useLocalStorage';
    import { useToast } from '@/components/ui/use-toast';
    import { useAuth } from '@/context/AuthContext';

    const CampaignContext = createContext();

    export const useCampaigns = () => useContext(CampaignContext);

    const initialCampaigns = [
      {
        id: '1',
        title: 'Support Local Animal Shelter',
        description: 'Help us provide food, shelter, and medical care for homeless animals. Every donation makes a difference in giving these animals a second chance at a happy life.',
        goalAmount: 5000,
        currentAmount: 1250,
        beneficiary: 'Happy Paws Animal Shelter',
        organization: 'Community Pet Lovers',
        endDate: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate() + 30).toISOString(),
        image: 'https://images.unsplash.com/photo-1599056440394-15106ac675a3?q=80&w=1000&auto=format&fit=crop',
        donations: [
            { donorName: 'Jane Doe', donorEmail: 'jane@example.com', amount: 50, date: new Date().toISOString() },
            { donorName: 'John Smith', donorEmail: 'john@example.com', amount: 25, date: new Date().toISOString() }
        ],
        creatorEmail: 'org@example.com'
      },
      {
        id: '2',
        title: 'Fund Children\'s Education Program',
        description: 'Provide essential school supplies and tutoring for underprivileged children in our community. Your support can unlock a brighter future for them.',
        goalAmount: 10000,
        currentAmount: 7800,
        beneficiary: 'Bright Futures Initiative',
        organization: 'Educate Our Kids Foundation',
        endDate: new Date(new Date().getFullYear() + 1, new Date().getMonth() + 2, new Date().getDate()).toISOString(),
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop',
        donations: [
            { donorName: 'Alice Brown', donorEmail: 'alice.b@example.com', amount: 100, date: new Date().toISOString() }
        ],
        creatorEmail: 'another@example.com'
      },
      {
        id: '3',
        title: 'Clean Water for Rural Village',
        description: 'Help build a sustainable clean water source for a remote village, improving health and sanitation for hundreds of families.',
        goalAmount: 7500,
        currentAmount: 3400,
        beneficiary: 'Village of Amanzi',
        organization: 'Global Water Relief',
        endDate: new Date(new Date().getFullYear() + 0, new Date().getMonth() + 5, new Date().getDate()).toISOString(),
        image: 'https://images.unsplash.com/photo-1598452800029-42559047c0d7?q=80&w=1000&auto=format&fit=crop',
        donations: [],
        creatorEmail: 'org@example.com'
      },
    ];

    export const CampaignProvider = ({ children }) => {
      const [campaigns, setCampaigns] = useLocalStorage('hopefund-campaigns', initialCampaigns);
      const { toast } = useToast();
      const { user } = useAuth();

      const addCampaign = (campaignData) => {
        const newCampaign = { 
            ...campaignData, 
            id: Date.now().toString(), 
            currentAmount: 0, 
            donations: [],
            creatorEmail: user ? user.email : 'anonymous'
        };
        setCampaigns((prevCampaigns) => [newCampaign, ...prevCampaigns]);
        toast({
          title: "Campaign Created",
          description: `Campaign "${campaignData.title}" has been successfully launched.`,
        });
      };

      const updateCampaign = (updatedCampaign) => {
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === updatedCampaign.id ? { ...campaign, ...updatedCampaign } : campaign
          )
        );
        toast({
          title: "Campaign Updated",
          description: `Campaign "${updatedCampaign.title}" has been successfully updated.`,
        });
      };

      const deleteCampaign = (campaignId) => {
        const campaignToDelete = campaigns.find(c => c.id === campaignId);
        if (campaignToDelete && campaignToDelete.creatorEmail !== user?.email) {
            toast({
                title: "Deletion Failed",
                description: "You can only delete campaigns you created.",
                variant: "destructive"
            });
            return false;
        }
        setCampaigns((prevCampaigns) => prevCampaigns.filter((campaign) => campaign.id !== campaignId));
        if (campaignToDelete) {
            toast({
            title: "Campaign Deleted",
            description: `Campaign "${campaignToDelete.title}" has been deleted.`,
            variant: "destructive",
            });
        }
        return true;
      };

      const getCampaignById = (id) => {
        return campaigns.find(campaign => campaign.id === id);
      };
      
      const addDonation = (campaignId, donationDetails) => {
        setCampaigns(prevCampaigns => 
            prevCampaigns.map(campaign => {
                if (campaign.id === campaignId) {
                    const newDonation = {
                        ...donationDetails,
                        date: new Date().toISOString(),
                        id: Date.now().toString()
                    };
                    const updatedDonations = [...(campaign.donations || []), newDonation];
                    const newCurrentAmount = (campaign.currentAmount || 0) + parseFloat(donationDetails.amount);
                    
                    toast({
                        title: "Donation Successful!",
                        description: `Thank you for your generous donation of $${donationDetails.amount} to "${campaign.title}".`
                    });
                    return { ...campaign, donations: updatedDonations, currentAmount: newCurrentAmount };
                }
                return campaign;
            })
        );
      };
      
      const getUserDonations = () => {
        if (!user) return [];
        const userDonations = [];
        campaigns.forEach(campaign => {
            (campaign.donations || []).forEach(donation => {
                if (donation.donorEmail === user.email) {
                    userDonations.push({
                        ...donation,
                        campaignTitle: campaign.title,
                        campaignId: campaign.id,
                        campaignImage: campaign.image
                    });
                }
            });
        });
        return userDonations.sort((a,b) => new Date(b.date) - new Date(a.date));
      };


      return (
        <CampaignContext.Provider value={{ campaigns, addCampaign, updateCampaign, deleteCampaign, getCampaignById, addDonation, getUserDonations }}>
          {children}
        </CampaignContext.Provider>
      );
    };
  