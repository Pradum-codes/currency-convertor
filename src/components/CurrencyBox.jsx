import { useId } from "react";
import PropTypes from "prop-types";
import {
  Box,
  FormControl,
  InputBase,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

/* Simple flag emoji from country code embedded in the currency string */
const currencyFlags = {
  USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', INR: '🇮🇳', JPY: '🇯🇵',
  AUD: '🇦🇺', CAD: '🇨🇦', CHF: '🇨🇭', CNY: '🇨🇳', KRW: '🇰🇷',
  BRL: '🇧🇷', MXN: '🇲🇽', SGD: '🇸🇬', HKD: '🇭🇰', NZD: '🇳🇿',
  SEK: '🇸🇪', NOK: '🇳🇴', DKK: '🇩🇰', ZAR: '🇿🇦', RUB: '🇷🇺',
  TRY: '🇹🇷', THB: '🇹🇭', IDR: '🇮🇩', MYR: '🇲🇾', PHP: '🇵🇭',
  PLN: '🇵🇱', AED: '🇦🇪', SAR: '🇸🇦', TWD: '🇹🇼', ARS: '🇦🇷',
  CLP: '🇨🇱', COP: '🇨🇴', EGP: '🇪🇬', ILS: '🇮🇱', PKR: '🇵🇰',
  NGN: '🇳🇬', BDT: '🇧🇩', VND: '🇻🇳', CZK: '🇨🇿', HUF: '🇭🇺',
  RON: '🇷🇴', BGN: '🇧🇬', HRK: '🇭🇷', UAH: '🇺🇦', PEN: '🇵🇪',
};

function getFlag(code) {
  return currencyFlags[code] || '💱';
}

function CurrencyBox({
    label,
    amount,
    onAmountChange,
    onCurrencyChange,
    currencyOptions = [],
    selectCurrency = 'USD',
    isReadOnly = false,
    isDisabled = false,
    variant = 'from',
}) {
  const inputId = useId();

  return (
    <Box className={`currency-box currency-box--${variant}`}>
      <Typography className="currency-box__label" variant="caption">
        {label}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={1.5} className="currency-box__row">
        {/* Currency selector */}
        <FormControl disabled={isDisabled} className="currency-box__select-wrap">
          <Select
            id={`${inputId}-select`}
            value={selectCurrency}
            onChange={(e) => onCurrencyChange(e.target.value)}
            variant="standard"
            disableUnderline
            className="currency-box__select"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 280,
                  borderRadius: 2,
                  mt: 1,
                  boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                },
              },
            }}
            renderValue={(value) => (
              <Stack direction="row" alignItems="center" spacing={1}>
                <span className="currency-flag">{getFlag(value)}</span>
                <Typography variant="body1" fontWeight={600}>{value}</Typography>
              </Stack>
            )}
          >
            {currencyOptions.map((currency) => (
              <MenuItem key={currency} value={currency} sx={{ gap: 1 }}>
                <span style={{ fontSize: '1.15rem' }}>{getFlag(currency)}</span>
                {currency}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Amount input */}
        <InputBase
          id={inputId}
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          readOnly={isReadOnly}
          disabled={isDisabled}
          className="currency-box__amount"
          placeholder="0.00"
          inputProps={{
            style: {
              textAlign: 'right',
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: '"Space Grotesk", monospace',
            },
          }}
        />
      </Stack>
    </Box>
  );
}

CurrencyBox.propTypes = {
  label: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  onCurrencyChange: PropTypes.func.isRequired,
  currencyOptions: PropTypes.arrayOf(PropTypes.string),
  selectCurrency: PropTypes.string,
  isReadOnly: PropTypes.bool,
  isDisabled: PropTypes.bool,
  variant: PropTypes.string,
};

export default CurrencyBox;
