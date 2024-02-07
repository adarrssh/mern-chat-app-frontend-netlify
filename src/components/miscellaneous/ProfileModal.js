import { ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (

                    <IconButton
                        display={{ base: "flex" }}
                        icon={<ViewIcon />}
                        onClick={onOpen}
                    />
                )


            }


            <Modal 
            isOpen={isOpen}
            onClose={onClose}
            size={"lg"}
            isCentered

            >
                <ModalOverlay />
                <ModalContent height={"400px"}>
                    <ModalHeader
                        fontSize={"40px"}
                        fontFamily={"Work sans"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                    {user.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody 
                        display={"flex"}
                        flexDir={"column"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                    >
                        <Image
                        borderRadius={"full"}
                        boxSize={"150px"}
                        src={user.pic}
                        alt={user.name}
                        />
                        <Text
                        fontSize={{base:"20px", md:"30px"}}
                        fontFamily="Work sans"
                        >
                        Email: {user.email}
                        </Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button 
                        border={'1px'}
                        borderColor={'#F7A4A7'}
                        backgroundColor='white' 
                        color={'black'}
                        _hover={{
                            backgroundColor:'white',
                            color:'#F18184',
                            border:'1px',
                            borderColor:'#F18184'
                        }}
                        mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal