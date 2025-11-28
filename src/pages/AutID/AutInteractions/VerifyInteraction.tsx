import { Box, Typography, useTheme, Tabs, Tab, Dialog, DialogContent, Chip, CircularProgress, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import { SelectedAutID } from '@store/aut/aut.reducer';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import InteractionList from '@components/AutInteractionTabs/InteractionList';
import { AutOsButton } from '@components/AutButton';
import { ethers } from 'ethers';
import { InteractionFactoryABI } from './contracts/InteractionFactoryABI';
import { environment } from '@api/environment';

interface Interaction {
  id: string;
  name: string;
  description: string;
  protocol: string;
  icon: string;
  verified: boolean;
  completed?: boolean; // Whether the user has actually completed this interaction on-chain
}

interface InteractionsByCategory {
  [category: string]: Interaction[];
}

// Define interaction categories like those in the Map component
const categories = [
  { id: 'defi', label: 'DeFi' },
  { id: 'governance', label: 'Governance' },
  { id: 'tech', label: 'Tech & Infra' },
  { id: 'nfts', label: 'Art, Gaming & NFTs' },
  { id: 'reputation', label: 'Reputation & ID' }
];

// Replace hardcoded address with the environment variable
const INTERACTION_FACTORY_ADDRESS = environment.interactionFactoryAddress || '0x5f9d4a1b1f739F9eAc7fE99CC8a555591943F3e9';

// Default interactions data (to be replaced with contract data)
const defaultInteractionsByCategory: InteractionsByCategory = {
  defi: [],
  governance: [],
  tech: [],
  nfts: [],
  reputation: []
};

// Local storage key for storing verified interactions
const VERIFIED_INTERACTIONS_STORAGE_KEY = 'aut-verified-interactions';

const VerifyInteraction = () => {
  const theme = useTheme();
  const { address, isConnected } = useAccount();
  const autID = useSelector(SelectedAutID);

  const [openModal, setOpenModal] = useState(false);
  const [interactions, setInteractions] = useState<InteractionsByCategory>(defaultInteractionsByCategory);
  const [selectedCategory, setSelectedCategory] = useState('defi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedInteractions, setVerifiedInteractions] = useState<Interaction[]>([]);

  // Load verified interactions from local storage
  const loadVerifiedInteractions = () => {
    if (!address) return;

    try {
      const storedData = localStorage.getItem(`${VERIFIED_INTERACTIONS_STORAGE_KEY}-${address}`);
      if (storedData) {
        const storedInteractions = JSON.parse(storedData);
        setVerifiedInteractions(storedInteractions);

        // Update verified status in all interactions
        setInteractions(prevInteractions => {
          const newInteractions = { ...prevInteractions };

          // For each category, update the verified status based on stored data
          Object.keys(newInteractions).forEach(category => {
            newInteractions[category] = newInteractions[category].map(interaction => {
              const isVerified = storedInteractions.some(
                (stored: Interaction) => stored.id === interaction.id
              );
              return {
                ...interaction,
                verified: isVerified
              };
            });
          });

          return newInteractions;
        });
      }
    } catch (err) {
      console.error("Error loading verified interactions from local storage:", err);
    }
  };

  // Save verified interactions to local storage
  const saveVerifiedInteractions = (interactions: Interaction[]) => {
    if (!address) return;

    try {
      localStorage.setItem(
        `${VERIFIED_INTERACTIONS_STORAGE_KEY}-${address}`,
        JSON.stringify(interactions)
      );
    } catch (err) {
      console.error("Error saving verified interactions to local storage:", err);
    }
  };

  // Fetch interactions from the contract
  const fetchInteractions = async () => {
    if (!window.ethereum) return;

    try {
      setLoading(true);
      setError('');

      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const contract = new ethers.Contract(INTERACTION_FACTORY_ADDRESS, InteractionFactoryABI, provider);

      // Get total number of templates
      const totalTemplates = await contract.totalTemplates();

      if (totalTemplates === 0) {
        setLoading(false);
        return;
      }

      const newInteractions: InteractionsByCategory = {
        defi: [],
        governance: [],
        tech: [],
        nfts: [],
        reputation: []
      };

      // Fetch all templates
      for (let i = 1; i <= totalTemplates; i++) {
        try {
          const template = await contract.getInteractionTemplate(i);

          // Create interaction object from template
          const interaction: Interaction = {
            id: i.toString(),
            name: template.name,
            description: template.description,
            protocol: template.name, // Using name as protocol for now
            icon: template.logo,
            verified: false, // Will be updated based on user selection
            completed: false // Will be updated when we check user's on-chain activity
          };

          // Categorize interaction based on the type
          // This is a simple categorization logic that can be improved
          const categoryMapping = {
            // Common DeFi keywords
            defi: ['swap', 'liquidity', 'lend', 'borrow', 'stake', 'yield', 'farm', 'pool', 'trade', 'finance', 'token', 'dex', 'exchange', 'aave', 'uniswap', 'curve', 'balancer', 'sushi'],

            // Governance keywords
            governance: ['vote', 'proposal', 'governance', 'dao', 'decide', 'snapshot', 'gitcoin', 'grant', 'fund', 'donate', 'community', 'collective', 'aragon', 'colony'],

            // Tech keywords
            tech: ['deploy', 'contract', 'develop', 'node', 'run', 'validate', 'chain', 'block', 'tech', 'code', 'ethereum', 'polygon', 'base', 'protocol', 'zk', 'rollup', 'smart contract'],

            // NFT keywords
            nfts: ['nft', 'collect', 'mint', 'art', 'game', 'play', 'digital', 'asset', 'token', 'opensea', 'rarible', 'foundation', 'superrare', 'async', 'gaming'],

            // Reputation keywords
            reputation: ['reputation', 'identity', 'credential', 'proof', 'verify', 'attestation', 'aut', 'id', 'did', 'ceramic', 'poap', 'gitcoin passport']
          };

          let assigned = false;

          // Find the right category based on keywords in name or description
          for (const [category, keywords] of Object.entries(categoryMapping)) {
            const matchesKeyword = keywords.some(keyword =>
              interaction.name.toLowerCase().includes(keyword.toLowerCase()) ||
              interaction.description.toLowerCase().includes(keyword.toLowerCase())
            );

            if (matchesKeyword) {
              newInteractions[category].push(interaction);
              assigned = true;
              break;
            }
          }

          // If no category matched, put it in the tech category as default
          if (!assigned) {
            newInteractions.tech.push(interaction);
          }
        } catch (err) {
          console.error(`Error fetching template ${i}:`, err);
        }
      }

      setInteractions(newInteractions);

      // After fetching interactions, check which ones the user has completed
      await checkCompletedInteractions(newInteractions);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching interactions:", err);
      setError("Failed to load interactions from the contract. Please try again.");
      setLoading(false);
    }
  };

  // Check which interactions the user has completed on-chain
  const checkCompletedInteractions = async (interactionsData: InteractionsByCategory) => {
    if (!window.ethereum || !address) return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const contract = new ethers.Contract(INTERACTION_FACTORY_ADDRESS, InteractionFactoryABI, provider);

      // Flatten all interactions for processing
      const allInteractions = Object.values(interactionsData).flat();

      // Process interactions in batches to avoid too many simultaneous requests
      const batchSize = 5;
      const processedInteractions = [];

      for (let i = 0; i < allInteractions.length; i += batchSize) {
        const batch = allInteractions.slice(i, i + batchSize);

        await Promise.all(batch.map(async (interaction) => {
          try {
            // Get detailed template info
            const template = await contract.getInteractionTemplate(interaction.id);

            // Check if the user has actually completed this interaction
            // For this example, we're using a simplified check
            // In a real implementation, we would need more sophisticated logic
            let completed = false;

            if (template.targetContract && ethers.isAddress(template.targetContract)) {
              // Check if the user has ever interacted with this contract
              const targetContract = template.targetContract;

              // For demonstration purposes, we're currently using a random result
              // In a real implementation, we would query transaction history or use a subgraph
              completed = Math.random() > 0.5; // Simulating a check
            }

            // Update the interaction with completed status
            interaction.completed = completed;
            processedInteractions.push(interaction);
          } catch (err) {
            console.error(`Error checking interaction ${interaction.id}:`, err);
          }
        }));
      }

      // Update the interactions state with the processed data
      setInteractions(prevInteractions => {
        const newInteractions = { ...prevInteractions };

        // Update the 'completed' status for each interaction
        processedInteractions.forEach(processedInteraction => {
          for (const category in newInteractions) {
            const index = newInteractions[category].findIndex(
              i => i.id === processedInteraction.id
            );

            if (index !== -1) {
              newInteractions[category][index] = {
                ...newInteractions[category][index],
                completed: processedInteraction.completed
              };
            }
          }
        });

        return newInteractions;
      });

      // Now load previously verified interactions from local storage
      loadVerifiedInteractions();

    } catch (err) {
      console.error("Error checking completed interactions:", err);
    }
  };

  // Add or remove an interaction from the user's verified list
  const toggleInteractionDisplay = async (interaction: Interaction) => {
    if (!isConnected || !address) {
      setError("Please connect your wallet to manage interactions.");
      return;
    }

    try {
      // Check if this interaction is already verified
      const isCurrentlyVerified = verifiedInteractions.some(
        i => i.id === interaction.id
      );

      let newVerifiedInteractions;

      if (isCurrentlyVerified) {
        // Remove from verified list
        newVerifiedInteractions = verifiedInteractions.filter(
          i => i.id !== interaction.id
        );
      } else {
        // First check if the user has actually completed this interaction
        if (!interaction.completed) {
          // For the demo, we'll allow adding regardless of completion status
          // But in a real implementation, we'd show an error
          console.warn("User hasn't completed this interaction, but we're allowing it for the demo");
        }

        // Add to verified list
        newVerifiedInteractions = [
          ...verifiedInteractions,
          { ...interaction, verified: true }
        ];
      }

      // Update verified interactions
      setVerifiedInteractions(newVerifiedInteractions);

      // Update the verified status in all interactions
      setInteractions(prevInteractions => {
        const newInteractions = { ...prevInteractions };

        // Update the specific interaction
        for (const category in newInteractions) {
          const index = newInteractions[category].findIndex(
            i => i.id === interaction.id
          );

          if (index !== -1) {
            newInteractions[category][index] = {
              ...newInteractions[category][index],
              verified: !isCurrentlyVerified
            };
          }
        }

        return newInteractions;
      });

      // Save to local storage
      saveVerifiedInteractions(newVerifiedInteractions);

    } catch (err) {
      console.error("Error toggling interaction display:", err);
      setError("Failed to update interaction display. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch interactions when component mounts or address changes
    if (isConnected && address) {
      fetchInteractions();
    }
  }, [address, isConnected]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeCategory = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedCategory(newValue);
  };

  const isAddressTheConnectedUser = autID && autID.isAutIDOwner && autID.isAutIDOwner(address);

  if (!isConnected) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h5" color="offWhite.main">
          Connect your wallet to view and display your interactions
        </Typography>
      </Box>
    );
  }

  if (!isAddressTheConnectedUser) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h5" color="offWhite.main">
          Connect the wallet associated with your AutID to manage interactions
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', pt: 2 }}>
      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(211, 47, 47, 0.15)',
            color: '#ff5252',
            '& .MuiAlert-icon': {
              color: '#ff5252'
            }
          }}
        >
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" color="offWhite.main" sx={{ mb: 1 }}>
            Displayed Interactions
          </Typography>

          <Typography variant="body1" color="offWhite.dark">
            These interactions will be displayed on your public profile.
          </Typography>
        </Box>

        <AutOsButton
          variant="contained"
          onClick={handleOpenModal}
          sx={{
            backgroundColor: '#576176',
            '&:hover': {
              backgroundColor: '#6e788c',
            },
            borderRadius: '8px'
          }}
        >
          Manage Interactions
        </AutOsButton>
      </Box>

      <Box sx={{ p: 3, mb: 3, backgroundColor: '#242531', borderRadius: '8px', border: '1px solid #576176' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ color: 'offWhite.main' }} />
          </Box>
        ) : (
          <>
            <Typography color="offWhite.main" variant="h6" sx={{ mb: 2 }}>
              Active Badges: <Chip label={`${verifiedInteractions.length}`} sx={{ ml: 1, backgroundColor: '#576176', color: 'white', height: '24px', borderRadius: '4px' }} />
            </Typography>

            {verifiedInteractions.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="offWhite.dark" variant="body1">
                  You haven't selected any interactions to display yet.
                </Typography>
                <Typography color="offWhite.dark" variant="body2" sx={{ mt: 1 }}>
                  Click "Manage Interactions" to select which on-chain activities to showcase.
                </Typography>
              </Box>
            ) : (
              <InteractionList
                interactions={verifiedInteractions}
                verifyInteraction={toggleInteractionDisplay}
              />
            )}
          </>
        )}
      </Box>

      {/* Manage Interactions Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: {
            backgroundColor: '#1E1F2E',
            backgroundImage: 'none',
            borderRadius: '8px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.5)',
            height: '80vh'
          }
        }}
      >
        <DialogContent sx={{ p: 3, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" color="offWhite.main">
              Manage Your Interaction Display
            </Typography>
            <AutOsButton
              onClick={handleCloseModal}
              variant="outlined"
              sx={{ borderRadius: '8px' }}
            >
              Done
            </AutOsButton>
          </Box>

          <Typography variant="body1" color="offWhite.dark" sx={{ mb: 3 }}>
            Select which on-chain activities you want to showcase on your profile.
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
              <CircularProgress size={60} sx={{ color: 'offWhite.main' }} />
            </Box>
          ) : (
            <>
              <Tabs
                value={selectedCategory}
                onChange={handleChangeCategory}
                sx={{
                  mb: 3,
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'offWhite.main'
                  },
                  '& .MuiTab-root': {
                    color: 'offWhite.dark',
                    '&.Mui-selected': {
                      color: 'offWhite.main'
                    },
                    borderRadius: '8px',
                    mx: 0.5
                  }
                }}
              >
                {categories.map(category => (
                  <Tab key={category.id} label={category.label} value={category.id} />
                ))}
              </Tabs>

              <Box sx={{ height: 'calc(100% - 180px)', overflow: 'auto' }}>
                {Object.keys(interactions).length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography color="offWhite.dark" variant="h6">
                      No interaction templates found
                    </Typography>
                    <Typography color="offWhite.dark" variant="body2" sx={{ mt: 1 }}>
                      Interaction templates need to be created first
                    </Typography>
                  </Box>
                ) : interactions[selectedCategory]?.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography color="offWhite.dark" variant="h6">
                      No interactions found in this category
                    </Typography>
                    <Typography color="offWhite.dark" variant="body2" sx={{ mt: 1 }}>
                      Try selecting a different category
                    </Typography>
                  </Box>
                ) : (
                  <InteractionList
                    interactions={interactions[selectedCategory] || []}
                    verifyInteraction={toggleInteractionDisplay}
                  />
                )}
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VerifyInteraction; 