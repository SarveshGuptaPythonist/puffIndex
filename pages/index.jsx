import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Box,
  Container,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  List,
  ListItem,
  useDisclosure,
  Collapse,
  HStack,
  Spinner
} from '@chakra-ui/react'
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { cityCoordinates } from '../data/cityCoordinates'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [isNavigating, setIsNavigating] = useState(false)
  const { isOpen, onToggle } = useDisclosure()
  const router = useRouter()

  const filteredCities = useMemo(() => {
    return Object.keys(cityCoordinates).filter(city =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleCitySelect = async (city) => {
    setSelectedCity(city)
    setSearchTerm(city)
    onToggle()
    setIsNavigating(true)
    await router.push(`/city/${city.toLowerCase()}`)
  }

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  if (isNavigating) {
    return (
      <Container maxW="md" py={20}>
        <VStack spacing={8} align="center">
          <Box
            w={16}
            h={16}
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            borderRadius="2xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.1)', opacity: 0.7 },
                '100%': { transform: 'scale(1)', opacity: 1 }
              },
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          >
            <Text fontSize="3xl" color="white">
              🚬
            </Text>
          </Box>
          <VStack spacing={3}>
            <Heading size="lg" color="blue.600">
              Loading {selectedCity}...
            </Heading>
            <Text color="gray.500">
              Calculating cigarette equivalent
            </Text>
            <Spinner size="lg" color="blue.500" thickness="3px" />
          </VStack>
        </VStack>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>PuffsIndex - Air Quality in Cigarette Terms</title>
        <meta name="description" content="Stop using confusing PM2.5 numbers. PuffsIndex converts air pollution to cigarette equivalents - because your health deserves clarity, not confusion." />
        <meta property="og:title" content="PuffsIndex - Air Quality in Cigarette Terms" />
        <meta property="og:description" content="Convert air pollution to cigarette equivalents. Understanding air quality in terms everyone recognizes." />
        <meta property="og:url" content="https://puffsindex.com" />
        <meta name="twitter:title" content="PuffsIndex - Air Quality in Cigarette Terms" />
        <meta name="twitter:description" content="Stop using PM2.5 numbers, start using cigarette equivalents for air quality" />
      </Head>
      <Container maxW="md" py={20}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <HStack justify="center" mb={4}>
            <Box
              w={12}
              h={12}
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="xl"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="2xl" color="white" fontWeight="bold">
                🚬
              </Text>
            </Box>
            <Heading
              size="2xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              PuffsIndex
            </Heading>
          </HStack>
          <Text color="gray.500" fontSize="lg">
            Stop using PM2.5 Index start using cigarette Index
          </Text>

          <Box mt={4} p={4} bg="gray.50" borderRadius="lg" border="1px" borderColor="gray.200">
            <Text fontSize="sm" color="gray.600" textAlign="center" fontStyle="italic">
              “I’ve been seeing news for weeks saying India effectively ‘smokes X cigarettes a day’ because of air pollution. Maybe it’s time to stop using AQI and start using cigarettes — we might have been calculating it wrong.”
            </Text>
          </Box>
        </Box>

        <Box position="relative">
          <Flex
            align="center"
            bg={bgColor}
            border="2px"
            borderColor={borderColor}
            borderRadius="xl"
            px={4}
            py={3}
            cursor="pointer"
            onClick={onToggle}
            _hover={{ borderColor: 'blue.300' }}
            transition="all 0.2s"
          >
            <Icon as={SearchIcon} color="gray.400" mr={3} />
            <Input
              placeholder="Search for a city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              border="none"
              _focus={{ boxShadow: 'none' }}
              fontSize="lg"
            />
            {/* <Icon
              as={ChevronDownIcon}
              color="gray.400"
              transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
              transition="transform 0.2s"
            /> */}
          </Flex>

          <Collapse in={isOpen || searchTerm.length > 0}>
            <Box
              position="absolute"
              top="100%"
              left={0}
              right={0}
              zIndex={10}
              bg={bgColor}
              border="1px"
              borderColor={borderColor}
              borderRadius="xl"
              mt={2}
              maxH="300px"
              overflowY="auto"
              shadow="lg"
            >
              <List spacing={0}>
                {filteredCities.slice(0, 10).map((city) => (
                  <ListItem
                    key={city}
                    px={4}
                    py={3}
                    cursor="pointer"
                    _hover={{ bg: 'blue.50' }}
                    onClick={() => handleCitySelect(city)}
                    borderBottom="1px"
                    borderColor={borderColor}
                    _last={{ borderBottom: 'none' }}
                  >
                    <Text fontSize="lg">{city}</Text>
                  </ListItem>
                ))}
                {filteredCities.length === 0 && searchTerm && (
                  <ListItem px={4} py={3}>
                    <Text color="gray.500">No cities found</Text>
                  </ListItem>
                )}
              </List>
            </Box>
          </Collapse>
        </Box>

        {/* {selectedCity && (
          <Button
            size="lg"
            colorScheme="blue"
            onClick={() => router.push(`/city/${selectedCity.toLowerCase()}`)}
            leftIcon={<SearchIcon />}
          >
            View {selectedCity} Details
          </Button>
        )} */}
      </VStack>
    </Container>
    </>
  )
}