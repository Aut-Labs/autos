import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Button,
  StepContent,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import GeneralInfoStep from './steps/GeneralInfoStep';
import TechnicalDataStep from './steps/TechnicalDataStep';
import RoyaltiesStep from './steps/RoyaltiesStep';
import { AutOsButton } from '@components/AutButton';
import { useAccount } from 'wagmi';
import { useSelector } from 'react-redux';
import { SelectedAutID } from '@store/aut/aut.reducer';
import { ethers } from 'ethers';
import CloseIcon from '@mui/icons-material/Close';
import { InteractionFactoryABI } from './contracts/InteractionFactoryABI';
import { SelectedNetwork } from '@store/WalletProvider/WalletProvider';
import { useAutConnector } from '@aut-labs/connector';
// SDK removed - using local stub implementation

import { CONTRACT_ADDRESSES } from '@lib/constants';
import { environment } from '@api/environment';

// Define the steps
const steps = [
  {
    label: 'General Info',
    description: 'Provide basic information about the interaction'
  },
  {
    label: 'Technical Data',
    description: 'Define the technical details of the contract and function'
  },
  {
    label: 'Royalties',
    description: 'Set up your royalty model and pricing'
  }
];

// Define the interface for the interaction template
export interface InteractionTemplateData {
  name: string;
  description: string;
  protocol?: string;
  logo: string;
  actionUrl: string;
  targetContract: string;
  functionABI: string;
  networkId: number;
  price: string;
  royaltiesModel: number; // 0: PublicGood, 1: IntegrationFee, 2: UsageTier
  author: string;
}

interface CreateInteractionProps {
  onClose?: () => void;
}

// Get contract address from central configuration
const INTERACTION_FACTORY_ADDRESS = CONTRACT_ADDRESSES.INTERACTION_FACTORY || '0x5f9d4a1b1f739F9eAc7fE99CC8a555591943F3e9';

// Default networkId (Amoy testnet)
const DEFAULT_NETWORK_ID = 80002;

const CreateInteraction = ({ onClose }: CreateInteractionProps) => {
  const theme = useTheme();
  const { address, isConnected } = useAccount();
  const autID = useSelector(SelectedAutID);
  const selectedNetwork = useSelector(SelectedNetwork);
  const { multiSigner } = useAutConnector();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [isSubmitReady, setIsSubmitReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const [formData, setFormData] = useState<InteractionTemplateData>({
    name: '',
    description: '',
    protocol: '',
    logo: '',
    actionUrl: '',
    targetContract: '',
    functionABI: '',
    networkId: selectedNetwork?.chainId ? Number(selectedNetwork.chainId) : DEFAULT_NETWORK_ID,
    price: '0',
    royaltiesModel: 0,
    author: address || ''
  });

  // Update author address when connected wallet changes
  useEffect(() => {
    if (address) {
      setFormData(prev => ({ ...prev, author: address }));
    }
  }, [address]);

  // Add debug logging to see AutID data
  useEffect(() => {
    if (address && autID) {
      console.log('Connected address:', address);
      console.log('Selected AutID:', autID);

      // Check if the address matches the AutID address
      // This can help determine if there's a mismatch
      if (autID.properties?.address) {
        const autIDAddress = autID.properties.address;
        console.log('AutID address:', autIDAddress);
        console.log('Address match:', autIDAddress.toLowerCase() === address.toLowerCase());
      }
    }
  }, [address, autID]);

  // Log the actual contract address being used
  useEffect(() => {
    console.log('Using InteractionFactory contract address:', INTERACTION_FACTORY_ADDRESS);
  }, []);

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.name && formData.description && formData.protocol && formData.logo && formData.actionUrl;
      case 1:
        return formData.targetContract && formData.functionABI && formData.networkId > 0;
      case 2:
        return formData.author && (formData.royaltiesModel === 0 || (formData.royaltiesModel > 0 && formData.price !== ''));
      default:
        return false;
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setTxHash('');
    setError('');
    setTransactionStatus('');
    setIsSubmitReady(false);
    setFormData({
      name: '',
      description: '',
      protocol: '',
      logo: '',
      actionUrl: '',
      targetContract: '',
      functionABI: '',
      networkId: selectedNetwork?.chainId ? Number(selectedNetwork.chainId) : DEFAULT_NETWORK_ID,
      price: '0',
      royaltiesModel: 0,
      author: address || ''
    });
  };

  // Update this function to check if the contract is paused and if the user has an AutID
  const checkContractPermissions = async () => {
    try {
      // Create a read-only contract to check permissions
      const provider = multiSigner.readOnlySigner;
      const contract = new ethers.Contract(
        INTERACTION_FACTORY_ADDRESS,
        InteractionFactoryABI,
        provider
      );

      // First, explicitly check if the contract is paused
      try {
        // Check if the paused function exists
        if (typeof contract.paused === 'function') {
          const isPaused = await contract.paused();
          if (isPaused) {
            console.log('Contract is paused');
            return { allowed: false, reason: 'The InteractionFactory contract is currently paused by the contract owner. Please try again later.' };
          }
        }
      } catch (error) {
        console.log('Could not determine if contract is paused:', error);
        // If we can't check, assume it might be paused
      }

      // Since we have autID data from the state and we know the connected address matches, 
      // we can skip the direct contract call if the AutID is already loaded
      if (autID && autID.properties?.address) {
        const autIDAddress = autID.properties.address;
        if (autIDAddress.toLowerCase() === address.toLowerCase()) {
          console.log('AutID already verified through state data');
          return { allowed: true };
        }
      }

      // Only make the contract call if needed
      try {
        // Manually call the contract using lower-level call to verify the method exists
        const hasAutIDData = await provider.call({
          to: INTERACTION_FACTORY_ADDRESS,
          data: ethers.id("hasAutID(address)").slice(0, 10) + ethers.zeroPadValue(address, 32).slice(2)
        });

        // If we got data back, try to decode it
        if (hasAutIDData && hasAutIDData !== '0x') {
          try {
            // Use AbiCoder instead of decodeResult
            const abiCoder = new ethers.AbiCoder();
            const hasAutIDResult = abiCoder.decode(['bool'], hasAutIDData)[0];
            console.log('hasAutID result:', hasAutIDResult);

            if (!hasAutIDResult) {
              return {
                allowed: false,
                reason: 'Your wallet is not associated with an AutID. Make sure you have an AutID and are connected with the correct wallet.'
              };
            }
          } catch (decodeError) {
            console.error('Error decoding result:', decodeError);
            // Fall back to using autID from state
            if (autID && autID.properties?.address && autID.properties.address.toLowerCase() === address.toLowerCase()) {
              return { allowed: true };
            }
          }
        } else {
          // Method not found or returned empty data, try alternative approach
          console.log('hasAutID method not available, assuming valid for known AutID owner');

          // If we have autID data and the address matches, we'll assume permission
          if (autID && autID.properties?.address && autID.properties.address.toLowerCase() === address.toLowerCase()) {
            return { allowed: true };
          }

          return {
            allowed: false,
            reason: 'Could not verify AutID ownership. The contract may not support this method yet.'
          };
        }
      } catch (error) {
        console.error('Error checking AutID ownership:', error);

        // Fallback to using autID from state if we have it
        if (autID && autID.properties?.address && autID.properties.address.toLowerCase() === address.toLowerCase()) {
          console.log('Using AutID from state data as fallback verification');
          return { allowed: true };
        }

        return {
          allowed: false,
          reason: 'Could not verify AutID ownership. Please make sure you have an AutID and try again.'
        };
      }

      console.log('User has an AutID and contract is active');
      return { allowed: true };

    } catch (error) {
      console.error('Error checking contract permissions:', error);

      // Last resort fallback: If we have autID data, use that
      if (autID && autID.properties?.address && autID.properties.address.toLowerCase() === address.toLowerCase()) {
        return { allowed: true };
      }

      return { allowed: false, reason: 'Error connecting to the contract. Please try again later.' };
    }
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      setError('Please connect your wallet to continue.');
      return;
    }

    if (!multiSigner?.signer) {
      setError('No wallet signer available. Please reconnect your wallet.');
      return;
    }

    // Add a check for potential address mismatch
    if (autID && autID.properties?.address) {
      const autIDAddress = autID.properties.address;
      if (autIDAddress.toLowerCase() !== address.toLowerCase()) {
        setError(`Your connected wallet (${address}) doesn't match the AutID address (${autIDAddress}). Please connect with the wallet that owns this AutID.`);
        return;
      }
    }

    // Check if the user has permission to create interactions
    const hasPermission = await checkContractPermissions();
    if (!hasPermission.allowed) {
      setError(hasPermission.reason);
      return;
    }

    try {
      setError('');
      setLoading(true);
      setTransactionStatus('Preparing transaction...');

      // Check if targetContract is a valid address
      if (!ethers.isAddress(formData.targetContract)) {
        setError('Target contract address is not a valid Ethereum address');
        setTransactionStatus('');
        setLoading(false);
        return;
      }

      // Verify network ID is valid
      const validNetworks = [1, 5, 137, 80001, 80002]; // Mainnet, Goerli, Polygon, Mumbai, Amoy
      if (!validNetworks.includes(formData.networkId)) {
        setError(`Network ID ${formData.networkId} is not supported. Please use a valid network.`);
        setTransactionStatus('');
        setLoading(false);
        return;
      }

      // Simplify the functionABI
      let functionABI = formData.functionABI;
      if (formData.functionABI.includes('(') && formData.functionABI.includes(')')) {
        functionABI = formData.functionABI.trim().substring(0, 60);
      } else {
        functionABI = functionABI.trim().substring(0, 60);
      }

      // Sanitize all input strings - remove non-ASCII and special characters
      const cleanStr = (str: string) => {
        return str.replace(/[^\x20-\x7E]/g, '')
          .replace(/Āut/g, 'Aut')
          .replace(/āut/g, 'aut')
          .trim();
      };

      // SPECIAL HANDLING FOR AUT ID MINTING INTERACTIONS
      // If this is an AutID interaction template (based on function name or target contract)
      // Auto-correct the target contract address to use the proper AutID contract
      let targetContract = formData.targetContract;

      // Check if this might be an AutID interaction based on function names
      const autIDFunctionPatterns = [
        'mint',
        'createRecord',
        'joinHub',
        'mintAndJoin'
      ];

      const isAutIDFunctionPattern = autIDFunctionPatterns.some(pattern =>
        functionABI.toLowerCase().includes(pattern.toLowerCase())
      );

      // Check if name or description mentions AutID
      const isAutIDMentionedInMeta =
        formData.name.toLowerCase().includes('autid') ||
        formData.name.toLowerCase().includes('aut id') ||
        formData.description.toLowerCase().includes('autid') ||
        formData.description.toLowerCase().includes('aut id');

      // If it looks like an AutID interaction, use the correct address
      if (isAutIDFunctionPattern || isAutIDMentionedInMeta) {
        console.log('Detected AutID minting interaction, using correct AutID contract address');
        if (CONTRACT_ADDRESSES.AUTID) {
          targetContract = CONTRACT_ADDRESSES.AUTID;
          console.log('Using AutID contract address:', targetContract);
        }
      }

      // Create minimal template data with sanitized inputs
      const minimalTemplate = {
        name: cleanStr(formData.name).substring(0, 24),
        description: cleanStr(formData.description).substring(0, 250),
        protocol: cleanStr(formData.protocol || '').substring(0, 24),
        logo: cleanStr(formData.logo).substring(0, 40),
        actionUrl: cleanStr(formData.actionUrl).substring(0, 40),
        targetContract: targetContract, // Use potentially corrected target address
        functionABI: cleanStr(functionABI),
        networkId: BigInt(formData.networkId),
        royaltyRecipient: address,
        royaltiesModel: Number(formData.royaltiesModel),
        price: ethers.parseEther(formData.price || '0')
      };

      console.log('Using minimal template data:', minimalTemplate);

      try {
        // Connect to the contract directly using the signer
        const contract = new ethers.Contract(
          INTERACTION_FACTORY_ADDRESS,
          InteractionFactoryABI,
          multiSigner.signer
        );

        setTransactionStatus('Waiting for wallet confirmation...');

        // Add detailed debug info about what we're sending
        console.log('Sending createInteractionTemplate with params:', {
          targetContract: minimalTemplate.targetContract,
          functionABI: minimalTemplate.functionABI,
          lookingForAutID: minimalTemplate.targetContract === CONTRACT_ADDRESSES.AUTID,
          contractAddress: INTERACTION_FACTORY_ADDRESS
        });



        // Log actual parameters being sent
        console.log('Raw parameters being sent to contract:', [
          minimalTemplate.name,
          minimalTemplate.description,
          minimalTemplate.protocol,
          minimalTemplate.logo,
          minimalTemplate.actionUrl,
          minimalTemplate.targetContract,
          minimalTemplate.functionABI,
          minimalTemplate.networkId,
          minimalTemplate.royaltyRecipient,
          minimalTemplate.royaltiesModel,
          minimalTemplate.price
        ]);

        // Call the contract method with parameters as array (not as object)
        // This matches the expected parameter structure in the Solidity contract
        const tx = await contract.createInteractionTemplate([
          minimalTemplate.name,
          minimalTemplate.description,
          minimalTemplate.protocol,
          minimalTemplate.logo,
          minimalTemplate.actionUrl,
          minimalTemplate.targetContract,
          minimalTemplate.functionABI,
          minimalTemplate.networkId,
          minimalTemplate.royaltyRecipient,
          minimalTemplate.royaltiesModel,
          minimalTemplate.price
        ]);

        setTxHash(tx.hash);
        setTransactionStatus('Transaction submitted. Waiting for confirmation...');

        // Wait for the transaction to be mined
        const receipt = await tx.wait();

        console.log('Transaction receipt:', receipt);
        setTransactionStatus('Transaction confirmed! Interaction NFT created successfully.');
        setActiveStep(steps.length);

        // Try to extract the token ID from the event logs
        try {
          const interactionCreatedEvent = receipt.logs.find(log => {
            const topic = log.topics[0];
            return topic === ethers.id("InteractionTemplateCreated(uint256,address,bytes32)");
          });

          if (interactionCreatedEvent && interactionCreatedEvent.topics[1]) {
            const tokenId = parseInt(interactionCreatedEvent.topics[1], 16);
            setTransactionStatus(`Transaction confirmed! Interaction NFT #${tokenId} created successfully.`);
          }
        } catch (logError) {
          console.error('Error parsing event logs:', logError);
        }

        setLoading(false);
      } catch (error: any) {
        console.error('Error submitting interaction template:', error);

        // Collect detailed error information
        const errorDetails = {
          message: error.message || 'Unknown error',
          code: error.code,
          data: error.data,
          receipt: error.receipt,
          reason: error.reason,
          stack: error.stack,
        };

        setDebugInfo(JSON.stringify(errorDetails, null, 2));

        // Provide more detailed error information
        let errorMessage = 'Error creating interaction. Please try again.';

        if (error.code === 'ACTION_REJECTED') {
          errorMessage = 'Transaction was rejected by the user.';
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
          errorMessage = 'Insufficient funds to complete this transaction.';
        } else if (error.code === 'CALL_EXCEPTION' || error.receipt?.status === 0) {
          // Check for specific error messages
          if (error.reason && error.reason.includes('contract is paused')) {
            errorMessage = 'The InteractionFactory contract is currently paused by the contract owner. Please try again later.';
          } else if (error.reason && error.reason.includes('does not own an AutID')) {
            errorMessage = 'Your wallet is not associated with an AutID. The contract requires you to have an AutID linked to your connected wallet address.';
          } else {
            errorMessage = 'Transaction failed on the blockchain. This might be because:';
            errorMessage += '\n- Your wallet detected the transaction as risky';
            errorMessage += '\n- The contract requirements were not met';

            if (error.reason) {
              errorMessage += `\nReason: ${error.reason}`;
            }
          }
        } else if (error.message) {
          errorMessage = `Error: ${error.message}`;
        }

        setError(errorMessage);
        setTransactionStatus('');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Error submitting interaction template:', error);

      // Collect detailed error information
      const errorDetails = {
        message: error.message || 'Unknown error',
        code: error.code,
        data: error.data,
        receipt: error.receipt,
        reason: error.reason,
        stack: error.stack,
      };

      setDebugInfo(JSON.stringify(errorDetails, null, 2));

      // Provide more detailed error information
      let errorMessage = 'Error creating interaction. Please try again.';

      if (error.code === 'ACTION_REJECTED') {
        errorMessage = 'Transaction was rejected by the user.';
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Insufficient funds to complete this transaction.';
      } else if (error.code === 'CALL_EXCEPTION' || error.receipt?.status === 0) {
        // Check for specific error messages
        if (error.reason && error.reason.includes('contract is paused')) {
          errorMessage = 'The InteractionFactory contract is currently paused by the contract owner. Please try again later.';
        } else if (error.reason && error.reason.includes('does not own an AutID')) {
          errorMessage = 'Your wallet is not associated with an AutID. The contract requires you to have an AutID linked to your connected wallet address.';
        } else {
          errorMessage = 'Transaction failed on the blockchain. This might be because:';
          errorMessage += '\n- Your wallet detected the transaction as risky';
          errorMessage += '\n- The contract requirements were not met';

          if (error.reason) {
            errorMessage += `\nReason: ${error.reason}`;
          }
        }
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      setError(errorMessage);
      setTransactionStatus('');
      setLoading(false);
    }
  };

  const updateFormData = (newData: Partial<InteractionTemplateData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const getExplorerLink = () => {
    // Amoy explorer URL
    const amoyExplorer = 'https://www.oklink.com/amoy';
    if (!txHash) return '#';
    return `${amoyExplorer}/tx/${txHash}`;
  };

  return (
    <Box sx={{
      position: 'relative',
      p: 4,
      height: '100%',
      maxHeight: '80vh',
      overflow: 'auto',
      backgroundColor: '#1E1F2E'
    }}>
      {/* Close button */}
      <IconButton
        onClick={handleCloseModal}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'offWhite.main',
          zIndex: 1
        }}
      >
        <CloseIcon />
      </IconButton>

      <Typography variant="h4" color="offWhite.main" sx={{ mb: 2 }}>
        Create Interaction Template
      </Typography>

      <Typography variant="body1" color="offWhite.dark" sx={{ mb: 2 }}>
        Create context-agnostic action artifacts as NFTs to track and standardize on-chain actions across different protocols.
      </Typography>

      {!isConnected && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(237, 108, 2, 0.15)',
            color: '#ff9800',
            '& .MuiAlert-icon': {
              color: '#ff9800'
            }
          }}
        >
          Please connect your wallet to create an interaction.
        </Alert>
      )}

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

      {transactionStatus && (
        <Alert
          severity="info"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(3, 169, 244, 0.15)',
            color: '#03a9f4',
            '& .MuiAlert-icon': {
              color: '#03a9f4'
            }
          }}
        >
          {transactionStatus}
        </Alert>
      )}

      {debugInfo && (
        <Alert
          severity="warning"
          sx={{
            mb: 3,
            backgroundColor: 'rgba(37, 38, 64, 0.8)',
            color: '#aaaaaa',
            '& .MuiAlert-icon': {
              color: '#aaaaaa'
            },
            '& pre': {
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '0.7rem',
              maxHeight: '100px',
              overflow: 'auto'
            }
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Debug Info:</Typography>
          <pre>{debugInfo}</pre>
        </Alert>
      )}

      <Stepper
        activeStep={activeStep}
        orientation="vertical"
        sx={{
          '& .MuiStepLabel-label': {
            color: 'offWhite.dark',
            '&.Mui-active': {
              color: 'offWhite.main'
            },
            '&.Mui-completed': {
              color: 'offWhite.main'
            }
          },
          '& .MuiStepIcon-root': {
            color: '#576176',
            '&.Mui-active': {
              color: 'offWhite.main'
            },
            '&.Mui-completed': {
              color: '#4caf50'
            }
          },
          '& .MuiStepConnector-line': {
            borderColor: '#576176'
          }
        }}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              <Typography color="offWhite.main">{step.label}</Typography>
            </StepLabel>
            <StepContent
              sx={{
                borderColor: '#576176',
                ml: 0.5
              }}
            >
              <Typography color="offWhite.dark" sx={{ mb: 2 }}>{step.description}</Typography>

              <Box sx={{ backgroundColor: '#242531', p: 3, borderRadius: '8px', mb: 2 }}>
                {index === 0 && (
                  <GeneralInfoStep
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {index === 1 && (
                  <TechnicalDataStep
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}

                {index === 2 && (
                  <RoyaltiesStep
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <AutOsButton
                  disabled={index === 0 || loading}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{
                    mr: 1,
                    borderRadius: '8px',
                    borderColor: '#576176',
                    color: 'offWhite.main',
                    '&:hover': {
                      borderColor: 'offWhite.main'
                    }
                  }}
                >
                  Back
                </AutOsButton>
                <AutOsButton
                  disabled={!isStepComplete(index) || loading || !isConnected || !multiSigner?.signer}
                  variant="contained"
                  onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                  sx={{
                    backgroundColor: '#576176',
                    '&:hover': {
                      backgroundColor: '#6e788c',
                    },
                    borderRadius: '8px'
                  }}
                >
                  {loading && index === steps.length - 1 ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    index === steps.length - 1 ? 'Submit' : 'Continue'
                  )}
                </AutOsButton>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === steps.length && (
        <Box sx={{ p: 3, borderRadius: '8px', backgroundColor: '#242531', border: '1px solid #576176' }}>
          <Typography color="offWhite.main" sx={{ mt: 2, mb: 1, fontWeight: 500 }}>
            All steps completed - Interaction Template submitted successfully!
          </Typography>

          {txHash && (
            <Box sx={{ mt: 2, mb: 3 }}>
              <Typography color="offWhite.dark">
                Transaction Hash:
              </Typography>
              <Typography
                component="a"
                href={getExplorerLink()}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  wordBreak: 'break-all',
                  color: '#4caf50',
                  textDecoration: 'underline'
                }}
              >
                {txHash}
              </Typography>
            </Box>
          )}

          <Typography color="offWhite.dark" sx={{ mt: 2, mb: 3 }}>
            Your interaction template has been created as an NFT on Polygon Amoy. The Āut team will review it for possible integration into the global TaskRegistry.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <AutOsButton
              onClick={handleCloseModal}
              variant="outlined"
              sx={{
                borderRadius: '8px',
                borderColor: '#576176',
                color: 'offWhite.main',
                '&:hover': {
                  borderColor: 'offWhite.main'
                }
              }}
            >
              Close
            </AutOsButton>
            <AutOsButton
              onClick={handleReset}
              variant="contained"
              sx={{
                backgroundColor: '#576176',
                '&:hover': {
                  backgroundColor: '#6e788c',
                },
                borderRadius: '8px'
              }}
            >
              Create Another
            </AutOsButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CreateInteraction; 