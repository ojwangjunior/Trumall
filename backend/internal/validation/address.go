package validation

import (
	"errors"
	"regexp"
	"strings"
)

// ValidCountryCodes is a list of supported ISO 3166-1 alpha-2 country codes
var ValidCountryCodes = map[string]bool{
	"KE": true, // Kenya
	"UG": true, // Uganda
	"TZ": true, // Tanzania
	"RW": true, // Rwanda
	"BI": true, // Burundi
	"SS": true, // South Sudan
	"ET": true, // Ethiopia
	"SO": true, // Somalia
	// Add more as needed
}

// PostalCodePatterns defines regex patterns for postal codes by country
var PostalCodePatterns = map[string]*regexp.Regexp{
	"KE": regexp.MustCompile(`^\d{5}$`),                            // Kenya: 5 digits
	"UG": regexp.MustCompile(`^[A-Z]{2}\d{4}$`),                   // Uganda: 2 letters + 4 digits
	"TZ": regexp.MustCompile(`^\d{5}$`),                            // Tanzania: 5 digits
	"RW": regexp.MustCompile(`^\d{6}$`),                            // Rwanda: 6 digits
	"US": regexp.MustCompile(`^\d{5}(-\d{4})?$`),                  // US: 5 or 5+4 digits
	"GB": regexp.MustCompile(`^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$`), // UK
}

type AddressValidationError struct {
	Field   string
	Message string
}

func (e AddressValidationError) Error() string {
	return e.Message
}

// ValidateCountryCode validates ISO 3166-1 alpha-2 country code
func ValidateCountryCode(countryCode string) error {
	code := strings.ToUpper(strings.TrimSpace(countryCode))
	if code == "" {
		return &AddressValidationError{
			Field:   "country",
			Message: "country code is required",
		}
	}

	// Allow full country names for backward compatibility
	// Convert common full names to codes
	countryNameToCode := map[string]string{
		"KENYA":    "KE",
		"UGANDA":   "UG",
		"TANZANIA": "TZ",
		"RWANDA":   "RW",
	}

	if mappedCode, ok := countryNameToCode[code]; ok {
		code = mappedCode
	}

	if len(code) != 2 {
		return &AddressValidationError{
			Field:   "country",
			Message: "country code must be 2 characters (ISO 3166-1 alpha-2)",
		}
	}

	if !ValidCountryCodes[code] {
		return &AddressValidationError{
			Field:   "country",
			Message: "unsupported country code",
		}
	}

	return nil
}

// ValidatePostalCode validates postal code based on country
func ValidatePostalCode(postalCode, countryCode string) error {
	if postalCode == "" {
		// Postal code is optional for some countries
		return nil
	}

	code := strings.ToUpper(strings.TrimSpace(countryCode))

	// Convert full country names to codes
	countryNameToCode := map[string]string{
		"KENYA":    "KE",
		"UGANDA":   "UG",
		"TANZANIA": "TZ",
		"RWANDA":   "RW",
	}
	if mappedCode, ok := countryNameToCode[code]; ok {
		code = mappedCode
	}

	pattern, exists := PostalCodePatterns[code]
	if !exists {
		// No pattern defined, allow any format
		return nil
	}

	if !pattern.MatchString(strings.TrimSpace(postalCode)) {
		return &AddressValidationError{
			Field:   "postal_code",
			Message: "invalid postal code format for " + code,
		}
	}

	return nil
}

// ValidateAddress validates all address fields
func ValidateAddress(street, city, state, country, postalCode string) error {
	if strings.TrimSpace(street) == "" {
		return &AddressValidationError{
			Field:   "street",
			Message: "street address is required",
		}
	}

	if strings.TrimSpace(city) == "" {
		return &AddressValidationError{
			Field:   "city",
			Message: "city is required",
		}
	}

	if err := ValidateCountryCode(country); err != nil {
		return err
	}

	if err := ValidatePostalCode(postalCode, country); err != nil {
		return err
	}

	return nil
}

// NormalizeCountryCode converts country names to ISO codes
func NormalizeCountryCode(country string) string {
	code := strings.ToUpper(strings.TrimSpace(country))

	countryNameToCode := map[string]string{
		"KENYA":    "KE",
		"UGANDA":   "UG",
		"TANZANIA": "TZ",
		"RWANDA":   "RW",
		"BURUNDI":  "BI",
	}

	if mappedCode, ok := countryNameToCode[code]; ok {
		return mappedCode
	}

	// If it's already a 2-letter code, return as is
	if len(code) == 2 && ValidCountryCodes[code] {
		return code
	}

	// Return original if no mapping found
	return country
}

// ValidateCity validates city name
func ValidateCity(city string) error {
	city = strings.TrimSpace(city)
	if city == "" {
		return errors.New("city is required")
	}

	if len(city) < 2 {
		return errors.New("city name too short")
	}

	if len(city) > 100 {
		return errors.New("city name too long")
	}

	return nil
}
