import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Button } from "@chakra-ui/react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
// import { Button } from "@chakra-ui/react";

const MyChats = ( {fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {

    const token = JSON.parse(localStorage.getItem("userInfo"))
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      };

      const { data } = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/api/chat`, config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
   <Box
   display={{base: selectedChat ? "none" : "flex" , md:"flex"}}
   flexDir={"column"}
   alignItems={"center"}
   p={3}
   bg={"white"}
   width={{base:"100%", md:"31%"}}
    borderRadius={"1g"}
    borderWidth={"1px"}

   >

    <Box
    pb={3}
    px={3}
    fontSize={{base:"20px", md:"30px"}}
    fontFamily={"Work sans"}
    display={"flex"}
    w={"100%"}
    justifyContent={"space-between"}
    alignItems={"center"}
    >

    My Chats
    <GroupChatModal>

    <Button
     backgroundColor={"white"}
     border={"1px"}
     borderColor={"#6f4fb3"}
     display={"flex"}
     fontSize={{base:"17px",md:"10px",lg:"17px"}}
     rightIcon={<AddIcon/>}
     _hover={{
      backgroundColor:'#6f4fb3',
      color:'white'
     }}
     >
      New Group Chat
    </Button>

      </GroupChatModal>

    </Box>

    <Box
    display={"flex"}
    flexDir={"column"}
    p={3}
    width={"100%"}
    height={"100%"}
    borderRadius={"lg"}
    overflow={"hidden"}
    >

      {chats? (
        <Stack
        overflow={"scroll"}

        >
          {chats.map((chat)=> (
            <Box
            onClick={() => setSelectedChat(chat)}
            cursor="pointer"
            border={"1px"}
            borderColor={"#6f4fb3"}
            bg={selectedChat === chat ? "#6f4fb3" : "white"}
            color={selectedChat === chat ? "white" : "black"}
            px={3}
            py={2}
            borderRadius="lg"
            key={chat._id}
            _hover={{
              backgroundColor:'#6f4fb3',
              color:"white"
            }}
            >
              <Text>
                {!chat.isGroupChat ? getSender(loggedUser,chat.users) : (chat.chatName)}
              </Text>
            </Box>
          ))}
        </Stack>
      ):(
        <ChatLoading/>
      )}
    </Box>

   </Box>

  );
};

export default MyChats;
