'use client';

/* eslint-disable react/prop-types */
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';


const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.glass};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  padding: 40px;
  max-width: 420px;
  width: 90%;
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      ${({ theme }) => theme.colors.primary} 50%,
      transparent 100%);
    border-radius: 16px 16px 0 0;
  }
`;

const ModalIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h3`
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 10px 0;
`;

const ModalText = styled.p`
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  margin: 0 0 28px 0;
`;

const ModalPrimaryBtn = styled(motion.button)`
  width: 100%;
  padding: 14px 24px;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.background};
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 12px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px ${({ theme }) => `${theme.colors.primary}50`};
    transform: translateY(-1px);
  }
`;

const ModalSecondaryBtn = styled(motion.button)`
  width: 100%;
  padding: 12px 24px;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

export default function FullscreenModal({ isOpen, onClose }) {
    const router = useRouter();

    const handleGoFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().then(() => {
                onClose();
                router.push('/amrutlab');
            }).catch(() => {
                onClose();
                router.push('/amrutlab');
            });
        } else {
            onClose();
            router.push('/amrutlab');
        }
    };

    const handleSkipFullscreen = () => {
        onClose();
        router.push('/amrutlab');
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <ModalOverlay
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                >
                    <ModalContent
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <ModalIcon>⛶</ModalIcon>
                        <ModalTitle>Best in Fullscreen</ModalTitle>
                        <ModalText>
                            Amrut&apos;s Lab is designed for an immersive experience. Switch to fullscreen for the best view.
                        </ModalText>
                        <ModalPrimaryBtn
                            onClick={handleGoFullscreen}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Go Fullscreen & Enter
                        </ModalPrimaryBtn>
                        <ModalSecondaryBtn
                            onClick={handleSkipFullscreen}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            Continue without fullscreen
                        </ModalSecondaryBtn>
                    </ModalContent>
                </ModalOverlay>
            )}
        </AnimatePresence>
    );
}
