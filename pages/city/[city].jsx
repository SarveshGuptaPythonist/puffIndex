import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
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
  useColorModeValue
} from '@chakra-ui/react'
import { ArrowBackIcon, InfoIcon } from '@chakra-ui/icons'
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

  const getAqiLevel = (aqi) => {
    if (aqi <= 50) return { level: 'Good', color: 'green' }
    if (aqi <= 100) return { level: 'Moderate', color: 'yellow' }
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: 'orange' }
    if (aqi <= 200) return { level: 'Unhealthy', color: 'red' }
    if (aqi <= 300) return { level: 'Very Unhealthy', color: 'purple' }
    return { level: 'Hazardous', color: 'maroon' }
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
    <Container maxW="2xl" py={10}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="2xl" color="blue.600">
              {currentCityData.city}
            </Heading>
            <Badge
              colorScheme={isClientSide ? 'orange' : 'green'}
              variant="subtle"
              mt={2}
            >
              {isClientSide ? 'Client-side rendered' : 'Server-side rendered'}
            </Badge>
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

        <Card bg={cardBg} border="1px" borderColor={borderColor}>
          <CardBody>
            <VStack align="start" spacing={4}>
              <HStack>
                <InfoIcon color="blue.500" />
                <Heading size="md">Location Details</Heading>
              </HStack>
              <Stat>
                <StatLabel>Coordinates</StatLabel>
                <StatNumber fontSize="lg">{currentCityData?.lat_long || 'Loading...'}</StatNumber>
                <StatHelpText>Latitude, Longitude</StatHelpText>
              </Stat>
            </VStack>
          </CardBody>
        </Card>

        {currentAqiData ? (
          <Card bg={cardBg} border="1px" borderColor={borderColor}>
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="md" color="green.600">Air Quality Index</Heading>
                <Divider />

                <HStack justify="space-between" w="full">
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
                </HStack>

                {/* <Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">
                    Station ID
                  </Text>
                  <Text fontSize="lg">{currentAqiData.idx}</Text>
                </Box> */}
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
      </VStack>
    </Container>
  )
}

export async function getStaticPaths() {
  const paths = Object.keys(cityCoordinates).map(city => ({
    params: { city: city.toLowerCase() }
  }))

  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
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
}