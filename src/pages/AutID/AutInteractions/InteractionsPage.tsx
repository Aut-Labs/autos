import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogContent
} from "@mui/material";
import { memo, useState, SyntheticEvent, useEffect, lazy, Suspense, ReactNode } from "react";
import { AutOsButton } from "@components/AutButton";
import { useAccount } from "wagmi";

// Temporary placeholders for missing components and hooks
const TabPanel = ({ children, value, index }: { children: ReactNode; value: number; index: number }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

const StatsCard = ({ title, subtitle, value }: { title: string; subtitle: string; value: number | string }) => (
  <Box sx={{ p: 2, backgroundColor: '#242531', borderRadius: '4px', border: '1px solid #393a47', flex: 1 }}>
    <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>{subtitle}</Typography>
    <Typography variant="h5" color="offWhite.main" sx={{ mt: 1 }}>{value}</Typography>
    <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.65rem' }}>{title}</Typography>
  </Box>
);

const OptimizedImage = ({ src, alt, fallbackSrc, width, height, containerProps }: any) => (
  <Box {...containerProps}>
    <img
      src={src || fallbackSrc}
      alt={alt}
      width={width}
      height={height}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
      onError={(e: any) => { e.target.src = fallbackSrc; }}
    />
  </Box>
);

const useResponsive = () => ({
  isSmallScreen: false,
  isMediumScreen: false
});

const useInteractions = () => ({
  interactions: [],
  userInteractions: [],
  loading: false,
  error: null,
  fetchInteractions: () => { },
  fetchUserInteractions: (address: string) => { },
  loadMore: () => { }
});

const containerStyles = {
  page: {
    backgroundColor: '#1E1F2E',
    minHeight: '100vh',
    p: 3
  }
};

const cardStyles = {
  base: {
    backgroundColor: '#242531',
    borderRadius: '4px',
    border: '1px solid #393a47'
  },
  hover: {
    borderColor: '#6e56cf',
    transform: 'translateY(-2px)',
    transition: 'all 0.2s ease-in-out'
  }
};

// Lazy-load the potentially heavy CreateInteraction component
const CreateInteraction = lazy(() => import("./CreateInteraction"));

// Constants
const DEFAULT_LOGO_PATH = '/apple-touch-icon.png';

// Helper function to get the tab props
const a11yProps = (index: number) => ({
  id: `interaction-tab-${index}`,
  'aria-controls': `interaction-tabpanel-${index}`,
});

/**
 * Table of interactions, supporting various view modes:
 * - All available interactions
 * - Completed interactions by the user
 * - Interactions created by the user
 */
const InteractionsPage = () => {
  const { isSmallScreen, isMediumScreen } = useResponsive();
  const [tabValue, setTabValue] = useState(0);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [completedInteractions, setCompletedInteractions] = useState([]);
  const { address } = useAccount();

  // Use our custom hook for interactions data
  const {
    interactions: allInteractions,
    userInteractions,
    loading,
    error,
    fetchInteractions,
    fetchUserInteractions,
    loadMore,
  } = useInteractions();

  // When user address changes, fetch their interactions
  useEffect(() => {
    if (address) {
      fetchUserInteractions(address);
    }
  }, [address, fetchUserInteractions]);

  // Simulate completed interactions - this would be replaced with actual data
  useEffect(() => {
    if (allInteractions && allInteractions.length > 0) {
      const completed = [...allInteractions]
        .filter(() => Math.random() > 0.7) // Randomly select ~30% of interactions
        .slice(0, 5); // Limit to 5 max
      setCompletedInteractions(completed);
    }
  }, [allInteractions]);

  // Tab change handler
  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setShowStats(false); // Reset stats view when changing tabs
  };

  // Toggle stats visibility
  const toggleStats = () => setShowStats(!showStats);

  // Calculate total earnings (simulated data)
  const calculateTotalEarnings = () => {
    return userInteractions
      ? userInteractions.reduce((total, interaction) => {
        // Using a mock value for demonstration
        const earnings = Math.random() * 10;
        return total + earnings;
      }, 0).toFixed(2)
      : "0.00";
  };

  /**
   * Render an interaction card
   */
  const renderInteractionCard = (interaction: any) => (
    <Box
      key={interaction.id}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        ...cardStyles.base,
        '&:hover': cardStyles.hover,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <OptimizedImage
          src={interaction.logo}
          alt={interaction.name || 'Interaction'}
          fallbackSrc={DEFAULT_LOGO_PATH}
          width={36}
          height={36}
          containerProps={{ sx: { mr: 2 } }}
        />
        <Box>
          <Typography
            variant="body1"
            color="offWhite.main"
            sx={{
              fontSize: '0.9rem',
              fontWeight: 'medium',
              // Ensure text doesn't overflow the container
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: { xs: '200px', sm: '250px', md: '300px' }
            }}
          >
            {interaction.name}
          </Typography>
          <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>
            {interaction.protocol || 'Protocol'}
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="body2"
        color="offWhite.dark"
        sx={{
          mb: 2,
          height: { xs: 'auto', sm: '2.5rem' },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          fontSize: '0.75rem'
        }}
      >
        {interaction.description}
      </Typography>

      <Box sx={{ mt: 'auto' }}>
        <AutOsButton
          variant="contained"
          fullWidth
          size="small"
          sx={{
            backgroundColor: '#6e56cf',
            '&:hover': {
              backgroundColor: '#7c66d5',
            },
            borderRadius: '4px',
            py: 0.75,
            fontSize: '0.75rem',
            textTransform: 'none'
          }}
        >
          Delegate
        </AutOsButton>
      </Box>
    </Box>
  );

  /**
   * Render a list of interactions in a grid layout
   */
  const renderInteractionGrid = (interactionsList: any[]) => (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)'
      },
      gap: 2,
      pb: 2 // Add padding at bottom for scrolling
    }}>
      {interactionsList.map(renderInteractionCard)}
    </Box>
  );

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        ...containerStyles.page
      }}
      component={Paper}
      elevation={0}
    >
      {/* Header with title and action buttons */}
      <Box sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        flexWrap: 'wrap',
        gap: 2,
        flexShrink: 0 // Prevent this from shrinking
      }}>
        <Box>
          <Typography color="offWhite.main" variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Interactions
          </Typography>
          <Typography color="offWhite.dark" variant="body2">
            Discover, create, and delegate standardized blockchain interactions
          </Typography>
        </Box>
        <AutOsButton
          variant="contained"
          onClick={() => setOpenCreateModal(true)}
          size={isSmallScreen ? "small" : "medium"}
          sx={{
            backgroundColor: '#6e56cf',
            '&:hover': {
              backgroundColor: '#7c66d5',
            },
            borderRadius: '4px',
            px: 2,
            py: 1,
            minWidth: 'auto'
          }}
          startIcon={<span>+</span>}
        >
          Create new
        </AutOsButton>
      </Box>

      {/* Stats Cards */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        mb: 2,
        gap: 2,
        flexShrink: 0 // Prevent this from shrinking
      }}>
        <StatsCard
          title="Total Interactions"
          subtitle="Available in the registry"
          value={allInteractions?.length || 0}
        />

        <StatsCard
          title="Your Creations"
          subtitle="Interactions you've created"
          value={userInteractions?.length || 0}
        />

        <StatsCard
          title="Delegated Interactions"
          subtitle="Interactions you've delegated"
          value={0}
        />
      </Box>

      {/* Tabs Section */}
      <Box sx={{
        width: '100%',
        flex: 1, // This makes it take all remaining space
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' // Hide overflow
      }}>
        <Box sx={{
          borderBottom: 1,
          borderColor: '#393a47',
          mb: 1.5,
          flexShrink: 0 // Prevent tabs from shrinking
        }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="interaction tabs"
            variant={isSmallScreen ? "fullWidth" : "standard"}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#6e56cf',
                height: 2
              },
              '& .MuiTab-root': {
                color: 'offWhite.dark',
                textTransform: 'none',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                minWidth: 0,
                px: { xs: 1, sm: 2 },
                '&.Mui-selected': {
                  color: 'offWhite.main'
                }
              }
            }}
          >
            <Tab label="All Interactions" {...a11yProps(0)} />
            <Tab label="Completed" {...a11yProps(1)} />
            <Tab label="Created" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Tabs content */}
        <Box sx={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* All Interactions Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" color="offWhite.main" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' }, flexShrink: 0 }}>
              All available interactions
            </Typography>

            {loading && !allInteractions.length ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">Loading interactions...</Typography>
              </Box>
            ) : allInteractions?.length > 0 ? (
              renderInteractionGrid(allInteractions)
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">No interactions available yet</Typography>
              </Box>
            )}
          </TabPanel>

          {/* Completed Tab */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" color="offWhite.main" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' }, flexShrink: 0 }}>
              Interactions completed by you
            </Typography>

            {loading && !completedInteractions.length ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">Loading completed interactions...</Typography>
              </Box>
            ) : completedInteractions.length > 0 ? (
              renderInteractionGrid(completedInteractions)
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">You haven't completed any interactions yet</Typography>
                <Box sx={{ mt: 2 }}>
                  <AutOsButton
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#6e56cf',
                      '&:hover': {
                        backgroundColor: '#7c66d5',
                      },
                      borderRadius: '4px',
                      py: 0.75,
                      fontSize: '0.75rem',
                      textTransform: 'none'
                    }}
                  >
                    Complete Your First Interaction
                  </AutOsButton>
                </Box>
              </Box>
            )}
          </TabPanel>

          {/* Created Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              flexWrap: 'wrap',
              gap: 1,
              flexShrink: 0 // Prevent this from shrinking
            }}>
              <Typography variant="h6" color="offWhite.main" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                Interactions created by you
              </Typography>
              <AutOsButton
                variant="outlined"
                size="small"
                onClick={toggleStats}
                sx={{
                  borderColor: '#393a47',
                  color: 'offWhite.main',
                  borderRadius: '4px',
                  py: 0.5,
                  fontSize: '0.75rem',
                  textTransform: 'none'
                }}
                startIcon={<span>📊</span>}
              >
                {showStats ? 'Hide Stats' : 'View Stats'}
              </AutOsButton>
            </Box>

            {loading && !userInteractions?.length ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">Loading your created interactions...</Typography>
              </Box>
            ) : userInteractions?.length > 0 ? (
              <>
                {/* Stats View - Only shown when stats toggle is active */}
                {showStats && (
                  <Box sx={{
                    p: 2,
                    mb: 2,
                    ...cardStyles.base,
                  }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: 'flex-start' }}>
                      {/* Total Earnings */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" color="offWhite.main" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          Total Earnings
                        </Typography>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>
                          From all your created interactions
                        </Typography>
                        <Typography variant="h5" color="offWhite.main" sx={{ mt: 1 }}>
                          {calculateTotalEarnings()} $AUT
                        </Typography>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>
                          ≈ $0.00
                        </Typography>
                      </Box>

                      {/* Additional Stats */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" color="offWhite.main" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          Monthly Trend
                        </Typography>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>
                          Past 30 days performance
                        </Typography>
                        <Typography variant="h5" color="offWhite.main" sx={{ mt: 1 }}>
                          +0.00%
                        </Typography>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>
                          No change this month
                        </Typography>
                      </Box>

                      {/* Usage stats */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" color="offWhite.main" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                          Usage
                        </Typography>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>
                          Total delegations
                        </Typography>
                        <Typography variant="h5" color="offWhite.main" sx={{ mt: 1 }}>
                          {userInteractions.reduce((sum, int) => sum + (int.integrations || 0), 0)}
                        </Typography>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>
                          Across all interactions
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Interactions table */}
                <Box sx={{
                  backgroundColor: '#242531',
                  borderRadius: '4px',
                  mb: 2,
                  overflow: 'auto',
                  border: '1px solid #393a47',
                  maxHeight: showStats ? 'calc(100% - 150px)' : '100%',
                  flex: 1
                }}>
                  <Box sx={{
                    display: { xs: 'none', md: 'grid' },
                    gridTemplateColumns: 'minmax(200px, 1fr) 120px 80px 120px 120px',
                    p: 1.5,
                    borderBottom: '1px solid #393a47',
                    backgroundColor: '#1e1f2e',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2
                  }}>
                    <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Interaction</Typography>
                    <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Protocol</Typography>
                    <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Price</Typography>
                    <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Integrations</Typography>
                    <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Lifetime Earnings</Typography>
                  </Box>

                  {userInteractions.map(interaction => (
                    <Box
                      key={interaction.id}
                      sx={{
                        display: { xs: 'flex', md: 'grid' },
                        flexDirection: 'column',
                        gridTemplateColumns: 'minmax(200px, 1fr) 120px 80px 120px 120px',
                        p: 1.5,
                        borderBottom: '1px solid #393a47',
                        '&:last-child': {
                          borderBottom: 'none'
                        }
                      }}
                    >
                      {/* Mobile view with labels */}
                      <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 1 }}>
                        <OptimizedImage
                          src={interaction.logo}
                          alt={interaction.name || 'Interaction'}
                          fallbackSrc={DEFAULT_LOGO_PATH}
                          width={36}
                          height={36}
                          containerProps={{ sx: { mr: 2 } }}
                        />
                        <Typography variant="body2" color="offWhite.main" sx={{ fontWeight: 'medium' }}>
                          {interaction.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Protocol:</Typography>
                        <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.75rem' }}>
                          {interaction.protocol || 'N/A'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Price:</Typography>
                        <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.75rem' }}>
                          0 $AUT
                        </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Integrations:</Typography>
                        <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.75rem' }}>
                          {interaction.integrations || 0}
                        </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Earnings:</Typography>
                        <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.75rem' }}>
                          {Math.floor(Math.random() * 100) / 100} $AUT
                        </Typography>
                      </Box>

                      {/* Desktop view */}
                      <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        {interaction.name}
                      </Typography>
                      <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        {interaction.protocol || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        0 $AUT
                      </Typography>
                      <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        {interaction.integrations || 0}
                      </Typography>
                      <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        {Math.floor(Math.random() * 100) / 100} $AUT
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">You haven't created any interactions yet</Typography>
                <Box sx={{ mt: 2 }}>
                  <AutOsButton
                    variant="contained"
                    onClick={() => setOpenCreateModal(true)}
                    size="small"
                    sx={{
                      backgroundColor: '#6e56cf',
                      '&:hover': {
                        backgroundColor: '#7c66d5',
                      },
                      borderRadius: '4px',
                      py: 0.75,
                      fontSize: '0.75rem',
                      textTransform: 'none'
                    }}
                  >
                    Create Your First Interaction
                  </AutOsButton>
                </Box>
              </Box>
            )}
          </TabPanel>
        </Box>
      </Box>

      {/* Create Interaction Modal */}
      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: '#1E1F2E',
            backgroundImage: 'none',
            borderRadius: '4px',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.5)',
            height: { xs: '100vh', sm: '90vh' },
            margin: { xs: 0, sm: 2 }
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Suspense fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography color="offWhite.main">Loading...</Typography>
            </Box>
          }>
            <CreateInteraction onClose={() => setOpenCreateModal(false)} />
          </Suspense>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default memo(InteractionsPage); 