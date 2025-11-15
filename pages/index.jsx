import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
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
  Collapse
} from '@chakra-ui/react'
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { cityCoordinates } from '../data/cityCoordinates'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const { isOpen, onToggle } = useDisclosure()
  const router = useRouter()

  const filteredCities = useMemo(() => {
    return Object.keys(cityCoordinates).filter(city =>
      city.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleCitySelect = (city) => {
    setSelectedCity(city)
    setSearchTerm(city)
    onToggle()
    router.push(`/city/${city.toLowerCase()}`)
  }

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading
            size="2xl"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
            mb={2}
          >
            City Air Quality
          </Heading>
          <Text color="gray.500" fontSize="lg">
            Discover air quality data for cities across India
          </Text>
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
  )
}