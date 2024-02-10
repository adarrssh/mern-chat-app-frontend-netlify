import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from "../UserAvatar/UserListItem"
import UserBadgeItem from './UserBadgeItem'

const GroupChatModal = ({ children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState()
    const [loading, setLoading] = useState()

    const toast = useToast()

    const { user, chats, setChats } = ChatState()


    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return;
        }

        try {
            setLoading(true)

            // const user = JSON.parse(localStorage.getItem("userInfo"))
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/user?search=${query}`, config)
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            console.error(error)
            toast({
                title: "Error Occurred",
                description: "Failed to Load the serach Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            })
        }
    }

    const handleSubmit = async () => {
        if(!groupChatName || !selectedUsers){
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return;
        }

        try {
             // const user = JSON.parse(localStorage.getItem("userInfo"))
             const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/api/chat/group`,{
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u)=>u._id))
            }, config)

            setChats([response.data, ...chats]);
            onClose()
            toast({
                title:"New Group Chat Created",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
        } catch (error) {
            console.error(error)
            toast({
                title:"Failed to Create the Chat!",
                description:error?.response?.data,
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers?.includes(userToAdd)) {
            toast({
                title: "User already added",
                description: "warning",
                duration: 5000,
                isClosable: true,
                position: "top"
            })
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleDelete = (deleteUser) => {
        setSelectedUsers(selectedUsers.filter(user=>user._id !== deleteUser._id))
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={"35px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"center"}
                    >
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                mb={3}
                                focusBorderColor='#6f4fb3'
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add Users eg: "
                                mb={1}
                                focusBorderColor='#6f4fb3'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box width={"100%"} display={"flex"} flexWrap="wrap">

                        {
                            selectedUsers?.map(u=>(
                                <UserBadgeItem 
                                key={u._id}
                                user={u}
                                handleFunction={()=>handleDelete(u)}
                                />
                                ))
                            }    
                        </Box>

                        {loading ?
                            <div>loading</div>
                            :
                            (searchResult?.slice(0, 4)?.map((user) => (
                                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                            )))
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                        border={"1px"}
                        backgroundColor='white'
                        borderColor='#6f4fb3'
                        color={'black'}
                        _hover={{
                            border:'1px',
                            borderColor:'#6f4fb3',
                            backgroundColor:'#6f4fb3',
                            color:'white',
                        }}
                        fontWeight={"500"}
                         onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal