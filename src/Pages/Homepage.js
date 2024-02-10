import React, { useEffect } from 'react'
import {Box, Container,Text, Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {

  const navigate = useNavigate()
  useEffect(()=>{
     const user =  localStorage.getItem("userInfo")
     if(user){
      navigate('/chats')
     }
  },[navigate])

  return (
    <Container maxW='xl'  centerContent>
      <Box
      display="flex"
      justifyContent="center"
      p={3}
      bg={"white"}
      width={"100%"}
      m={"40px 0 15px 0"}
      borderRadius={"lg"}
      borderWidth={"1px"}
      >
        <Text fontSize="4xl" fontFamily={'Work sans'} color={"black"}>My-Chat-App</Text>
      </Box>
      <Box color={"black"} bg={"white"} w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"}>
      <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab  width={"50%"} _selected={{bg:'#876dc0', color:"white"}} color={"black"}>Login</Tab>
            <Tab width={"50%"}  _selected={{bg:'#876dc0', color:"white"}} color={"black"} >Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage