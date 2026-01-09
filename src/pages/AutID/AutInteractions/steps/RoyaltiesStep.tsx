import { useState } from 'react';
import { Box, TextField, FormControl, FormControlLabel, Radio, RadioGroup, FormLabel, InputAdornment, FormHelperText, useTheme, Tooltip } from '@mui/material';
import { InteractionTemplateData } from '../CreateInteraction';
import { ethers } from 'ethers';

interface RoyaltiesStepProps {
  formData: InteractionTemplateData;
  updateFormData: (data: Partial<InteractionTemplateData>) => void;
}

const RoyaltiesStep = ({ formData, updateFormData }: RoyaltiesStepProps) => {
  const theme = useTheme();
  const [authorError, setAuthorError] = useState('');

  const handleRoyaltyModelChange = (event) => {
    // Only allow selection of PublicGood (0) or IntegrationFee (1) options
    const value = parseInt(event.target.value);
    if (value !== 2) { // Prevent setting to UsageTier
      updateFormData({ royaltiesModel: value });
      
      // If switching to public goods model, reset price to 0
      if (value === 0) {
        updateFormData({ price: '0' });
      }
    }
  };

  const handleAuthorAddressChange = (value: string) => {
    updateFormData({ author: value });
    
    // Validate the address format
    if (value && !ethers.isAddress(value)) {
      setAuthorError('Please enter a valid Ethereum address');
    } else {
      setAuthorError('');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        fullWidth
        label="Author Address"
        variant="outlined"
        value={formData.author}
        onChange={(e) => handleAuthorAddressChange(e.target.value)}
        placeholder="Wallet address for receiving royalties"
        error={!!authorError}
        helperText={authorError || "The address where you want to receive royalties (if applicable)"}
        InputLabelProps={{
          sx: { color: 'offWhite.dark' }
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: authorError ? 'error.main' : 'offWhite.dark',
            },
            '&:hover fieldset': {
              borderColor: authorError ? 'error.main' : 'offWhite.main',
            },
            '&.Mui-focused fieldset': {
              borderColor: authorError ? 'error.main' : 'offWhite.main',
            },
            '& input': {
              color: 'offWhite.main'
            }
          }
        }}
        FormHelperTextProps={{ sx: { color: authorError ? 'error.main' : 'offWhite.dark' } }}
      />
      
      <FormControl>
        <FormLabel id="royalty-model-label" sx={{ color: 'offWhite.main', mb: 1 }}>Royalties Model</FormLabel>
        <RadioGroup
          aria-labelledby="royalty-model-label"
          name="royalty-model"
          value={formData.royaltiesModel.toString()}
          onChange={handleRoyaltyModelChange}
        >
          <FormControlLabel 
            value="0" 
            control={<Radio sx={{ color: 'offWhite.dark', '&.Mui-checked': { color: 'offWhite.main' } }} />} 
            label="Public Good (Unpaid)" 
            sx={{ color: 'offWhite.main' }}
          />
          <FormControlLabel 
            value="1" 
            control={<Radio sx={{ color: 'offWhite.dark', '&.Mui-checked': { color: 'offWhite.main' } }} />} 
            label="Integration Fee (Paid per integration)" 
            sx={{ color: 'offWhite.main' }}
          />
          <Tooltip title="Coming in the next release">
            <FormControlLabel 
              value="2" 
              disabled
              control={<Radio sx={{ color: 'gray', '&.Mui-disabled': { color: 'gray' } }} />} 
              label="Usage Tier (Advanced pricing model)" 
              sx={{ color: 'gray', opacity: 0.6, cursor: 'not-allowed' }}
            />
          </Tooltip>
        </RadioGroup>
        <FormHelperText sx={{ color: 'offWhite.dark' }}>
          Select how you want to be compensated for this interaction template
        </FormHelperText>
      </FormControl>
      
      {formData.royaltiesModel > 0 && (
        <TextField
          fullWidth
          label="Price"
          variant="outlined"
          type="number"
          value={formData.price}
          onChange={(e) => updateFormData({ price: e.target.value })}
          placeholder="Price for integrating this interaction"
          InputProps={{
            startAdornment: <InputAdornment position="start" sx={{ color: 'offWhite.dark' }}>$AUT</InputAdornment>,
            sx: {
              color: 'offWhite.main'
            }
          }}
          InputLabelProps={{
            sx: { color: 'offWhite.dark' }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'offWhite.dark',
              },
              '&:hover fieldset': {
                borderColor: 'offWhite.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'offWhite.main',
              }
            }
          }}
          helperText="Set the price in $AUT for integrating this interaction"
          FormHelperTextProps={{ sx: { color: 'offWhite.dark' } }}
        />
      )}
      
      <Box sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'offWhite.dark', borderRadius: 1 }}>
        <FormHelperText sx={{ color: 'offWhite.main', fontSize: '14px', mb: 1 }}>
          <b>Important Note:</b>
        </FormHelperText>
        <FormHelperText sx={{ color: 'offWhite.dark' }}>
          Interaction NFTs are non-transferable and are used solely for tracking and standardizing on-chain actions.
          They are not received by users who complete the interaction.
        </FormHelperText>
        <FormHelperText sx={{ color: 'offWhite.dark', mt: 1 }}>
          Currently, all interaction templates must be approved by the Āut team before being added to the global TaskRegistry.
        </FormHelperText>
      </Box>
    </Box>
  );
};

export default RoyaltiesStep; 