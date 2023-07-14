import {
  FC, useState, useEffect, MouseEvent,
} from 'react';
import { useSnackbar } from 'notistack';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import WifiIcon from '@mui/icons-material/Wifi';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

type OptionMenuProps = {
  downloadFunction: () => void; // Define the type of the prop
  refreshFunction: () => void; // Define the type of the prop
};

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

const OptionMenu: FC<OptionMenuProps> = ({ downloadFunction, refreshFunction}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [refreshCanBeClicked, setRefreshCanBeClicked] = useState(true);
  const {enqueueSnackbar} = useSnackbar();
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const ssdpFailedListener = window.electron.ipcRenderer.on('ssdp-failed', (arg) => {
      enqueueSnackbar('Discovery Failed (Are you connected?)', { variant: 'warning' });
    });
    const ssdpSuccessListener = window.electron.ipcRenderer.on('ssdp-success', (arg) => {
      enqueueSnackbar('Discovery Success, Now refresh to load your images', { variant: 'success' });
    });

    return () => {
      window.electron.ipcRenderer.removeEventListener('ssdp-success',ssdpSuccessListener);
      window.electron.ipcRenderer.removeEventListener('ssdp-failed',ssdpFailedListener);
    };
  }, []);
  const ssdpFunction = () => {
    window.electron.ipcRenderer.sendMessage('ssdp-start');
  };
  const handleRefresh = () => {
    refreshFunction();
    setRefreshCanBeClicked(false);
    setTimeout(() => setRefreshCanBeClicked(true), 5000);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Actions
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={ssdpFunction} disableRipple>
          <WifiIcon />
          Discover Camera
        </MenuItem>
        <MenuItem onClick={downloadFunction} disableRipple>
          <DownloadIcon />
          Download Checked
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem disabled={!refreshCanBeClicked} onClick={handleRefresh} disableRipple>
          <RefreshIcon />
          Refresh/Reconnect
        </MenuItem>
      </StyledMenu>
    </div>
  );
};

export default OptionMenu;
