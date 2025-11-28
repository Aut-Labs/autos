import { Box, TextField, useTheme } from '@mui/material';
import { InteractionTemplateData } from '../CreateInteraction';

interface GeneralInfoStepProps {
  formData: InteractionTemplateData;
  updateFormData: (data: Partial<InteractionTemplateData>) => void;
}

const GeneralInfoStep = ({ formData, updateFormData }: GeneralInfoStepProps) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <TextField
        fullWidth
        label="Name"
        variant="outlined"
        value={formData.name}
        onChange={(e) => updateFormData({ name: e.target.value })}
        placeholder="Enter a name for this interaction"
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
            },
            '& input': {
              color: 'offWhite.main'
            }
          }
        }}
      />
      
      <TextField
        fullWidth
        label="Description"
        variant="outlined"
        value={formData.description}
        onChange={(e) => updateFormData({ description: e.target.value })}
        placeholder="Describe what this interaction does"
        multiline
        rows={4}
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
            },
            '& textarea': {
              color: 'offWhite.main'
            }
          }
        }}
      />
      
      <TextField
        fullWidth
        label="Protocol/Hub"
        variant="outlined"
        value={formData.protocol || ''}
        onChange={(e) => updateFormData({ protocol: e.target.value })}
        placeholder="Enter the protocol or hub name (e.g., Uniswap, AAVE, etc.)"
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
            },
            '& input': {
              color: 'offWhite.main'
            }
          }
        }}
      />
      
      <TextField
        fullWidth
        label="Logo URL"
        variant="outlined"
        value={formData.logo}
        onChange={(e) => updateFormData({ logo: e.target.value })}
        placeholder="URL to protocol/dapp logo"
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
            },
            '& input': {
              color: 'offWhite.main'
            }
          }
        }}
      />
      
      <TextField
        fullWidth
        label="Action URL"
        variant="outlined"
        value={formData.actionUrl}
        onChange={(e) => updateFormData({ actionUrl: e.target.value })}
        placeholder="URL where the action takes place"
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
            },
            '& input': {
              color: 'offWhite.main'
            }
          }
        }}
      />
    </Box>
  );
};

export default GeneralInfoStep; 