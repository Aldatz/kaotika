import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input} from "@nextui-org/react"
import KaotikaButton from '@/components/KaotikaButton';
import { useEffect, useRef, useState } from 'react';

const Welcome = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kaotikaName, setKaotikaName] = useState<string | null>(null);

  useEffect(() => {
    const nickname = sessionStorage.getItem('nickname');
    if(nickname) setKaotikaName(nickname);
  }, [])
  

  const handleSaveName = () => {
    if(inputRef.current?.value) {
      setKaotikaName(inputRef.current.value);
      sessionStorage.setItem('nickname', inputRef.current.value);
      onClose();
    }
  }

  const handleNext = () => {
    router.push('/player');
  };

  const handleCancel = () => {
    handleSignOut();
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800 text-medievalSepia">
      <h1 className="text-8xl mb-8">Welcome to Legends of Kaotika, {kaotikaName ? kaotikaName : session?.user?.name}</h1>
      <h2 className="text-4xl mb-8 p-10">Today marks the beginning of your journey, a path filled with challenges and discoveries. As you step into this new adventure of Kaotika, remember that your dedication and commitment will be your greatest guides. Embrace the spirit of the Old School, where tradition meets innovation, and let it lead you to unparalleled growth and mastery. The road ahead may be demanding, but with determination and the support of your peers, you will achieve greatness. Welcome to the brotherhood; your adventure starts now.</h2>
      <h2 className="text-4xl mb-8">Let's set up your acolyte</h2>
      <h2 className="text-4xl mb-8">Do you want to change the name of your acolyte?</h2>
      <button
        onClick={onOpen}
        className="bg-medievalSepia w-1/4 text-black text-4xl py-2 px-4 mt-10 rounded  hover:bg-darkSepia transition"
        >
        Yes, I want to do it 
      </button>
      <button
        onClick={handleNext}
        className="bg-medievalSepia w-1/4 text-black text-4xl py-2 px-4 mt-10 rounded  hover:bg-darkSepia transition"
        >
        Continue 
      </button>
      <button
        onClick={handleCancel}
        className="bg-darkSepia w-1/4 text-white text-4xl py-2 px-4 mt-10 rounded  hover:bg-black transition"
        >
        Cancel
      </button>


      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
        size='3xl'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-4xl font-light">Selecting an epic name</ModalHeader>
              <ModalBody>
                <Input
                  ref={inputRef}
                  autoFocus
                  placeholder="Enter your epic name"
                  variant="bordered"
                  classNames={{
                    input:"text-4xl font-light"
                  }}
                />  
              </ModalBody>
              <ModalFooter>
                <KaotikaButton handleClick={onClose} text='Cancel' />
                <KaotikaButton handleClick={handleSaveName} text='Save' />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>

  );
};

export default Welcome;