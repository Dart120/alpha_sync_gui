import { createRoot } from 'react-dom/client';
import { SnackbarProvider, useSnackbar } from 'notistack';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<SnackbarProvider maxSnack={3}><App /></SnackbarProvider>);
