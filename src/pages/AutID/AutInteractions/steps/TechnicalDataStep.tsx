import { useState } from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputLabel, FormHelperText, useTheme, Chip, Link, Typography } from '@mui/material';
import { InteractionTemplateData } from '../CreateInteraction';
import { ethers } from 'ethers';

interface TechnicalDataStepProps {
  formData: InteractionTemplateData;
  updateFormData: (data: Partial<InteractionTemplateData>) => void;
}

const networks = [
  { id: 1, name: 'Ethereum Mainnet' },
  { id: 137, name: 'Polygon' },
  { id: 80002, name: 'Polygon Amoy (Testnet)', recommended: true },
  { id: 8453, name: 'Base' },
  { id: 84532, name: 'Base Sepolia (Testnet)' },
  { id: 42161, name: 'Arbitrum' },
  { id: 421614, name: 'Arbitrum Sepolia (Testnet)' },
  { id: 10, name: 'Optimism' },
  { id: 11155111, name: 'Ethereum Sepolia (Testnet)' }
];

const TechnicalDataStep = ({ formData, updateFormData }: TechnicalDataStepProps) => {
  const theme = useTheme();
  const [addressError, setAddressError] = useState('');
  const [uriError, setUriError] = useState('');

  const handleContractAddressChange = (value: string) => {
    updateFormData({ targetContract: value });
    
    // Validate the address format
    if (value && !ethers.isAddress(value)) {
      setAddressError('Please enter a valid Ethereum address');
    } else {
      setAddressError('');
    }
  };

  const handleFunctionABIChange = (value: string) => {
    updateFormData({ functionABI: value });
    
    // Simple validation for functionABI
    if (value && !value.includes('(') && !value.startsWith('{') && !value.startsWith('http')) {
      setUriError('Enter a function signature like "functionName(type1,type2)" or a valid JSON');
    } else {
      setUriError('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        fullWidth
        label="Contract Address"
        variant="outlined"
        value={formData.targetContract}
        onChange={(e) => handleContractAddressChange(e.target.value)}
        placeholder="Contract address of the protocol/dapp"
        error={!!addressError}
        helperText={addressError || 'Enter the contract address of the protocol/dapp'}
        InputLabelProps={{
          sx: { color: 'offWhite.dark' }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: addressError ? 'error.main' : 'offWhite.dark',
            },
            '&:hover fieldset': {
              borderColor: addressError ? 'error.main' : 'offWhite.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: addressError ? 'error.main' : 'offWhite.main',
            },
            '& input': {
              color: 'offWhite.main'
            }
          }
        }}
      />
      
      <TextField
        fullWidth
        label="Function Signature or ABI"
        variant="outlined"
        value={formData.functionABI}
        onChange={(e) => handleFunctionABIChange(e.target.value)}
        placeholder="Enter function signature (e.g., transfer(address,uint256))"
        error={!!uriError}
        multiline
        rows={6}
        InputLabelProps={{
          sx: { color: 'offWhite.dark' }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: uriError ? 'error.main' : 'offWhite.dark',
            },
            '&:hover fieldset': {
              borderColor: uriError ? 'error.main' : 'offWhite.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: uriError ? 'error.main' : 'offWhite.main',
            },
            '& textarea': {
              color: 'offWhite.main'
            }
          }
        }}
        helperText={
          uriError || 
          <span>
            Preferably enter a simple function signature (e.g., <code>transfer(address,uint256)</code>). 
            If using JSON format, make sure it's properly formatted.
          </span>
        }
        FormHelperTextProps={{ 
          sx: { color: uriError ? 'error.main' : 'offWhite.dark' },
          style: { whiteSpace: 'normal' }
        }}
      />

      <Box sx={{ mt: 1, p: 2, border: '1px solid', borderColor: 'offWhite.dark', borderRadius: 1, backgroundColor: 'rgba(255,255,255,0.05)' }}>
        <Typography variant="caption" color="offWhite.main" sx={{ fontWeight: 'bold' }}>Recommended Examples:</Typography>
        <Box component="pre" sx={{ mt: 1, p: 1, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 1, overflow: 'auto', fontSize: '0.8rem', color: 'offWhite.main' }}>
          {`// Simple function signatures:
transfer(address,uint256)
mint(address,uint256) 
claim()

// For AutID minting (will be auto-corrected to the right contract): 
mintAndJoin(string,string,uint256,uint256,address)

// Or JSON format:
{"functionSignature":"transfer(address,uint256)"}`}
        </Box>
      </Box>
      
      <FormControl fullWidth>
        <InputLabel id="network-select-label" sx={{ color: 'offWhite.dark' }}>Network</InputLabel>
        <Select
          labelId="network-select-label"
          id="network-select"
          value={formData.networkId}
          label="Network"
          onChange={(e) => updateFormData({ networkId: Number(e.target.value) })}
          sx={{
            color: 'offWhite.main',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'offWhite.dark',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'offWhite.main',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: 'offWhite.main',
            },
            '.MuiSvgIcon-root': {
              color: 'offWhite.main',
            }
          }}
          defaultValue={80002}
        >
          <MenuItem value={0} disabled>
            <em>Select a network</em>
          </MenuItem>
          {networks.map((network) => (
            <MenuItem key={network.id} value={network.id}>
              {network.name}
              {network.recommended && (
                <Chip 
                  label="Recommended" 
                  size="small" 
                  sx={{ 
                    ml: 1, 
                    backgroundColor: '#4caf50',
                    color: 'white',
                    fontSize: '0.7rem',
                    height: '20px'
                  }} 
                />
              )}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText sx={{ color: 'offWhite.dark' }}>
          Select the network where the contract is deployed. Polygon Amoy is recommended for testing.
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default TechnicalDataStep; 