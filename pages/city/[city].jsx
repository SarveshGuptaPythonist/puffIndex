import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Badge,
  Card,
  CardBody,
  Divider,
  useColorModeValue,
  Collapse,
  useDisclosure,
  Icon
} from '@chakra-ui/react'
import { ArrowBackIcon, InfoIcon, ChevronDownIcon } from '@chakra-ui/icons'
// import { cities } from '../../data/cities'
import { cityCoordinates } from '../../data/cityCoordinates'

export default function CityPage({ cityData, aqiData, errors, isClientSide, cityName }) {
  const [clientData, setClientData] = useState({ cityData, aqiData, errors })
  const [loading, setLoading] = useState(isClientSide)
  const router = useRouter()

  useEffect(() => {
    if (isClientSide) {
      fetchClientData()
    }
  }, [isClientSide])

  const fetchClientData = async () => {
    setLoading(true)
    let newCityData = null
    let newAqiData = null
    let newErrors = {}

    const coordinates = cityCoordinates[cityName]
    if (coordinates) {
      newCityData = { city: cityName, lat_long: coordinates }

      const [lat, lon] = coordinates.split(',')
      try {
        const aqiResponse = await fetch(`/api/waqi?lat=${lat}&lon=${lon}`)
        if (aqiResponse.ok) {
          newAqiData = await aqiResponse.json()
        } else {
          const errorData = await aqiResponse.json()
          newErrors.aqi = errorData.error
        }
      } catch (error) {
        newErrors.aqi = error.message
      }
    } else {
      newErrors.coordinates = 'City coordinates not found'
    }

    setClientData({ cityData: newCityData, aqiData: newAqiData, errors: newErrors })
    setLoading(false)
  }

  const { cityData: currentCityData, aqiData: currentAqiData, errors: currentErrors } = clientData
  const { isOpen: isExplanationOpen, onToggle: onExplanationToggle } = useDisclosure()

  const getAqiLevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: 'green' }
    if (aqi <= 100) return { level: 'Moderate', color: 'yellow' }
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: 'orange' }
    if (aqi <= 200) return { level: 'Unhealthy', color: 'red' }
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'purple' }
    return { level: 'Hazardous', color: 'maroon' }
  }

  const calculateCigarettes = (aqi) => {
    return Math.round((aqi / 23.5) * 10) / 10 // Using 23.5 as average of 22-25
  }

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  if (loading) {
    return (
      <Container maxW="2xl" py={10}>
        <VStack spacing={8}>
          <Heading size="xl">{cityName} Details</Heading>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading city data...</Text>
        </VStack>
      </Container>
    )
  }

  if (!currentCityData) {
    return (
      <Container maxW="2xl" py={10}>
        <Alert status="error" borderRadius="xl">
          <AlertIcon />
          <AlertTitle>City not found!</AlertTitle>
          <AlertDescription>Unable to load data for this city.</AlertDescription>
        </Alert>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>{currentCityData.city} Air Quality - PuffsIndex</title>
        <meta name="description" content={`Air quality data for ${currentCityData.city}. AQI: ${currentAqiData?.aqi || 'Loading'}, Cigarette equivalent: ${currentAqiData ? calculateCigarettes(currentAqiData.aqi) : 'Loading'} per day.`} />
        <meta property="og:title" content={`${currentCityData.city} Air Quality - PuffsIndex`} />
        <meta property="og:description" content={`AQI: ${currentAqiData?.aqi || 'Loading'} equals ${currentAqiData ? calculateCigarettes(currentAqiData.aqi) : 'Loading'} cigarettes per day`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${currentCityData.city} Air Quality`} />
        <meta name="twitter:description" content={`AQI: ${currentAqiData?.aqi || 'Loading'} = ${currentAqiData ? calculateCigarettes(currentAqiData.aqi) : 'Loading'} cigarettes/day`} />
        <link rel="canonical" href={`https://puffsindex.com/city/${currentCityData.city.toLowerCase()}`} />
      </Head>
      <Container maxW="2xl" py={10}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Box>
            <HStack mb={2}>
              <Box
                w={8}
                h={8}
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="lg" color="white">
                  🚬
                </Text>
              </Box>
              <Heading size="lg" color="gray.600">
                PuffsIndex
              </Heading>
            </HStack>
            <Heading size="2xl" color="blue.600">
              {currentCityData.city}
            </Heading>
          </Box>
          <Button
            leftIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            variant="outline"
            colorScheme="blue"
          >
            Back
          </Button>
        </HStack>

        {currentAqiData ? (
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="md" color="green.600">Air Quality Index</Heading>
                <Divider />

                <HStack justify="space-between" w="full" spacing={8}>
                  <Stat>
                    <StatLabel>AQI Level</StatLabel>
                    <HStack>
                      <StatNumber fontSize="4xl" color={getAqiLevel(currentAqiData.aqi).color + '.500'}>
                        {currentAqiData.aqi}
                      </StatNumber>
                    </HStack>
                    <Badge colorScheme={getAqiLevel(currentAqiData.aqi).color} variant="solid" size="lg">
                      {getAqiLevel(currentAqiData.aqi).level}
                    </Badge>
                  </Stat>

                  <Stat>
                    <StatLabel>Cigarette Equivalent</StatLabel>
                    <HStack>
                      <StatNumber fontSize="4xl" color="red.500">
                        {calculateCigarettes(currentAqiData.aqi)}
                      </StatNumber>
                      <Text fontSize="lg" color="gray.500">per day</Text>
                    </HStack>
                    <Badge colorScheme="red" variant="outline">
                      Daily Exposure
                    </Badge>
                  </Stat>
                </HStack>

                <Box w="full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onExplanationToggle}
                    rightIcon={<Icon as={ChevronDownIcon} transform={isExplanationOpen ? 'rotate(180deg)' : 'rotate(0deg)'} transition="transform 0.2s" />}
                  >
                    How is this calculated?
                  </Button>

                  <Collapse in={isExplanationOpen}>
                    <Box mt={3} p={4} bg="gray.50" borderRadius="md">
                      <Text fontSize="sm" color="gray.700">
                        <strong>Calculation Method:</strong><br/>
                        • Rule of thumb: 22-25 AQI ≈ 1 cigarette per day<br/>
                        • We use 23.5 as the average (middle of 22-25 range)<br/>
                        • Formula: Cigarettes = AQI ÷ 23.5<br/>
                        • Current calculation: {currentAqiData.aqi} ÷ 23.5 = {calculateCigarettes(currentAqiData.aqi)} cigarettes<br/><br/>
                        <strong>Note:</strong> This is an approximation based on particulate matter exposure and should not be considered medical advice.<br/><br/>
                        <strong>Note:</strong> If you still feel the cigarette count is less, watch{' '}
                        <Link href="https://www.youtube.com/watch?v=q4DkVbpI7cw" target="_blank" rel="noopener noreferrer">
                          <Text as="span" color="blue.500" textDecoration="underline" cursor="pointer">
                            this detailed explanation video
                          </Text>
                        </Link>
                        {' '}about air pollution and cigarette equivalency.
                      </Text>
                    </Box>
                  </Collapse>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Alert status="warning" borderRadius="xl">
            <AlertIcon />
            <Box>
              <AlertTitle>Air Quality Data Unavailable</AlertTitle>
              <AlertDescription>
                {currentErrors?.aqi || 'Unable to fetch air quality data for this location.'}
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <Box textAlign="center" pt={8} borderTop="1px" borderColor={borderColor}>
          <HStack justify="center" spacing={2}>
            <Box
              w={6}
              h={6}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="sm" color="white">
                🚬
              </Text>
            </Box>
            <Text fontSize="sm" color="gray.500">
              Powered by PuffsIndex
            </Text>
          </HStack>
        </Box>
      </VStack>
    </Container>
    </>
  )
}

export async function getStaticPaths() {
  // Only pre-generate a few popular cities to speed up build
  const popularCities = ['Callao (Peru)']
  const paths = popularCities.map(city => ({
    params: { city: city.toLowerCase() }
  }))

  return {
    paths,
    fallback: 'blocking' // Generate other pages on-demand
  }
}

export async function getStaticProps({ params }) {
  try {
    const cityName = Object.keys(cityCoordinates).find(city => city.toLowerCase() === params.city)

    if (!cityName) {
      return { notFound: true }
    }

    const isClientSide = process.env.CLIENT_SIDE_RENDERING === 'true'

    if (isClientSide) {
      return {
        props: {
          cityData: null,
          aqiData: null,
          errors: {},
          isClientSide: true,
          cityName
        }
      }
    }

  let cityData = null
  let aqiData = null
  let errors = {}

  const coordinates = cityCoordinates[cityName]
  if (coordinates) {
    cityData = { city: cityName, lat_long: coordinates }

    const [lat, lon] = coordinates.split(',')
    const WAQI_TOKEN = process.env.WAQI_TOKEN

    if (!WAQI_TOKEN) {
      errors.aqi = 'WAQI token not configured'
    } else {
      try {
        const aqiResponse = await fetch(`http://api.waqi.info/feed/geo:${lat};${lon}?token=${WAQI_TOKEN}`)
        const data = await aqiResponse.json()

        if (data.status !== 'ok') {
          errors.aqi = 'Location not found or API error'
        } else {
          aqiData = {
            aqi: data.data.aqi,
            idx: data.data.idx
          }
        }
      } catch (aqiError) {
        errors.aqi = `WAQI API error: ${aqiError.message}`
      }
    }
  } else {
    errors.coordinates = 'City coordinates not found'
  }

    return {
      props: {
        cityData,
        aqiData,
        errors,
        isClientSide: false,
        cityName
      },
      revalidate: 3600
    }
  } catch (error) {
    console.error('getStaticProps error:', error)
    return {
      props: {
        cityData: { city: cityName || params.city, lat_long: 'Unknown' },
        aqiData: null,
        errors: { aqi: 'Service temporarily unavailable' },
        isClientSide: false,
        cityName: cityName || params.city
      },
      revalidate: 60
    }
  }
}