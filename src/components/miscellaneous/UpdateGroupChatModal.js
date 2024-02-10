import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from './UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {

    
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState();
    const [searchResult, setSearchResult] = useState();
    const [loading, setLoading] = useState();
    const [renameLoading, setRenameLoading] = useState();
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast();

    const { selectedChat, setSelectedChat, user } = ChatState()

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
          toast({
            title: "Only admins can remove someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `${process.env.REACT_APP_BASE_API_URL}/api/chat/groupremove`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          fetchMessages()
          setLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
        setGroupChatName("");
      };
    
    const handleRename = async () => {
        if (!groupChatName) return;
    
        try {
          setRenameLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `${process.env.REACT_APP_BASE_API_URL}/api/chat/rename`,
            {
              chatId: selectedChat._id,
              chatName: groupChatName,
            },
            config
          );
    
          // setSelectedChat("");
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setRenameLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setRenameLoading(false);
        }
        setGroupChatName("");
      };


    const handleSearch = async (query) => {

        setSearch(query);
        if (!query) {
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/user?search=${search}`, config);
          console.log(data);
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setLoading(false);
        }

    }


    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
          toast({
            title: "User Already in group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
    
        if (selectedChat.groupAdmin._id !== user._id) {
          toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
    
        try {
          setLoading(true);
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.put(
            `${process.env.REACT_APP_BASE_API_URL}/api/chat/groupadd`,
            {
              chatId: selectedChat._id,
              userId: user1._id,
            },
            config
          );
    
          setSelectedChat(data);
          setFetchAgain(!fetchAgain);
          setLoading(false);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
        setGroupChatName("");
      };
    

    return (
        <>
            <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}>Open Modal</IconButton>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                    fontSize={"35px"}
                    fontFamily={"Work sans"}
                    display={"flex"}
                    justifyContent={"center"}
                    >{selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box  
                        width={"100%"}
                        display={"flex"}
                        flexWrap={"wrap"}
                        pb={3}
                        >
                            {selectedChat.users.map(u=> (
                                <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={()=> handleRemove(u)}
                                />
                            ))}
                        </Box>

                        <FormControl
                        display={"flex"}
                        >
                            <Input
                            placeholder="Chat Name"
                            focusBorderColor='#6f4fb3'

                            mb={3}
                            value={groupChatName}
                            onChange={(e)=> setGroupChatName(e.target.value)}
                            />
                            <Button
                              backgroundColor='white'
                              color='#6f4fb3'
                              border = '1px'
                              borderColor='#6f4fb3'
                              _hover={{ bg:'#6f4fb3', color:'white' , border : '1px', borderColor:'#6f4fb3'}}
                            ml={1}
                            isLoading={renameLoading}
                            onClick={handleRename}

                            >
                                update
                            </Button>
                        </FormControl>

                        <FormControl>
                            <Input
                            placeholder='Add User to group'
                            mb={1}
                            focusBorderColor='#6f4fb3'

                            onChange={(e)=> handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {
                         loading ? (
                            <Spinner size={"lg"}/>
                         ) 
                         : 
                         ( searchResult?.map((user)=>(
                            <UserListItem
                             key={user._id}
                             user={user}
                             handleFunction={()=> handleAddUser(user)}
                            />
                         )))

                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button onClick={() => handleRemove(user)} 
                          backgroundColor='white'
                          color='#6f4fb3'
                          border = '1px'
                          borderColor='#6f4fb3'
                          _hover={{ bg:'#6f4fb3', color:'white' , border : '1px', borderColor:'#6f4fb3'}}
                        >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal