import { Box, Paper, Typography, useTheme, Tabs, Tab, Dialog, DialogContent, Container, useMediaQuery } from "@mui/material";
import { memo, useState, SyntheticEvent, useEffect } from "react";
import { AutOSHub } from "@api/models/hub.model";
import CreateInteraction from "./CreateInteraction";
import { AutOsButton } from "@components/AutButton";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { CONTRACT_ADDRESSES } from "@lib/constants";
import { InteractionFactoryABI } from "./contracts/InteractionFactoryABI";
import { useQueryUserInteractions, useQueryAllInteractions, Interaction } from "@utils/hooks/useQueryInteractions";

// Get the logo path from the public directory
const defaultLogoPath = '/apple-touch-icon.png';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`interaction-tabpanel-${index}`}
      aria-labelledby={`interaction-tab-${index}`}
      {...other}
      style={{
        height: '100%',
        width: '100%',
        display: value === index ? 'flex' : 'none',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {value === index && (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#393a47',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#4a4b59',
            }
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `interaction-tab-${index}`,
    'aria-controls': `interaction-tabpanel-${index}`,
  };
}

interface InteractionsParams {
  isLoading?: boolean;
  hubs?: AutOSHub[];
}

// Common card styles to maintain consistency
const cardStyles = {
  backgroundColor: '#242531',
  borderRadius: '4px',
  border: '1px solid #393a47',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: '#4a4b59',
  }
};

const AutInteractions = ({ isLoading = false, hubs = [] }: InteractionsParams) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState(0);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [completedInteractions, setCompletedInteractions] = useState<Interaction[]>([]);
  const { address, isConnected } = useAccount();

  // Use our custom hooks to fetch interactions from the subgraph
  const {
    data: userInteractions,
    loading: userInteractionsLoading,
    error: userInteractionsError
  } = useQueryUserInteractions(address);

  const {
    data: allInteractions,
    loading: allInteractionsLoading,
    error: allInteractionsError
  } = useQueryAllInteractions();

  // Simulate completed interactions - in a real app, this would be fetched from a backend
  useEffect(() => {
    // For now, just randomly mark some interactions as completed
    if (allInteractions && allInteractions.length > 0) {
      const completed = allInteractions
        .filter(() => Math.random() > 0.7) // Randomly select ~30% of interactions
        .slice(0, 5); // Limit to 5 max
      setCompletedInteractions(completed);
    }
  }, [allInteractions]);

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setShowStats(false); // Reset stats view when changing tabs
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  // Calculate total earnings from all user created interactions
  const calculateTotalEarnings = () => {
    return userInteractions ? userInteractions.reduce((total, interaction) => {
      const earnings = parseFloat(interaction.earnings) || 0;
      return total + earnings;
    }, 0).toFixed(2) : "0.00";
  };

  // Loading states
  const loading = userInteractionsLoading || allInteractionsLoading;
  const error = userInteractionsError || allInteractionsError;

  // Helper to handle logo fallback with proper sizing and containment
  const getLogoStyle = (logoUrl?: string) => {
    return {
      width: 36,
      height: 36,
      backgroundColor: '#393a47',
      borderRadius: '4px',
      mr: 2,
      backgroundImage: logoUrl ? `url(${logoUrl})` : `url(${defaultLogoPath})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "transparent"
      }}
      component={Paper}
      elevation={0}
    >
      {/* Header section - fixed */}
      <Box sx={{
        px: 2,
        pt: 2,
        pb: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: 'wrap',
        gap: 2,
        flexShrink: 0
      }}>
        <Box>
          <Typography color="offWhite.main" variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '1.8rem' } }}>
            Interactions
          </Typography>
          <Typography color="offWhite.dark" variant="body2">
            Discover, create, and delegate standardized blockchain interactions
          </Typography>
        </Box>
        <AutOsButton
          variant="contained"
          onClick={handleOpenCreateModal}
          size={isSmallScreen ? "small" : "medium"}
          sx={{
            backgroundColor: '#6e56cf',
            '&:hover': {
              backgroundColor: '#7c66d5',
            },
            borderRadius: '8px',
            px: 2,
            py: 1,
            minWidth: 'auto'
          }}
          startIcon={<span>+</span>}
        >
          Create new
        </AutOsButton>
      </Box>

      {/* Stats Cards - fixed */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        gap: 2,
        px: 2,
        mb: 2,
        flexShrink: 0
      }}>
        <Box sx={{
          flex: 1,
          p: 2,
          ...cardStyles,
          borderRadius: '8px'
        }}>
          <Typography variant="body2" color="offWhite.dark">Total Interactions</Typography>
          <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '11px' }}>Available in the registry</Typography>
          <Typography variant="h5" color="offWhite.main" sx={{ mt: 1 }}>
            {allInteractions ? allInteractions.length : 0}
          </Typography>
        </Box>

        <Box sx={{
          flex: 1,
          p: 2,
          ...cardStyles,
          borderRadius: '8px'
        }}>
          <Typography variant="body2" color="offWhite.dark">Your Creations</Typography>
          <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '11px' }}>Interactions you've created</Typography>
          <Typography variant="h5" color="offWhite.main" sx={{ mt: 1 }}>
            {userInteractions ? userInteractions.length : 0}
          </Typography>
        </Box>

        <Box sx={{
          flex: 1,
          p: 2,
          ...cardStyles,
          borderRadius: '8px'
        }}>
          <Typography variant="body2" color="offWhite.dark">Delegated Interactions</Typography>
          <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '11px' }}>Interactions you've delegated</Typography>
          <Typography variant="h5" color="offWhite.main" sx={{ mt: 1 }}>
            0
          </Typography>
        </Box>
      </Box>

      {/* Tabs Section - with proper flex layout for contained scrolling */}
      <Box sx={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Box sx={{
          borderBottom: 1,
          borderColor: '#393a47',
          px: 2,
          flexShrink: 0
        }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="interaction tabs"
            sx={{
              minHeight: '40px',
              '& .MuiTabs-indicator': {
                backgroundColor: '#6e56cf',
              },
              '& .MuiTab-root': {
                minHeight: '40px',
                color: 'offWhite.dark',
                '&.Mui-selected': {
                  color: 'offWhite.main',
                }
              }
            }}
          >
            <Tab label="All Interactions" {...a11yProps(0)} />
            <Tab label="Completed" {...a11yProps(1)} />
            <Tab label="Created" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* This will be scrollable while keeping tabs fixed */}
        <Box sx={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" color="offWhite.main" sx={{ px: 2, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' }, flexShrink: 0 }}>
              All available interactions
            </Typography>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">Loading interactions...</Typography>
              </Box>
            ) : allInteractions && allInteractions.length > 0 ? (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: 2,
                px: 2,
                pb: 2
              }}>
                {allInteractions.map(interaction => (
                  <Box
                    key={interaction.id}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      ...cardStyles
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={getLogoStyle(interaction.logo)}
                      >
                        {interaction.logo && (
                          <img
                            src={interaction.logo}
                            alt=""
                            style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const parentBox = target.parentElement;
                              if (parentBox) {
                                parentBox.style.backgroundImage = `url(${defaultLogoPath})`;
                              }
                            }}
                          />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="body1" color="offWhite.main" sx={{ fontSize: '0.9rem', fontWeight: 'medium' }}>
                          {interaction.name}
                        </Typography>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>
                          {interaction.protocol}
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
                          borderRadius: '8px',
                          py: 0.75,
                          fontSize: '0.75rem',
                          textTransform: 'none'
                        }}
                      >
                        Delegate
                      </AutOsButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">No interactions available yet</Typography>
              </Box>
            )}
          </TabPanel>

          {/* Completed tab content */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" color="offWhite.main" sx={{ px: 2, mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' }, flexShrink: 0 }}>
              Interactions completed by you
            </Typography>

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">Loading completed interactions...</Typography>
              </Box>
            ) : completedInteractions.length > 0 ? (
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                  lg: 'repeat(4, 1fr)'
                },
                gap: 2,
                px: 2,
                pb: 2
              }}>
                {completedInteractions.map(interaction => (
                  <Box
                    key={interaction.id}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      ...cardStyles
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={getLogoStyle(interaction.logo)}
                      >
                        {interaction.logo && (
                          <img
                            src={interaction.logo}
                            alt=""
                            style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              const parentBox = target.parentElement;
                              if (parentBox) {
                                parentBox.style.backgroundImage = `url(${defaultLogoPath})`;
                              }
                            }}
                          />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="body1" color="offWhite.main" sx={{ fontSize: '0.9rem', fontWeight: 'medium' }}>
                          {interaction.name}
                        </Typography>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>
                          {interaction.protocol}
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
                ))}
              </Box>
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

            {loading ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="offWhite.dark">Loading your created interactions...</Typography>
              </Box>
            ) : userInteractions && userInteractions.length > 0 ? (
              <>
                {/* Stats View - Only shown when stats toggle is active */}
                {showStats && (
                  <Box sx={{
                    p: 2,
                    mb: 2,
                    ...cardStyles,
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
                        <Box sx={getLogoStyle(interaction.logo)}>
                          {interaction.logo && (
                            <img
                              src={interaction.logo}
                              alt=""
                              style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                const parentBox = target.parentElement;
                                if (parentBox) {
                                  parentBox.style.backgroundImage = `url(${defaultLogoPath})`;
                                }
                              }}
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="offWhite.main" sx={{ fontWeight: 'medium' }}>
                          {interaction.name}
                        </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Protocol:</Typography>
                        <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.75rem' }}>{interaction.protocol}</Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Price:</Typography>
                        <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.75rem' }}>
                          {interaction.royaltiesModel === 0 ? '0 $AUT' : `${interaction.price} $AUT`}
                        </Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Integrations:</Typography>
                        <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.75rem' }}>{interaction.integrations}</Typography>
                      </Box>

                      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.75rem' }}>Earnings:</Typography>
                        <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.75rem' }}>{interaction.earnings}</Typography>
                      </Box>

                      {/* Desktop view */}
                      <Typography variant="body2" color="offWhite.main" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        {interaction.name}
                      </Typography>
                      <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        {interaction.protocol}
                      </Typography>
                      <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        {interaction.royaltiesModel === 0 ? '0 $AUT' : `${interaction.price} $AUT`}
                      </Typography>
                      <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        {interaction.integrations}
                      </Typography>
                      <Typography variant="body2" color="offWhite.dark" sx={{ fontSize: '0.8rem', display: { xs: 'none', md: 'block' } }}>
                        {interaction.earnings}
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
                    onClick={handleOpenCreateModal}
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
        onClose={handleCloseCreateModal}
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
          <CreateInteraction onClose={handleCloseCreateModal} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default memo(AutInteractions); 