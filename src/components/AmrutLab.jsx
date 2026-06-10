import styled from 'styled-components';
import { motion } from 'framer-motion';

const LabContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
`;

const Placeholder = styled(motion.div)`
  text-align: center;
  padding: 40px;

  h1 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 12px;
  }

  p {
    font-size: 0.95rem;
    opacity: 0.6;
  }
`;

export default function AmrutLab() {
    return (
        <LabContainer>
            <Placeholder
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>Amrut&apos;s Lab</h1>
                <p>Coming soon...</p>
            </Placeholder>
        </LabContainer>
    );
}
