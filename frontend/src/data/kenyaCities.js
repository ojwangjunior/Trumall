/**
 * Kenya Cities and Counties Data
 * Used for address forms and shipping zone matching
 */

export const KENYA_CITIES = [
  // Major cities (matching shipping zones in database)
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Eldoret',

  // Other major towns
  'Thika',
  'Malindi',
  'Kitale',
  'Garissa',
  'Kakamega',
  'Kisii',
  'Machakos',
  'Meru',
  'Nyeri',
  'Naivasha',
  'Ruiru',
  'Kikuyu',
  'Kiambu',
  'Kajiado',
  'Muranga',
  'Nyahururu',
  'Nanyuki',
  'Embu',
  'Kitui',
  'Makueni',
  'Kericho',
  'Bomet',
  'Narok',
  'Migori',
  'Homa Bay',
  'Bungoma',
  'Busia',
  'Siaya',
  'Vihiga',
  'Uasin Gishu',
  'Nandi',
  'Baringo',
  'Laikipia',
  'Isiolo',
  'Marsabit',
  'Mandera',
  'Wajir',
  'Lamu',
  'Kilifi',
  'Kwale',
  'Taita Taveta',
].sort();

export const KENYA_COUNTIES = [
  'Baringo',
  'Bomet',
  'Bungoma',
  'Busia',
  'Elgeyo-Marakwet',
  'Embu',
  'Garissa',
  'Homa Bay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kericho',
  'Kiambu',
  'Kilifi',
  'Kirinyaga',
  'Kisii',
  'Kisumu',
  'Kitui',
  'Kwale',
  'Laikipia',
  'Lamu',
  'Machakos',
  'Makueni',
  'Mandera',
  'Marsabit',
  'Meru',
  'Migori',
  'Mombasa',
  'Murang\'a',
  'Nairobi',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita-Taveta',
  'Tana River',
  'Tharaka-Nithi',
  'Trans-Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot'
].sort();

export const COUNTRIES = [
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
];

export const ADDRESS_LABELS = [
  { value: 'Home', icon: '🏠' },
  { value: 'Office', icon: '🏢' },
  { value: 'School', icon: '🎓' },
  { value: 'Other', icon: '📍' },
];

// Helper function to get cities for a country
export const getCitiesForCountry = (countryCode) => {
  switch (countryCode) {
    case 'KE':
    case 'Kenya':
      return KENYA_CITIES;
    // Add other countries as needed
    default:
      return [];
  }
};

// Helper function to get counties for a country
export const getCountiesForCountry = (countryCode) => {
  switch (countryCode) {
    case 'KE':
    case 'Kenya':
      return KENYA_COUNTIES;
    // Add other countries as needed
    default:
      return [];
  }
};
