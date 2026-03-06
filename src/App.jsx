import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Fade,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import SwapVertRoundedIcon from '@mui/icons-material/SwapVertRounded'
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
import './App.css'
import useCurrencyInfo from './customHook/useCurrencyInfo'
import CurrencyBox from './components/CurrencyBox'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6366f1' },
    secondary: { main: '#ec4899' },
    background: { default: '#0f0b2e', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Space Grotesk", "SF Pro Display", "Segoe UI", sans-serif',
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.01em',
        },
      },
    },
  },
})

function App() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [convertedAmount, setConvertedAmount] = useState('');
  const [swapAnim, setSwapAnim] = useState(false);

  const { data: currencyInfo, isLoading, error } = useCurrencyInfo(from);

  const options = useMemo(
    () => (currencyInfo.conversion_rates ? Object.keys(currencyInfo.conversion_rates) : []),
    [currencyInfo]
  );

  const rate = useMemo(
    () => currencyInfo?.conversion_rates?.[to] ?? null,
    [currencyInfo, to]
  );

  const convert = useCallback(() => {
    if (!currencyInfo?.conversion_rates) {
      setConvertedAmount('');
      return;
    }

    const r = currencyInfo.conversion_rates[to];
    const numericAmount = Number(amount);

    if (!r || Number.isNaN(numericAmount)) {
      setConvertedAmount('');
      return;
    }

    setConvertedAmount((numericAmount * r).toFixed(2));
  }, [amount, currencyInfo, to]);

  const swapCurrencies = () => {
    setSwapAnim(true);
    setFrom(to);
    setTo(from);
    setTimeout(() => setSwapAnim(false), 400);
  };

  useEffect(() => {
    convert();
  }, [convert]);

  return (
    <ThemeProvider theme={theme}>
      <Box className="main-container">
        {/* Floating decorative orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Fade in timeout={600}>
            <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <CurrencyExchangeRoundedIcon
                  sx={{ fontSize: 38, color: '#a78bfa' }}
                />
                <Typography
                  variant="h3"
                  className="app-title"
                  sx={{ color: '#fff' }}
                >
                  Currency Converter
                </Typography>
              </Stack>
              <Typography
                variant="body1"
                sx={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em' }}
              >
                Real-time exchange rates
              </Typography>
            </Stack>
          </Fade>

          {/* Main card */}
          <Fade in timeout={900}>
            <Paper className="app-card" elevation={0}>
              <Stack spacing={0}>
                {/* From section */}
                <CurrencyBox
                  label="You send"
                  amount={amount}
                  currencyOptions={options}
                  onCurrencyChange={(currency) => setFrom(currency)}
                  selectCurrency={from}
                  onAmountChange={(nextAmount) => setAmount(nextAmount)}
                  isDisabled={isLoading || !options.length}
                  variant="from"
                />

                {/* Swap button divider */}
                <Box className="swap-row">
                  <Divider className="swap-divider" />
                  <Tooltip title="Swap currencies" arrow>
                    <IconButton
                      className={`swap-btn ${swapAnim ? 'swap-spin' : ''}`}
                      onClick={swapCurrencies}
                      disabled={isLoading || !options.length}
                      size="medium"
                    >
                      <SwapVertRoundedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Divider className="swap-divider" />
                </Box>

                {/* To section */}
                <CurrencyBox
                  label="They receive"
                  amount={convertedAmount}
                  currencyOptions={options}
                  onCurrencyChange={(currency) => setTo(currency)}
                  selectCurrency={to}
                  onAmountChange={() => {}}
                  isReadOnly
                  isDisabled={isLoading || !options.length}
                  variant="to"
                />
              </Stack>

              {/* Rate info + status */}
              <Stack spacing={1.5} sx={{ mt: 3 }}>
                {rate && !isLoading && !error ? (
                  <Fade in>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      className="rate-badge"
                    >
                      <TrendingUpRoundedIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#4b5563' }}>
                        1 {from} = {rate} {to}
                      </Typography>
                      <Chip
                        label="Live"
                        size="small"
                        sx={{
                          ml: 'auto',
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          bgcolor: '#dcfce7',
                          color: '#16a34a',
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                    </Stack>
                  </Fade>
                ) : null}

                {error ? (
                  <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                ) : null}

                {isLoading ? (
                  <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                    <CircularProgress size={16} sx={{ color: '#6366f1' }} />
                    <Typography variant="body2" color="text.secondary">
                      Fetching latest rates…
                    </Typography>
                  </Stack>
                ) : null}
              </Stack>

              {/* Convert button */}
              <Box sx={{ px: 3, pb: 3, pt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={convert}
                  disabled={isLoading || !options.length}
                  className="convert-btn"
                  disableElevation
                >
                  {isLoading ? 'Loading…' : `Convert ${from} → ${to}`}
                </Button>
              </Box>
            </Paper>
          </Fade>

          {/* Footer */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 3,
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            Rates update automatically
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
